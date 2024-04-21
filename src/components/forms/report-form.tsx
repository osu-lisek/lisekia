'use client';

import { Loader2Icon, LockIcon, MailIcon } from "lucide-react";
import { FormButton } from "../ui/FormButton";
import InputFieldWithIcon from "../ui/InputFieldWithIcon";
import { useFormState } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Turnstile } from "@marsidev/react-turnstile";
import { useState } from "react";

export interface ReportFormServerState {
    ok: boolean;
    message: string;
    selected_reason: string;
    note: string;
}

export default function ReportForm({ action }: { action: (state: ReportFormServerState, payload: FormData) => Promise<ReportFormServerState> }) {

    const router = useRouter();
    const [state, formAction] = useFormState(action, { ok: false, message: "", note: "", selected_reason: "" });
    const [allowed, setAllowed] = useState(false);

    return (<form action={formAction} className="flex justify-center flex-col gap-2 w-full mb-3 mt-3">
        {!state.ok && state.message && <div className="bg-red rounded-md w-full py-2 flex flex-row justify-center items-center gap-1" dangerouslySetInnerHTML={{__html: state.message}}>
        </div>}
        <div className="flex flex-col gap-4">
            <select name="selected_reason" className="bg-background-900/50 rounded-md w-full appearance-none py-2 px-2 placeholder:text-background-700 outline:none focus:outline-none">
                <option>Cheating</option>
                <option>Spam</option>
                <option>Inappropriate content</option>
                <option>Other</option>
            </select>
            <textarea className="bg-background-900/50 rounded-md w-full py-2 px-2 placeholder:text-background-200 outline:none focus:outline-none resize-none h-32" placeholder="Notes or details that would be userful for us" name="note" title="Note" required={true} />
        </div>
        <Turnstile siteKey={process.env.NEXT_PUBLIC_CAPTCHA_KEY as string} className="hidden" onSuccess={() => setAllowed(true)} />
        <div className="flex flex-col gap-1">
                <FormButton disabled={!allowed} className="py-2 bg-red-700 aria-disabled:bg-red-700/50">Report</FormButton>
                <Link href={""} onClick={() => router.back()} className="text-md bg-background-900/50 w-full h-10 flex justify-center items-center rounded-md">Cancel</Link>
                <p data-allowed={allowed} className={`duration-300 data-[allowed="true"]:opacity-0 opacity-100 animate-once text-sm text-primary-600 flex justify-center items-center`}><Loader2Icon className="animate-spin" /> Waiting for captcha service</p>
        </div>
    </form>)
}