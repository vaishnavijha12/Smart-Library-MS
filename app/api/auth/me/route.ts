import {NextRequest} from 'next/server'
import {getAuthToken} from '@/lib/auth'

export async function GET(request: NestRequest){
    const token = await getAuthToken()
    return Response.json({AuthToken: token})
}