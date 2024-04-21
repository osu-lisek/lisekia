'use client';

import { LockIcon, MailIcon } from "lucide-react";
import { FormButton } from "../ui/FormButton";
import InputFieldWithIcon from "../ui/InputFieldWithIcon";
import { useFormState } from "react-dom";
import Link from "next/link";

export interface LoginServerState {
    ok: boolean;
    hints: {
        username: string;
        password: string;
    };
    message: string;
}

export interface LoginPayload {
    username: string;
    password: string;
}

export default function LoginForm({ action }: { action: (state: LoginServerState, payload: FormData) => Promise<LoginServerState> }) {

    const [state, formAction] = useFormState(action, { ok: false, message: "", hints: { password: "", username: "" } });


    return (<form action={formAction} className="flex justify-center flex-col gap-2 w-[80%] sm:w-[70%] py-6 mb-6 mt-3">
        <div className="flex flex-col gap-4">
            <InputFieldWithIcon state={state.hints.username} icon={<MailIcon />} className="w-full appearance-none py-2 px-2 placeholder:text-background-200 outline:none focus:outline-none" type="login" placeholder="Login" name="username" title="Username" required={true} />
            <InputFieldWithIcon state={state.hints.username} icon={<LockIcon />} className="w-full appearance-none py-2 px-2 placeholder:text-background-200 outline:none focus:outline-none" type="password" placeholder="Password" title="Password" name="password" required={true} />
        </div>
        <div className="flex flex-col gap-1">
            <FormButton className="py-2 bg-background-800/50 aria-disabled:bg-background-800/80">Authorize</FormButton>
            <Link href={"/reset-password"} className="text-sm text-primary-600 font-semibold">Forgot password?</Link>
            <Link href={"/register"} className="text-sm text-primary-400 font-semibold">Create account</Link>
        </div>
    </form>)
}