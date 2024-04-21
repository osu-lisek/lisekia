import { pool } from "@/app/layout"
import { OsuMode } from "./scoring"
import { convertToDbSuffix } from "./modes"

interface User {
    id: number,
    username: string,
    country: string,
    permissions: number
    flags: number
    lastSeen: Date,
    createdAt: Date,
    donorUntil: Date,
    userpageContent: string
    coins: number
}

export async function fetchOne<T>(query: string, params?: Array<any>): Promise<T | null> {
    let response = pool.query(query, params).then(r => r.rows[0]);
    if (!response) return null;
    return response as T;
}

export async function findUser(query: string): Promise<User | undefined> {
    let response = await fetchOne<User>(`SELECT * FROM "User" WHERE "username" = $1 OR "id" = $2`, [query, parseInt(query)]);

    if (!response) return;
    return response;
}

export default async function fetchUserStats(id: number, mode: OsuMode) {
    let suffix = convertToDbSuffix(mode);
    let result = await fetchOne(`
    SELECT 
    "UserStats"."userId" as id,
    "UserStats"."pp${suffix}" as performance, 
    "UserStats"."rankedScore${suffix}" as ranked_score, 
    "UserStats"."totalScore${suffix}" as total_score, 
    "UserStats"."avgAcc${suffix}" as accuracy, 
    "UserStats"."playCount${suffix}" as playcount,
    "UserStats"."maxCombo${suffix}" as max_combo
FROM
    "UserStats"
WHERE
    "UserStats"."userId" = $1`, [id]);

    return result;
}