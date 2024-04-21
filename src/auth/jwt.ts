import { CompactSign, SignJWT } from "jose";


const getJWTSecretKey = () => {
    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not defined');
    
    return new TextEncoder().encode(process.env.JWT_SECRET as string);
}

export async function createJWTToken(token: string) {
    return new CompactSign(
        new TextEncoder().encode(JSON.stringify({ token }))
    )
    .setProtectedHeader({ alg: 'ES256' })
    .sign(getJWTSecretKey());
}