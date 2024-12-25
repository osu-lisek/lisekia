import Logo from "@/assets/logo.svg";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Cog, DoorOpen, LogOutIcon, PawPrintIcon, Trophy, Users, Users2 } from "lucide-react";
import { Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import Dropdown from "./ui/Dropdown";
import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { destroySession, useServerSession } from "@/hooks/useSession";
import { FormButton } from "./ui/FormButton";
import { fetchOne } from "@/utils/api";

const font = Inter({ subsets: ["latin"] });

export default async function Navigation() {

    const authorize = async () => {
        "use server"

        cookies().set("auth.origin", headers().get("referer") as string, { path: "/", maxAge: 1000 * 60 * 2 });
        return redirect("/login");
    }

    const logout = async () => {
        "use server";
        destroySession();

        return redirect(headers().get("referer") as string)
    }

    const { user } = await useServerSession();

    return (<div className={`z-50 group-[navbar] w-full bg-primary-800 sm:py-0 sm:bg-mine-shaft-950 fixed sm:sticky sm:mb-6 bottom-0 sm:flex sm:top-0 sm:h-[60px] flex px-[10%] sm:px-[15%] items-center justify-between select-none ${font.className} flex-nowrap`}>
        <div className={`flex flex-row gap-6 items-center h-full`}>
            <div className="duration-[500ms] hover:scale-[1.2] cursor-pointer ease-in-out">
                <Link href="/">
                    <Image src={Logo} alt="logo" width={56} height={56} />
                </Link>
            </div>

            <div className="h-full hidden sm:flex">
                <div className="h-full">
                    <div className="h-full flex items-center">
                        <Link href={"/rankings/standard/1"} className={`px-4 text-xl duration-[200ms] gap-2 hover:bg-white/20 h-full flex items-center`}>
                            <Trophy /> <span className="hidden sm:block">Rankings</span>
                        </Link>
                    </div>
                </div>

                <Dropdown title="Community" icon={<Users />}>
                    <Link href={"/socials/discord"} className=" w-full bg-[#5865F2] bg-opacity-45 shadow-sm rounded-md flex flex-row justify-between items-stretch h-auto">

                        <div className={`py-[6px] px-2 text-[#9DA7FF]`}>
                            Discord
                        </div>
                        <div className="min-w-[32px] bg-[#5865F2] bg-opacity-75 flex items-center px-2 rounded-r-md">
                            <FontAwesomeIcon icon={faDiscord} size="xl" className={`size-6`} />
                        </div>
                    </Link>

                    <Link href={"/docs/rules"} className=" w-full bg-[#254450] shadow-sm rounded-md flex flex-row justify-between items-stretch h-auto">

                        <div className={`py-[6px] px-2 text-[#AEE8FF]`}>
                            Rules
                        </div>
                        <div className="min-w-[32px] bg-white bg-opacity-5 flex items-center px-2 rounded-r-md">
                            <FontAwesomeIcon icon={faBook} size="xl" className={`size-6`} />
                        </div>
                    </Link>
                </Dropdown>
            </div>
        </div>

        <div>
            {!user &&
                <form action={authorize}>
                    <button type="submit" className="bg-mine-shaft-800 text-white px-8 py-2 rounded-md">
                        <span className="hidden sm:block">Login</span>
                        <DoorOpen className="sm:hidden" />
                    </button>
                </form>
            }
            {user && <div className="flex flex-row gap-2">
                <div className="group flex justify-stretch">
                    <div className="group-hover:bg-white/20 px-4 duration-[400ms] sm:flex hidden group-hover/navbar:flex flex-row gap-1 items-center cursor-pointer">
                        <PawPrintIcon /> { await fetchOne<{ coins: number }>("SELECT coins FROM \"User\" WHERE id = $1", [user.id]).then(r => r?.coins)}
                    </div>
                </div>
                <div className="group sm:relative">
                    <div className="group-hover:bg-white/20 px-4 duration-[400ms]">
                        <Image src={`https://a.lisek.cc/${user.id}`} alt="avatar" width={56} height={56} className={`rounded-full border-mine-shaft-800 border-[4px] drop-shadow-2xl cursor-pointer`} />
                    </div>
                    <div className="z-[9] sm:z-10 left-0 w-full absolute bg-mine-shaft-950 sm:min-w-[275%] sm:-translate-x-[63%] opacity-0 min-h-[100px] pointer-events-none duration-[400ms] -translate-y-[125%] sm:-translate-y-8 ease-in-out group-hover:opacity-100 sm:group-hover:translate-y-0 group-hover:pointer-events-auto flex flex-col gap-2 items-center py-2 px-2 rounded-b-md">
                        <Link href={`/users/${user.id}/standard`} className="flex flex-row justify-center sm:justify-between bg-mine-shaft-900 w-full items-stretch rounded-md">
                            <div className="flex flex-col py-2 px-1">
                                <div className="text-md text-mine-shaft-200">
                                    {user.username}
                                </div>
                                <div className="text-sm text-mine-shaft-500">
                                    {user.stats?.performance || 0}pp
                                </div>
                            </div>
                            <div className="bg-mine-shaft-700 items-center rounded-r-md px-1 hidden sm:flex  w-1/4">
                                <Image src={`https://a.lisek.cc/${user.id}`} alt="avatar" width={48} height={48} className={`rounded-full border-mine-shaft-800 border-[2px] drop-shadow-2xl cursor-pointer`} />
                            </div>
                        </Link>


                        <Link href={`/friends/all`} className="flex flex-row justify-between bg-mine-shaft-900 w-full items-stretch rounded-md">
                            <div className="flex flex-col py-3 sm:py-2 px-2 text-md text-mine-shaft-200 items-center">
                                Friends
                            </div>
                            <div className="bg-mine-shaft-700 flex items-center rounded-r-md px-1 w-1/4 justify-center">
                                <Users2 size={32} />
                            </div>
                        </Link>
                        <Link href={`/settings/general`} className="flex flex-row justify-between bg-mine-shaft-900 w-full items-stretch rounded-md">
                            <div className="flex flex-col py-3 sm:py-2 px-2 text-md text-mine-shaft-200 items-center">
                                Settings
                            </div>
                            <div className="bg-mine-shaft-700 flex items-center rounded-r-md px-1 w-1/4 justify-center">
                                <Cog size={32} />
                            </div>
                        </Link>
                        <form action={logout} className="w-full">
                            <button type="submit" className="flex flex-row justify-between bg-red-600/20 w-full items-stretch rounded-md">
                                <div className="flex flex-col py-3 sm:py-2 px-2 text-md text-red-400 items-center">
                                    Log Out
                                </div>
                                <div className="bg-red-700/40 text-red-400 flex items-center rounded-r-md px-1 w-1/4 justify-center">
                                    <LogOutIcon />
                                </div>
                            </button>

                        </form>

                    </div>

                </div> </div>}
        </div>
    </div>);
}
