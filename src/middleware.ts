import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isValidPAssword } from './lib/isValidPassword'
 
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    if(await isAuthenticUser(request) === false){
        
        return new NextResponse("unauthorized",{
            status:401,
            headers:{'WWW-Authenticate':'basic'}
        })
    }
}

async function isAuthenticUser(req:NextRequest){
    const header = req.headers.get('Authorization') || req.headers.get('authorization')
    
    if(!header){return false}
    
    const [username,password]= Buffer.from(header.split(" ")[1],"base64").toString().split(':')

    return (username === process.env.ADMIN_USERNAME && await isValidPAssword(password , process.env.ADMIN_PASS as string))
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: '/admin/:path*',
}