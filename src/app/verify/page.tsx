import { clearSessionCache, useServerSession } from "@/hooks/useSession"
import { redirect } from "next/navigation";
import { pool } from "../layout";
import { fetchOne } from "@/utils/api";
import { PlayCircle } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faGamepad, faKey, faPassport } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";


export default async function Page() {

    let { user, headers } = await useServerSession();


    if (!user) return redirect("/");
    
    let { flags, permissions } = await fetchOne(`SELECT "flags", "permissions" FROM "User" WHERE "id" = $1`, [user.id]) as { flags: number, permissions: number };
    
    
    if (!(flags & 32)) {
        clearSessionCache(headers?.Authorization!);
        return redirect("/");
    }
    
    return (<div className="sm:w-[65%] bg-background-800/20 min-h-24 rounded-xl p-4 flex flex-col gap-2">
        <div className="flex flex-col gap-0.5">
            <span className="text-2xl">Hey <strong>{user.username}</strong>!</span>
            <span className="text-lg">We now need to verify you by loggining in osu! client.</span>
        </div>

        <div className="flex flex-row flex-wrap gap-4">
            <div className="bg-background-800/60 min-h-56 flex-1 rounded-md flex flex-col justify-center items-center">
                <div>
                    <FontAwesomeIcon icon={faGamepad} width={96} height={96} />
                </div>
                <div className="p-2 text-wrap text-center">
                    Create game shortcut and put <br/><code className="text-primary-600">-devserver osu.lisek.cc</code> at the end.
                </div>
            </div>
            <div className="bg-background-800/60 min-h-56 flex-1 rounded-md flex flex-col justify-center items-center">
            <div>
                    <FontAwesomeIcon icon={faKey} width={96} height={96} />
                </div>
                <div className="p-2 text-wrap text-center">
                    Enter your login data in game and press "Login"
                </div>
            </div>
            <div className="bg-background-800/60 min-h-56 flex-1 flex flex-col justify-center items-center">
            <div>
                    <FontAwesomeIcon icon={faCheck} width={96} height={96} />
                </div>
                <div className="p-2 text-wrap text-center">
                    You're done, reload page and you will be allowed to use site.
                </div>
            </div>
        </div>
        <div className="text-xl text-center flex flex-col justify-center items-center">
            You have some questions? Ask us in <Link href={"/social/discord"} className="text-primary-500">Discord</Link>
            <span className="text-background-600 text-sm">This page is temporary here, it gonna be reworked soon.</span>
        </div>
        
    </div>)
}