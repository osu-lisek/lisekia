import ChangePassword, { ChangePasswordServerState } from "@/components/forms/change-password";
import { useServerSession } from "@/hooks/useSession"
import { redirect } from "next/navigation";

interface Props {
    params: {
        token: string
    }
}

export default async function Page({ params: { token } }: Props) {

    let { user } = await useServerSession();

    if (user) return redirect("/");

    let { ok } = await fetch(`https://osu.lisek.cc/api/v1/auth/forgot-password/${token}`).then(res => res.json());

    if (!ok) return redirect("/");

    async function changePassword(state: ChangePasswordServerState, payload: FormData): Promise<ChangePasswordServerState> {
        'use server'

        let password = payload.get('password') as string;
        let password_repeat = payload.get('password_repeat') as string;
        let captcha = payload.get('cf-turnstile-response') as string;

        if (password.length < 8) return {
            ok: false,
            message: "Password must be at least 8 characters long"
        }
        
        if (password !== password_repeat) return {
            ok: false,
            message: "Passwords do not match"
        }

        let { ok, message } = await fetch(`https://osu.lisek.cc/api/v1/auth/forgot-password/${token}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                captcha: captcha,
                password
            })
        }).then(res => res.json());

        if (!ok) return {
            ok: false,
            message
        }

        return {
            ok: true,
            message: "Password has been changed, now you can log in using new password."
        }
    }

    return (<ChangePassword action={changePassword} />)
}