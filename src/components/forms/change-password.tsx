'use client'

import { useFormState } from "react-dom";
import { FormButton } from "../ui/FormButton";
import WebsiteAlert, { AlertType } from "../ui/WebsiteAlert";
import { Turnstile } from "@marsidev/react-turnstile"
import { useState } from "react";
import InputFieldWithIcon from "../ui/InputFieldWithIcon";
import { LockIcon } from "lucide-react";

export interface ChangePasswordServerState {
  ok: boolean;
  message: string;
}

export interface ChangePasswordPayload {
  password: string;
  password_repeat: string;
}

export default function ChangePassword({ action }: { action: (state: ChangePasswordServerState, payload: FormData) => Promise<ChangePasswordServerState> }) {

  const [state, formAction] = useFormState(action, { ok: false, message: "" });
  const [allowed, setAllowed] = useState(false);

  return (
    <div className="w-full sm:w-[30%] flex flex-col gap-4">
      <div className="w-full">
        {state.message && <WebsiteAlert data={{ type: state.ok ? AlertType.ok : AlertType.Error, message: state.message }} />}
      </div>
      <div className="bg-background-900/20 min-w-[40%] min-h-20 px-4 py-6 rounded-md flex flex-col justify-center items-center gap-4">
        <div className="text-xl">
          Change password
        </div>


        <form className="py-4 flex flex-col gap-2 w-[60%] justify-center items-center" action={formAction}>
        {/* <input className="w-full shadow appearance-none py-2 px-2 bg-background-700/60 placeholder:text-background-200 rounded-md outline:none focus:outline-none" type="password" placeholder="New password" name="password" required={true} /> */}
        {/* <input className="w-full shadow appearance-none py-2 px-2 bg-background-700/60 placeholder:text-background-200 rounded-md outline:none focus:outline-none" type="password" placeholder="Repeat password" name="repeat_password" required={true} /> */}
        <InputFieldWithIcon icon={<LockIcon />} className="w-full" placeholder="New password" name="password" required={true} type="text" />
        <InputFieldWithIcon icon={<LockIcon />} className="w-full" placeholder="Repeat new password" name="password_repeat" required={true} type="text" />
      
          {process.env.NEXT_PUBLIC_CAPTCHA_KEY && <Turnstile siteKey={process.env.NEXT_PUBLIC_CAPTCHA_KEY} className="hidden" onSuccess={() => setAllowed(true)} /> }
          <FormButton className="px-12 py-2 shadow-md w-full" disabled={state.ok || !allowed}>
            Change password
          </FormButton>
        </form>
      </div>
    </div>
  )
}