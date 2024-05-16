import { BookUser, Brush, Shield, UserRoundCog } from "lucide-react";
import Link from "next/link";

export default async function Page() {
    return (
    <div className="flex sm:w-[25%] gap-2.5 h-full flex-col rounded bg-background-900/50 p-2 ">
        <Link className={`flex gap-1 p-1.5 hover:bg-white/20 hover:gap-2 duration-[200ms] bg-background-800 rounded-md`} href={"/settings/general"}>
            <UserRoundCog /> General
        </Link>
        <Link className={`flex gap-1 p-1.5 hover:bg-white/20 hover:gap-2 duration-[200ms] bg-background-800 rounded-md`} href={"/settings/security"}>
            <Shield /> Security
        </Link>
        <Link className={`flex gap-1 p-1.5 hover:bg-white/20 hover:gap-2 duration-[200ms] bg-background-800 rounded-md`} href={"/settings/userpage"}>
            <BookUser /> Userpage
        </Link>
        <Link className={`flex gap-1 p-1.5 hover:bg-white/20 hover:gap-2 duration-[200ms] bg-background-800 rounded-md`} href={"/settings/appearance"}>
            <Brush /> Appearance
        </Link>
    </div>
    )
}