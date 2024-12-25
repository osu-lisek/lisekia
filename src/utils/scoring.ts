import { APIScoreRank } from "@/components/scoring/ScoreRank"
import { convertModeToInt } from "./modes"
import { useServerSession } from "@/hooks/useSession"

export type APIScore = {
    id: number
    beatmap: {
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
    user_id: number
    accuracy: number
    count300: number
    count100: number
    count50: number
    count_geki: number
    count_katu: number
    count_miss: number
    total_score: number
    grade: APIScoreRank
    playmode: number
    max_combo: number
    mods: number
    weighted: number
    performance: number
    submitted_at: string
    passed: boolean
}

export type ScoreResponse = {
    ok: boolean,
    message?: string,
    data: Array<APIScore>
}

export type OsuMode = "standard" | "taiko" | "fruits" | "mania" | "relax";

export const fetchScores = async (user: string | number, type: "best" | "recent", limit: number = 5, offset: number = 0, mode: OsuMode = "standard", header?: object): Promise<ScoreResponse['data']> => {
    let response = await fetch(`https://osu.lisek.cc/api/v2/users/${user}/${type}?mode=${convertModeToInt(mode.toString())}&limit=${limit}&offset=${offset}`, { cache: "no-cache", headers: { ...header } }).then(res => res.json()) as ScoreResponse;

    if (!response.ok) {
        console.error(`Failed to fetch ${type} scores on user ${user}, message: ${response.message}`)
        return [];
    }

    return response.data;
}

export const fetchScoresSafe = async (user: string | number, type: "best" | "recent", limit: number = 5, offset: number = 0, mode: OsuMode = "standard", header?: object): Promise<ScoreResponse> => {
    let response = await fetch(`https://osu.lisek.cc/api/v2/users/${user}/${type}?mode=${convertModeToInt(mode.toString())}&limit=${limit}&offset=${offset}`, { cache: "no-cache", headers: { ...header } }).then(res => res.json()) as ScoreResponse;

    return response;
}