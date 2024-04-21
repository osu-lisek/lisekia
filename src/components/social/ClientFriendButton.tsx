'use client';

import { ReactNode } from "react";
import { useFormStatus } from "react-dom";


export default function ClientFriendButton({ children }: { children: ReactNode }) {
    const { pending } = useFormStatus();

    return (
        <div data-pending={pending} className={`data-[pending="true"]:brightness-50 duration-200 data-[pending="true"]:cursor-not-allowed`}>
            {children}
        </div>
    )

}