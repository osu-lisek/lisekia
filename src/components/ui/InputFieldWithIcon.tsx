import { Inter } from "next/font/google";
import { twMerge } from "tailwind-merge";


const font = Inter({ subsets: ["latin"] });

type FieldProps = {
  icon: React.ReactNode,
  className?: string,
  name: string,
  title?: string,
  type: string,
  placeholder: string,
  required: boolean,
  state?: string,
  defaultValue?: string
}

export default function InputFieldWithIcon({ icon, title, state, className, defaultValue, ...props }: FieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className={`text-sm font-light flex justify-start ${font.className}`}>{title}</div>
      <div className="flex items-center gap-2 bg-background-900/50 rounded-md w-full ">
        <div className="flex justify-center items-center pl-2">
          {icon}
        </div>
        {/* @ts-ignore */}
        <input
          defaultValue={defaultValue}
        autoComplete="false"
          className={twMerge("w-full appearance-none py-2 px-2 placeholder:text-background-200 outline:none focus:outline-none bg-background-950/40 rounded-r-md", className)}
          {...props}
        />
      </div>
      {state && <div className="-mt-1 text-sm font-semibold text-yellow-400">
        {state}
      </div>}
    </div>
  );
}