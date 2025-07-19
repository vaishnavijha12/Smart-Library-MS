import RegisterForm from "@/components/auth/registerForm"
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyToken } from '@/lib/auth'

export default function Register(){
    const cookieStore = cookies()
        const token = cookieStore.get('auth-token')?.value

        if (token) {
            const payload = verifyToken(token)

            if (payload) {
            if (payload.role === 'USER') {
                redirect('/user/dashboard')
            } else {
                redirect('/librarian/dashboard')
            }
            }
        }
    return(
        <RegisterForm />
    )
}