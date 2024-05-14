import { APIScore } from "@/utils/scoring"
import { ScoreRank } from "./ScoreRank"
import moment from "moment"
import Link from "next/link"
import { convertModsToStringList, modFullNames } from "@/utils/mods"
import Image from "next/image"
import { Inter } from "next/font/google"
import { DownloadIcon, Eye, MoreVertical } from "lucide-react"

const font = Inter({ subsets: ["latin"] });

interface ScoreProps {
    score: APIScore
}

export function Score({ score }: ScoreProps) {

    const mods = convertModsToStringList(score.mods);

    let modIconNames = mods.map((mod) => `mod_${modFullNames[mod] ?? "auto"}@2x.png`);

    return (<div className=" relative w-full bg-background-950/60 p-2 rounded-xl shadow-md flex flex-wrap sm:flex-nowrap sm:justify-between">
        <div className={`absolute w-[320px] h-full top-0 left-0 rounded-l-xl z-[-1] overflow-hidden`} style={{ background: `url('${`https://assets.ppy.sh/beatmaps/${score.beatmap.parent_id}/covers/cover@2x.jpg`}')`}}>   
            <div className="w-full h-full bg-gradient-to-r from-transparent to-background-950">

            </div>
        </div>
        <div className="flex w-full items-center">
            <ScoreRank rank={score.grade} size={86} />
            <div>
                <Link className="text-background-200 text-sm sm:text-lg" href={`https://lisek.world/b/${score.beatmap.id}`} about="_blank">
                    {score.beatmap.artist} - {score.beatmap.title}
                </Link>
                <div className="text-background-200 text-xs sm:text-base flex sm:flex-row gap-2">
                    <span>{score.beatmap.version}</span> <span className="text-background-300">{moment.duration(-moment().diff(new Date(score.submitted_at).getTime() - new Date().getTimezoneOffset() * 60 * 1000)).humanize(true)}</span>
                </div>
            </div>
        </div>
        <div className={`flex items-center justify-between flex-row gap-1 w-full sm:w-auto ${font.className} group`}>
            <div className="flex flex-wrap sm:flex-nowrap sm:flex-row gap-1 w-auto">
                {modIconNames.map((iconName, index) => <div key={index}>
                    <Image className="min-h-[24px] min-w-[48px]" loading="lazy" src={`/images/mods/${iconName}`} alt={iconName} width={48} height={48} />
                </div>)}
            </div>
            <div className="flex flex-col text-background-300 px-2">
                <div className="text-lg text-primary-500 leading-6">
                    {score.accuracy.toFixed(2)}%
                </div>
                <div className="text-[16px] text-end leading-3">
                    {score.max_combo}x
                </div>
            </div>
            <div className="flex flex-col text-lg items-center px-2">
                <div className="text-primary-500/90 leading-6 place-self-end">
                    {score.performance.toFixed(0)}<span className="text-white">pp</span>
                </div>
                <div className="text-nowrap text-sm text-background-200">
                    weighted {score.weighted.toFixed(0) ?? 0}%
                </div>
            </div>
            <div className="flex flex-col items-center group relative h-full justify-center z-10">
                <MoreVertical />
                <div className="px-8 group h-full absolute w-48">
                    <div className="absolute bg-background-950/90 border-2 border-background-800 py-2 px-2 rounded-xl flex flex-col gap-2 -translate-x-[60%] sm:translate-x-[100%] pointer-events-none duration-300 ease-in-out opacity-0 group-hover:opacity-100 sm:group-hover:translate-x-[60%] group-hover:pointer-events-auto w-full translate-y-[75%] sm:translate-y-0 sm:w-36 z-10">
                        {score.passed && <Link className="flex gap-1 text-xs items-center cursor-pointer" href={`/api/replays/${score.id}`}>
                            <DownloadIcon /> Download replay
                        </Link>}
                            <Link className="flex gap-1 text-xs items-center  cursor-pointer" href={`/scores/${score.id}`}>
                            <Eye /> View score
                        </Link>
                    </div>
                </div>

            </div>
        </div>
        <div>

        </div>
    </div>)
}