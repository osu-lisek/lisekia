import { AlertCircleIcon, AlertOctagonIcon, AlertTriangleIcon, CheckCircle, CheckCircle2, ShieldQuestionIcon } from "lucide-react";

interface IAlertProps {
    data: Alert,
}
export enum AlertType {
    Critical = "critical",
    Error = "error",
    Warning = "warning",
    ok = "ok"
}

export type Alert = {
    type: AlertType,
    message: string,
}

const alertTypes = {
    critical: "bg-red-500",
    warning: "bg-yellow-500",
    error: "bg-red-500",
    ok: "bg-green-500",
} as { [key in AlertType]: string }

const alertIcons = {
    critical: <AlertCircleIcon size={32} />,
    warning: <AlertTriangleIcon size={32} />,
    error: <AlertOctagonIcon size={32} />,
    ok: <CheckCircle size={32} />
} as { [key in AlertType]: JSX.Element }

export default function WebsiteAlert({ data: { message, type } }: IAlertProps) {
    return (<div className={`${alertTypes[type]??"bg-blue-500"} py-4 px-2 w-full bg-opacity-50 sm:rounded-2xl flex flex-row gap-2`}>
    <div className="flex flex-row items-center justify-center">
        {alertIcons[type]??<ShieldQuestionIcon size={32} />}
    </div>
    <div className="w-[2px] bg-white">

    </div>
    <div className="text-lg">
        {message}
    </div>
    </div>)
}