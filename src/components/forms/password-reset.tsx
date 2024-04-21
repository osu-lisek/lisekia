'use client'

import { useFormState } from "react-dom";
import { FormButton } from "../ui/FormButton";
import WebsiteAlert, { AlertType } from "../ui/WebsiteAlert";
import { Turnstile } from "@marsidev/react-turnstile"
import { useState } from "react";
import InputFieldWithIcon from "../ui/InputFieldWithIcon";
import { MailIcon } from "lucide-react";

export interface ResetPasswordServerState {
  ok: boolean;
  message: string;
}

export interface ResetPasswordPayload {
  login: string;
}

export default function PasswordResetForm({ action }: { action: (state: ResetPasswordServerState, payload: FormData) => Promise<ResetPasswordServerState> }) {

  const [state, formAction] = useFormState(action, { ok: false, message: "" });
  const [allowed, setAllowed] = useState(false);

  return (
    <div className="w-full sm:w-[30%] flex flex-col gap-4">
      <div className="w-full">
        {state.message && <WebsiteAlert data={{ type: state.ok ? AlertType.ok : AlertType.Error, message: state.message }} />}
      </div>
      <div className="bg-background-900/20 min-w-[40%] min-h-20 px-4 py-6 sm:rounded-md flex flex-col justify-center items-center gap-4">
        <div className="text-xl">
          Reset password
        </div>


        <form className="py-4 flex flex-col w-[80%] gap-2 justify-center items-center" action={formAction}>
          {/* <input className="w-full shadow appearance-none py-2 px-2 bg-background-700/60 placeholder:text-background-200 sm:rounded-md outline:none focus:outline-none" type="text" placeholder="Username or E-Mail" name="login" required={true} /> */}
          <InputFieldWithIcon icon={<MailIcon />} className="w-full" placeholder="Username or E-Mail" name="login" required={true} type="text" />
          {process.env.NEXT_PUBLIC_CAPTCHA_KEY && <Turnstile siteKey={process.env.NEXT_PUBLIC_CAPTCHA_KEY} className="hidden" onSuccess={() => setAllowed(true)} /> }
          <FormButton className="py-2 w-full" disabled={state.ok || !allowed}>
            Reset password
          </FormButton>
        </form>
      </div>
    </div>
  )
}