import { OsuMode } from "@/utils/scoring"
import { redirect } from "next/navigation"
import StandardIcon from "@/assets/images/modes/standard.svg";
import TaikoIcon from "@/assets/images/modes/taiko.svg";
import FruitsIcon from "@/assets/images/modes/catch.svg";
import ManiaIcon from "@/assets/images/modes/mania.svg";
import RelaxIcon from "@/assets/images/modes/relax.png";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { convertModeToInt } from "@/utils/modes";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface IProps {
    params: {
        mode: OsuMode,
        page: string // js thing
    }
}

let validateMode = (mode: string) => {
    if (!["standard", "taiko", "fruits", "mania", "relax"].includes(mode)) return false;

    return true;
}

let capilizeString = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

type LeaderboardResponse = {
    ok: boolean,
    message?: string,
    data: {
        entries: Array<{
            place: number
            user: {
                id: number
                username: string
                country: string
                performance: number
                accuracy: number
                playcount: number
                ranked_score: number
                level: number
                is_donor: boolean
            }
        }>
        total_users: number
    }
}



const FilterItem = ({ icon, name, params }: { icon: any, name: string, params: IProps["params"] }) => {
    return <Link href={`/rankings/${name}/1`} data-active={params.mode == name} className={`flex flex-col gap-1 w-fit data-[active="false"]:brightness-50 duration-300 transition-all`}>
        <div className="flex flex-row items-center gap-1">
            <Image src={icon ?? StandardIcon} alt={name} width={24} height={24} />
            <span>{capilizeString(name)}</span>
        </div>
        <div data-active={params.mode == name} className={`data-[active="true"]:w-[90%] w-[80%] h-2 bg-white my-0 mx-auto rounded-t-md duration-700 ease-in-out transition`}>
        </div>
    </Link>
}

const calculatePagesFromUsers = (users: number) => {

    return Math.ceil(users / 50);
}

export default async function Page({ params }: IProps) {

    if (isNaN(parseInt(params.page))) return redirect(`/rankings/${params.mode}/1`);
    if (!validateMode(params.mode)) return redirect(`/rankings/standard/1`);
    const limit = 50;
    const offset = (parseInt(params.page) - 1) * limit;

    if (offset < 0) return redirect(`/rankings/${params.mode}/1`);

    const { ok, message, data } = await fetch(`https://lisek.world/api/v2/rankings/leaderboard?offset=${offset}&limit=${limit}&mode=${convertModeToInt(params.mode ?? "standard")}`, { cache: "no-cache" }).then(res => res.json()) as LeaderboardResponse;

    //TODO: Make error card
    if (!ok) return <div>Error: {message}</div>

    return (<div className="sm:w-[80%] min-h-24 bg-background-900/25">
        <div className="bg-background-950/50 min-h-32 flex flex-col justify-between">
            <div className="flex flex-row justify-center items-center py-24 text-3xl">
                Leaderboard
            </div>
            <div className="px-2 flex flex-row gap-4 flex-wrap">
                <FilterItem icon={StandardIcon} name="standard" params={params} />
                <FilterItem icon={TaikoIcon} name="taiko" params={params} />
                <FilterItem icon={FruitsIcon} name="fruits" params={params} />
                <FilterItem icon={ManiaIcon} name="mania" params={params} />
                <FilterItem icon={RelaxIcon} name="relax" params={params} />
            </div>
        </div>

        <div className="bg-background-950/5 w-full min-h-24 flex flex-col justify-center py-8 px-20 overflow-auto">
            <table className="table-fixed border-separate border-spacing-y-2 select-none">
                <thead>
                    <tr className="text-sm text-left *:font-normal *:text-background-300">
                        <th className="px-2.5">
                            #
                        </th>
                        <th className="text-left w-[75%]">
                            Username
                        </th>
                        <th>Performance</th>
                        <th className="text-center">Accuracy</th>
                        <th className="text-center">Playcount</th>
                    </tr>
                </thead>
                <tbody>
                    {data.entries.map((entry, index) => {
                        return <tr key={entry.user.id} className="py-2 text-lg text-background-200 bg-background-900/50 text-center *:leading-[3px] *:py-2.5 duration-300 hover:-translate-y-[5%]">
                            <td data-place={index + 1 + offset} className={`
                            data-[place="1"]:bg-yellow-400 
                            data-[place="1"]:text-black 
                            data-[place="2"]:bg-gray-500 
                            data-[place="2"]:text-black 
                            data-[place="3"]:bg-orange-800 
                            data-[place="3"]:text-white    
                            bg-background-400/10     
                            text-white                 
                            rounded-l-md`}>{index + 1 + offset}</td>
                            <td className="text-left flex flex-row items-center gap-2 h-full px-2 text-white w-full">
                                <Image src={`/images/flags/${entry.user.country == "XX" ? "__" : entry.user.country}.png`} alt="User country flag" width={32} height={20} className="w-auto h-[20px]" /> 
                                <Link className="w-full" href={`/users/${entry.user.id}/${params.mode}`}>{entry.user.username}</Link>
                            </td>
                            <td className="text-left">{entry.user?.performance?.toFixed(0)??"0.00"}pp</td>
                            <td>{entry.user?.accuracy?.toFixed(2)??"0.00"}%</td>
                            <td className="rounded-r-md">{entry.user.playcount}</td>
                        </tr>
                    })}
                </tbody>
            </table>
            <div className="w-full flex flex-row justify-center items-center mt-4 text-xl">
                <div className="flex items-center text-2xl gap-4 select-none">
                    <ChevronLeft data-active={parseInt(params.page) > 1} className={`data-[active="false"]:brightness-50 data-[active="false"]:pointer-events-none`} />
                    {params.page}
                    <ChevronRight data-active={calculatePagesFromUsers(data.total_users) > parseInt(params.page)} className={`data-[active="false"]:brightness-50 data-[active="false"]:pointer-events-none`} />
                </div>
            </div>
        </div>
    </div>)
}