import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import axios from 'axios'
import {db} from '@/lib/db'

export const POST = async (request: NextRequest) => {
  try {
    const { searchParams } = request.nextUrl
    const merchantTransactionId = searchParams.get('id')

    if (!merchantTransactionId) {
      return NextResponse.json(
        { error: 'Transaction ID is required' },
        { status: 400 }
      )
    }

    const keyIndex = 1
    const string = `/pg/v1/status/${process.env.MERCHANT_ID}/${merchantTransactionId}` + process.env.MERCHANT_KEY
    const sha256 = crypto.createHash('sha256').update(string).digest('hex')
    const checksum = `${sha256}###${keyIndex}`

    const option = {
      method: 'GET',
      url: `${process.env.MERCHANT_STATUS_URL}/${process.env.MERCHANT_ID}/${merchantTransactionId}`,
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
        'X-MERCHANT-ID': process.env.MERCHANT_ID,
      },
    }

    const res = await axios.request(option)
    if (res.data.success) {

        const payment = await db.payment.findUnique({
            where: { id: merchantTransactionId },
            include: { user: true },
        })

        if (!payment) return NextResponse.json({ error: 'Not found' })
        const amountPaid = ((Number(JSON.parse(res.data.data.amount)))/100)
        await db.user.update({
            where: { id: payment.userId },
            data: { fine: { decrement: amountPaid } },
        })

        await db.payment.update({
            where: { id: merchantTransactionId },
            data: { status: 'SUCCESS' },
        })

      return NextResponse.redirect('http://localhost:3000/user/profile',{
        status:301
      })
    } else {
      return NextResponse.json({ error: 'Payment Failed' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      { error: 'Server error during payment status check' },
      { status: 500 }
    )
  }
}
