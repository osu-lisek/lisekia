'use client'

import { useFormStatus } from "react-dom";
import { ClassNameValue, twMerge } from "tailwind-merge";


export function FormButton({ children, className, disabled }: { children?: React.ReactNode, className?: ClassNameValue, disabled?: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" aria-disabled={pending || disabled} className={twMerge(`select-none bg-primary-700 rounded-md py-1 aria-disabled:bg-primary-800/90 aria-disabled:brightness-75 aria-disabled:cursor-not-allowed duration-200`, className)}>
      {children}
    </button>
  )
}