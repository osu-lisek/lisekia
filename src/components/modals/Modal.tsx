"use client";

import { useRouter } from "next/navigation";
import React from "react"
import { twMerge } from "tailwind-merge";

interface Style {
    modal?: string,
    container?: string
}

interface ModalProps {
    children: React.ReactNode,
    style?: Style
}
export default function Modal({ children, style }: ModalProps) {
    const router = useRouter();

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {

        //@ts-ignore
        if (e.target.getAttribute("data-modal")) router.back();
    }

    return (<div className={twMerge(`fixed w-full h-full inset-0 flex items-center justify-center bg-black/50 animate-fade animate-once animate-duration-300 z-50`, style?.modal)} onClick={handleClick}  data-modal={true}>
        <div className={twMerge(`bg-background-950 rounded-md min-h-4 w-[90%] lg:w-[20%] sm:w-[60%] py-2 px-4 z-10 animate-fade-down animate-once animate-duration-300 modal`, style?.container)}>
            {children}
        </div>
    </div>)
}