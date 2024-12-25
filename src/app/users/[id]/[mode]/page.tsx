import { convertModeToInt } from "@/utils/modes"
import { Metadata } from "next"
import Image from "next/image"
import dynamic from "next/dynamic";
import BBCode from 'nbbcjs';
import xss from 'xss';


import { redirect } from "next/navigation";
import { ServerScoreContent } from "@/components/scoring/ServerScoreContent";
import { OsuMode } from "@/utils/scoring";
import { AlertOctagon, BookUserIcon, Timer, Trophy, Users2Icon } from "lucide-react";
import { ScoreRank } from "@/components/scoring/ScoreRank";
import { duration } from "moment";
import { UserResponse, useServerSession } from "@/hooks/useSession";
import Link from "next/link";
import StandardIcon from "@/assets/images/modes/standard.svg";
import TaikoIcon from "@/assets/images/modes/taiko.svg";
import FruitsIcon from "@/assets/images/modes/catch.svg";
import ManiaIcon from "@/assets/images/modes/mania.svg";
import RelaxIcon from "@/assets/images/modes/relax.png";
import { Suspense } from "react";
import ComponentLoader from "@/components/ui/ComponentLoader";
import { BBAction, BBMode } from "nbbcjs/build/@types/enums";
import { BBCodeParser } from "@/utils/bbcode";
import ProfileFriendButton from "@/components/social/profile/ProfileFriendButton";

const PerformanceChart = dynamic(() => import("@/components/charts/PerformanceChart"), {
    ssr: false,
    loading: () => <ComponentLoader />
})
type Props = {
    params: { id: string, mode: OsuMode }
}

const LAST_SEEN_PRIVACY_TIMEOUT = 1000 * 60 * 60 * 24 * 14;


export type GraphData =
    {
        id: number
        date: string
        rank: number
    }

export type GraphResponse = {
    ok: boolean
    data: Array<GraphData>
}

export interface StatusRoot {
    ok: boolean
    data: StatusData
  }
  
  export interface StatusData {
    username: string
    status: Status
  }
  
  export interface Status {
    status: string
    beatmap: Beatmap
  }
  
  export interface Beatmap {
    id: number
    parent_id: number
    artist: string
    title: string
    creator: string
    version: string
    bpm: number
    ar: number
    od: number
    cs: number
    hp: number
    status: number
    max_combo: number
    total_length: number
  }

  



export async function generateMetadata({ params }: Props): Promise<Metadata> {
    let { ok, data } = await fetch(`https://osu.lisek.cc/api/v2/users/${params.id}?mode=${convertModeToInt(params.mode)}`).then(res => res.json()) as UserResponse;

    if (!ok) return {};
    //If check above is passed, then we do not need to validate data
    data = data!;

    let countryName = data.country == "XX" ? "Unknown" : new Intl.DisplayNames(["en"], { type: "region" }).of(data.country);
    return {
        metadataBase: new URL(`https://osu.lisek.cc`),
        title: `${data.username} | osu!lisek`,
        openGraph: {
            images: {
                url: `https://a.lisek.cc/${data.id}`,
                width: 32,
                height: 32
            },
            url: `https://osu.lisek.cc/users/${data.id}?mode=${convertModeToInt(params.mode)}`,
            description: `A lisek! player from ${countryName}, Rankings(osu!): ${data.rankings.global ? `#${data.rankings.global}` : "Unranked"} | ${data.rankings.country ? `#${data.rankings.country}` : "Unranked"} (${data.country}) `,
        },
        twitter: {
            images: {
                url: `https://a.lisek.cc/${data.id}`,
                width: 32,
                height: 32
            },
            description: `A lisek! player from ${countryName}, Rankings(osu!): ${data.rankings.global ? `#${data.rankings.global}` : "Unranked"} | ${data.rankings.country ? `#${data.rankings.country}` : "Unranked"} (${data.country}) `,
        }
    }
}

export default async function profile({ params }: Props) {

    const mode = params.mode ?? "standard";
    const { user, headers } = await useServerSession();

    let ok, data, message;
    if (user) {
        let response = await fetch(`https://osu.lisek.cc/api/v2/users/${params.id}?mode=${convertModeToInt(params.mode)}`, {
            headers: {
                ...headers
            }
        }).then(res => res.json()) as UserResponse;

        if (!response.ok) {
            let response = await fetch(`https://osu.lisek.cc/api/v2/users/${params.id}?mode=${convertModeToInt(params.mode)}`).then(res => res.json()) as UserResponse;


            ok = response.ok;
            data = response.data;
            message = response.message;
        } else {
            ok = response.ok;
            data = response.data;
            message = response.message;
        }
    } else {
        let response = await fetch(`https://osu.lisek.cc/api/v2/users/${params.id}?mode=${convertModeToInt(params.mode)}`).then(res => res.json()) as UserResponse;

        ok = response.ok;
        data = response.data;
        message = response.message;
    }


    if (!ok) return <div className="min-h-screen w-full sm:w-[80%] my-4 animate-fade-up animate-duration-300 animate-ease-in">
        <div className="w-full h-full bg-background-800/25 rounded-md">
            <div className="text-3xl w-full h-auto bg-background-700/10 p-2" title={message}>
                Profile not found.
            </div>
            <div className="px-4 py-2">
                Seems like you are not allowed to view this profile, here some reasons why it may be caused.
                <ul className="px-6 m-auto list-disc">
                    <li>This user does not exists.</li>
                    <li>User's profile has been disabled for security or abuse reason.</li>
                    <li>Something caused error while fetching user.</li>
                </ul>
            </div>
        </div>
    </div>

    data = data!;
    
    if (params.id != data.id.toString()) return redirect(`/users/${data.id}`);

    const graph = await fetch(`https://osu.lisek.cc/api/v2/users/${data.id}/graph?mode=${convertModeToInt(mode)}`, { headers: user ? headers : {} }).then(res => res.json()) as GraphResponse;

    let bbcodeParser = new BBCodeParser();

    if (data.permissions & 8 && !(data.flags & 32)) data.badges.push({ id: 0, color: "#7c0a02", name: "Restricted", icon: "" });
    if (data.permissions & 8 && data.flags & 32) data.badges.push({ id: 0, color: "#edea3e", name: "Pending verification", icon: "" });

    let banchoStatus = await fetch(`https://osu.lisek.cc/api/v2/bancho/user/${data?.id}`).then(res => res.json()) as StatusRoot;

    return (<div className="min-h-screen w-full sm:w-[80%] my-4 animate-fade-up animate-duration-300 animate-ease-out">
        <div className="min-h-[10rem] sm:h-[18rem] bg-primary-800 w-full sm:rounded-t-xl flex flex-col justify-center items-center">
            {/* {data.background_url && <Image src={`${data.background_url}`} placeholder="blur" blurDataURL={`/_next/image?url=${encodeURIComponent(data.background_url)}&w=32&q=1`} width={1200} height={600} className="h-full object-cover w-full sm:rounded-t-xl brightness-75" />} */}
        </div>
        <div className="bg-background-800/25 sm:px-4 flex flex-col sm:flex-row py-5 sm:gap-3 select-none shadow-md justify-center items-center sm:items-start sm:justify-start">
            <Image src={`https://a.osu.lisek.cc/${data.id}`} alt="Profile picture" width={162} height={162} placeholder="blur" blurDataURL={`/_next/image?url=https://a.osu.lisek.cc/${data.id}&w=32&q=1`} className="sm:-translate-y-20 sm:absolute rounded-xl border-background-950 border-4 bg-background-950" />
            <div className="flex flex-col sm:flex-row sm:justify-between w-full sm:ml-44 justify-center items-center sm:py-0 py-4">
                <div className="flex flex-col gap-1">
                    <div className="text-3xl flex flex-col sm:flex-row items-center gap-2 text-background-200 justify-center">
                        <span className="flex flex-row gap-1 items-center">{data.username} {!!data.username_history?.length && <div className="group relative">
                            <div className="group">
                                <BookUserIcon size={24} />
                            </div>
                            <div className="absolute bg-background-950 w-40 p-4 -translate-y-4 opacity-0 group-hover:opacity-100 text-sm duration-200 ease-in-out group-hover:-translate-y-8">
                                Also known as: <br /> {data.username_history.join(", ")}
                            </div>
                            
                            </div>}
                            </span>
                        <div className="flex flex-row text-lg text-background-950 items-center justify-center">
                            {data.badges.map((item, index) => <div key={index} className="text-sm px-2 rounded-full bg-background-950" style={{ color: item.color }}>{item.name}</div>)}
                        </div>
                    </div>
                    <div className="flex flex-row gap-1 items-center text-xl text-mine text-background-300">
                        <Image src={`/images/flags/${data.country == "XX" ? "__" : data.country}.png`} alt="User country flag" width={32} height={48} /> {data.country == "XX" ? "Unknown" : new Intl.DisplayNames(['en'], { type: 'region' }).of(data.country) ?? "Unknown"}
                    </div>
                </div>
                <div className="flex flex-row gap-1 items-center">
                    <Link href={`/users/${data.id}/standard`} className={`data-[active="false"]:opacity-50 transition ease-in duration-200 hover:!opacity-100`} data-active={mode == "standard"}>
                        <Image src={StandardIcon} width={48} height={48} alt="osu!std icon" />
                    </Link>
                    <Link scroll={false} passHref={true} href={`/users/${data.id}/taiko`} className={`data-[active="false"]:opacity-50 transition ease-in duration-200 hover:!opacity-100`} data-active={mode == "taiko"}>
                        <Image src={TaikoIcon} width={48} height={48} alt="osu!taiko icon" />
                    </Link>
                    <Link scroll={false} passHref={true} href={`/users/${data.id}/fruits`} className={`data-[active="false"]:opacity-50 transition ease-in duration-200 hover:!opacity-100`} data-active={mode == "fruits"}>
                        <Image src={FruitsIcon} width={48} height={48} alt="osu!fruits icon" />
                    </Link>
                    <Link scroll={false} passHref={true} href={`/users/${data.id}/mania`} className={`data-[active="false"]:opacity-50 transition ease-in duration-200 hover:!opacity-100`} data-active={mode == "mania"}>
                        <Image src={ManiaIcon} width={48} height={48} alt="osu!mania icon" />
                    </Link>
                    <Link scroll={false} passHref={true} href={`/users/${data.id}/relax`} className={`data-[active="false"]:opacity-50 transition ease-in duration-200 hover:!opacity-100`} data-active={mode == "relax"}>
                        <Image src={RelaxIcon} width={48} height={48} alt="osu!rx icon" />
                    </Link>
                </div>
            </div>
        </div>

        <div className="select-none bg-background-800/5 w-full min-h-10 h-auto flex flex-col sm:flex-row sm:px-4 py-4 gap-4">
            <div className="w-full sm:w-[70%] min-h-64 p-2 h-auto bg-background-800/25 items-stretch sm:rounded-xl flex flex-col shadow-md">
                <div className="h-[80%] w-full overflow-hidden flex flex-col sm:flex-row items-stretch">
                    <Suspense fallback={<ComponentLoader />}>
                        <PerformanceChart data={graph.data} />
                    </Suspense>
                </div>
                <div className="flex flex-row flex-wrap sm:flex-nowrap">
                    {data.rankings.global && <div className="w-fit py-1 px-2 rounded-xl">
                        <div className="text-xl text-background-300">
                            Global rank
                        </div>
                        <div className="text-lg text-background-100 ">
                            #{data.rankings.global}
                        </div>
                    </div>}

                    {data.rankings.country && <div className="w-fit py-1 px-2 rounded-xl">
                        <div className="text-xl text-background-300">
                            Country rank
                        </div>
                        <div className="text-lg text-background-100 ">
                            #{data.rankings.country}
                        </div>
                    </div>}

                    <div className="w-fit py-1 px-2 rounded-xl">
                        <div className="text-xl text-background-300">
                            Performance points
                        </div>
                        <div className="text-lg text-background-100 ">
                            {data.stats.performance}
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-background-800/25 min-h-10 flex-1 p-4 flex flex-col sm:rounded-xl shadow-md">
                <div className="w-full justify-between flex text-lg text-background-200">
                    <div>
                        Ranked score
                    </div>
                    <div>
                        {data.stats.ranked_score?.toLocaleString('en-US') ?? "-"}
                    </div>
                </div>
                <div className="w-full justify-between flex text-lg text-background-200">
                    <div>
                        Total score
                    </div>
                    <div>
                        {data.stats.total_score?.toLocaleString('en-US') ?? "-"}
                    </div>
                </div>
                <div className="w-full justify-between flex text-lg text-background-200">
                    <div>
                        Total hits
                    </div>
                    <div>
                        {/* {user.stats.hits?.toLocaleString('en-US') ?? "-"} */}
                        -
                    </div>
                </div>
                <div className="w-full justify-between flex text-lg text-background-200">
                    <div>
                        Playcount
                    </div>
                    <div>
                        {data.stats.playcount?.toLocaleString('en-US') ?? "-"}
                    </div>
                </div>
                <div className="w-full justify-between flex text-lg text-background-200">
                    <div>
                        Accuracy
                    </div>
                    <div>
                        {(data.stats.accuracy * 100)?.toLocaleString('en-US') ?? "-"}%
                    </div>
                </div>
                <div className="w-full justify-between flex text-lg text-background-200">
                    <div>
                        Max combo
                    </div>
                    <div>
                        {data.stats.max_combo?.toLocaleString('en-US') ?? "-"}
                    </div>
                </div>
                <div className="flex flex-row">
                    <div className="flex flex-col items-center">
                        <div className="h-10">
                            <ScoreRank rank="XH" size={80} />
                        </div>
                        <div>
                            {data.grades.xh}
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="h-10">
                            <ScoreRank rank="X" size={80} />
                        </div>
                        <div>
                            {data.grades.x}
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="h-10">
                            <ScoreRank rank="S" size={80} />
                        </div>
                        <div>
                            {data.grades.s}
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="h-10">
                            <ScoreRank rank="SH" size={80} />
                        </div>
                        <div>
                            {data.grades.sh}
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="h-10">
                            <ScoreRank rank="A" size={80} />
                        </div>
                        <div>
                            {data.grades.a}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="px-4 bg-background-800/5 flex flex-col">
            <div>
                {/* Actions bar, reporting, adding user to friend list */}
                <div className="bg-background-800/25 w-full min-h-5 rounded-t-md shadow-md p-2 flex flex-row gap-2 select-none">
                        <ProfileFriendButton disabled={user?.id == data.id} is_friend={data.is_friend} is_mutual={data.is_mutual} user={data.id} count={data.followers} />
                    {/* TODO: Report modal form */}
                    {user && user.id != data.id && <Link href={`/users/${data.id}/${mode}/report`} className="flex flex-row gap-2 px-8 py-2 bg-red-700/60 w-fit rounded-full shadow-sm">
                        <AlertOctagon/> Report
                    </Link>}
                </div>
            </div>
            <div className="bg-background-800/50 w-full min-h-2 py-1 px-2 text-base flex flex-row gap-2 select-none rounded-b-sm">
                {banchoStatus.ok && <strong>
                    User is currently online
                </strong>}
                {/* To prevent some weird stuff (I guess) */}
                {Date.now() - new Date(data.last_seen).getTime() < LAST_SEEN_PRIVACY_TIMEOUT && !banchoStatus.ok && <div>
                    Last seen <strong>{duration(new Date(data.last_seen).getTime() - Date.now(), "ms").humanize(true)}</strong>
                </div>}
                <div>
                    Joined <strong>{duration(new Date(data.created_at).getTime() - Date.now(), "ms").humanize(true)}</strong>
                </div>
            </div>
        </div>

        {data.userpage_content && <div className="select-none bg-background-800/5 w-full min-h-10 p-4">
            <div className="bg-background-800/25 w-full min-h-32 max-h-[450px] rounded-xl shadow-xl p-2 overflow-y-auto flex flex-col gap-2 no-scrollbar">
                <div className="border-b-2 border-b-white w-fit text-2xl px-2">
                    About me!
                </div>
                    <div className="select-text text-lg" dangerouslySetInnerHTML={{ __html: await bbcodeParser.parse(data.userpage_content) }}>
                </div>
            </div>
            
        </div>}

        <div className="select-none bg-background-800/5 w-full min-h-24 p-4">
            <div className="bg-background-800/25 w-full min-h-32 rounded-xl shadow-xl px-2 pt-2 pb-6  flex flex-col gap-2 no-scrollbar">
                <div className="w-fit text-2xl px-2 flex flex-row gap-2 items-center text-background-200">
                    <Trophy /> Best scores!
                </div>
                <div className="select-text text-lg">
                    <Suspense fallback={<ComponentLoader />}>
                        <ServerScoreContent type="best" user={data.id} mode={mode} />
                    </Suspense>
                </div>
            </div>
        </div>
        <div className="select-none bg-background-800/5 w-full min-h-24 p-4">
            <div className="bg-background-800/25 w-full min-h-32 rounded-xl shadow-xl px-2 py-6 flex flex-col gap-2 no-scrollbar">
                <div className="w-fit text-2xl px-2 flex flex-row gap-2 items-center text-background-200">
                    <Timer /> Recent scores!
                </div>
                <div className="select-text text-lg">
                    <Suspense fallback={<ComponentLoader />}>
                        <ServerScoreContent type="recent" user={data.id} mode={mode} />
                    </Suspense>
                </div>
            </div>
        </div>
    </div>)
}