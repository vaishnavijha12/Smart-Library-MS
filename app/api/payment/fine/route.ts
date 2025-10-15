import axios from "axios";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import {db} from '@/lib/db'
import { withAuth } from '@/lib/middleware'

// Constants
const salt_key = process.env.MERCHANT_KEY;
const merchant_id = process.env.MERCHANT_ID;

export const POST = withAuth(async (request: NextRequest) => {
    try {
      const userId = (request as unknown as { user?: { userId?: string } }).user?.userId
      if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const user = await db.user.findUnique({ where: { id: userId } })
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      const reqData = await request.json(); // Parse the request data
      // Extract transaction details
      const merchantTransactionId = reqData.transactionId;

    // Prepare the payload
    const data = {
      merchantId: merchant_id,
      merchantTransactionId: merchantTransactionId,

      amount: user.fine * 100, // Convert to paise (smallest currency unit)
      redirectUrl: `http://localhost:3000/api/payment/status?id=${merchantTransactionId}`,
      redirectMode: "POST",
      callbackUrl: `http://localhost:3000/api/payment/status?id=${merchantTransactionId}`,
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };

    // Encode payload as Base64
    const payload = JSON.stringify(data);
    const payloadMain = Buffer.from(payload).toString("base64");

    // Generate checksum
    const keyIndex = 1;
    const string = payloadMain + "/pg/v1/pay" + salt_key;
    const sha256 = crypto.createHash("sha256").update(string).digest("hex");
    const checksum = `${sha256}###${keyIndex}`;

    // Define PhonePe API URL
    const prod_URL = process.env.MERCHANT_BASE_URL

    // API call options
    const options = {
      method: "POST",
      url: prod_URL,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
      },
      data: {
        request: payloadMain,
      },
    };

    await db.payment.create({
      data: {
        id: merchantTransactionId,
        userId: user.id,
        amount: user.fine,
        status: 'PENDING',
      },
    })

    // Make the API call
    const response = await axios(options);

    // Return the response from PhonePe
    return NextResponse.json(response.data);
  } catch (err) {
    console.error('Payment initiation error:', err);

    // Handle errors
    const details = (err as Error)?.message ?? String(err)
    return NextResponse.json(
      { error: "Payment initiation failed", details },
      { status: 500 }
    );
  }
}) 

