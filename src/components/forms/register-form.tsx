'use client';

import { CheckIcon, Loader2Icon, LockIcon, MailIcon, UserIcon, XIcon } from "lucide-react";
import { FormButton } from "../ui/FormButton";
import InputFieldWithIcon from "../ui/InputFieldWithIcon";
import { useFormState } from "react-dom";
import Link from "next/link";
import { Turnstile } from "@marsidev/react-turnstile";
import { Suspense, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export interface RegisterServerState {
    ok: boolean;
    hints: {
        username: string;
        email: string;
        password: string;
    };
    message: string;
}

export interface RegisterPayload {
    username: string;
    password: string;
    email: string;
    'cf-turnstile-response': string;
}

export default function RegisterForm({ action }: { action: (state: RegisterServerState, payload: FormData) => Promise<RegisterServerState> }) {

    const [state, formAction] = useFormState(action, { ok: false, message: "", hints: { password: "", username: "", email: "" } });
    const [captchaState, setCaptchaState] = useState<"loading" | "finished" | "failed">("loading");


    return (<form action={formAction} className="flex justify-center flex-col gap-2 w-[80%] sm:w-[70%] py-6 mb-6 mt-3">
        <div className="flex flex-col gap-2">
            <InputFieldWithIcon state={state.hints.username} icon={<UserIcon />} className="w-full appearance-none py-2 px-2 placeholder:text-background-200 outline:none focus:outline-none" type="login" placeholder="Username" name="username" title="Username" required={true} />
            <InputFieldWithIcon state={state.hints.email} icon={<MailIcon />} className="w-full appearance-none py-2 px-2 placeholder:text-background-200 outline:none focus:outline-none" type="email" placeholder="Email" title="Email" name="email" required={true} />
            <InputFieldWithIcon state={state.hints.password} icon={<LockIcon />} className="w-full appearance-none py-2 px-2 placeholder:text-background-200 outline:none focus:outline-none" type="password" placeholder="Password" title="Password" name="password" required={true} />
            
            {process.env.NEXT_PUBLIC_CAPTCHA_KEY && <Turnstile className="hidden" siteKey={process.env.NEXT_PUBLIC_CAPTCHA_KEY as string} onSuccess={() => setCaptchaState("finished")} onError={() => setCaptchaState("failed")} />}
        </div>
        <div className="flex flex-col gap-1">
            <FormButton disabled={captchaState != "finished"} className="py-2 bg-background-800/50 aria-disabled:bg-background-800/80">Create account</FormButton>
            {process.env.NEXT_PUBLIC_CAPTCHA_KEY && <div data-state={captchaState} className={`data-[state="finished"]:opacity-0 opacity-100 data-[state="loading"]:text-blue-600 data-[state="finished"]:text-blue-600 duration-[300ms] select-none h-10`}>
                {(captchaState == "loading" || captchaState == "finished" )&& <p className="flex flex-row gap-1 w-full justify-center items-center"><Loader2Icon className="animate-spin" /> Awaiting for captcha solve...</p>}
                {captchaState == "failed" && <p className="flex flex-row gap-1 w-full justify-center items-center"><XIcon /> Solve failed, contact adminitrator...</p>}
            </div>}
        </div>
    </form>)
}