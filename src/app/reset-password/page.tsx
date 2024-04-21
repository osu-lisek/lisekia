
import PasswordResetForm, { ResetPasswordPayload, ResetPasswordServerState } from "@/components/forms/password-reset";
import { FormButton } from "@/components/ui/FormButton";
import { useServerSession } from "@/hooks/useSession";
import { redirect } from "next/navigation";


export default async function Page() {
  const { user } = await useServerSession();

  async function resetPassword(state: ResetPasswordServerState, payload: FormData): Promise<ResetPasswordServerState> {
    'use server'

    let response = await fetch(`https://lisek.world/api/v1/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        login: payload.get("login") as string,
        captcha: payload.get("cf-turnstile-response") as string,
      })
    }).then(res => res.json());

    if (!response.ok) {
      return {
        ok: false,
        message: response.message
      }
    }

    return {
      ok: true,
      message: "Email with password reset link has been sent."
    }
  }


  if (user) {
    return redirect("/");
  }

  return (<PasswordResetForm action={resetPassword} />)
}