import { AlertType } from "@/components/ui/WebsiteAlert";
import { addAlert } from "@/utils/alerts";
import { cookies } from "next/headers"

export type ISession = {
    user?: UserResponse["data"] | undefined,
    headers?: {
        Authorization: string
    }
}

export interface UserResponse {
    ok: boolean
    message?: string,
    data?: {
        username: string
        id: number
        flags: number
        permissions: number
        stats: {
            ranked_score: number
            total_score: number
            accuracy: number
            playcount: number
            performance: number
            max_combo: number
        }
        country: string
        rankings: {
            global: number
            country: number
        }
        username_history: Array<string>
        created_at: string
        last_seen: string
        badges: Array<{
            id: number
            name: string
            icon: string
            color: string
        }>
        is_donor: boolean
        background_url: string
        leveling: {
            level: number
            progress: number
        }
        grades: {
            xh: number
            x: number
            sh: number
            s: number
            a: number
        }
        userpage_content: string
        followers: number
        coins: number
        is_friend: boolean
        is_mutual: boolean
    }
}

const sessionCache = new Map<String, UserResponse["data"]>();

export const clearSessionCache = (token: String) => sessionCache.delete(token);

export const useServerSession = async (): Promise<ISession> => {
    let currentCookies = cookies();

    let accessToken = currentCookies.get("auth.access_token")?.value;
    let tokenType = currentCookies.get("auth.token_type")?.value;

    if (!accessToken && !tokenType) return {};

    if (!accessToken || !tokenType) {
        addAlert({ type: AlertType.Warning, message: "Looks like you have invalid session, please, we have logged you out to prevent site errors, please, log in again." })
        destroySession();
        return {};
    }

    if (sessionCache.get(`${tokenType} ${accessToken}`)) {
        return { user: sessionCache.get(`${tokenType} ${accessToken}`), headers: {
            "Authorization": `${tokenType} ${accessToken}`
        } };
    }

    let user = await fetchUserWithToken(tokenType, accessToken);

    if (!user) {
        return {};
    }

    sessionCache.set(`${tokenType} ${accessToken}`, user);
    return {
        user, headers: {
            "Authorization": `${tokenType} ${accessToken}`
        }
    };
}

export const destroySession = () => {
    let currentCookies = cookies();
    sessionCache.delete(currentCookies.get("auth.access_token")?.value??"");
    currentCookies.delete("auth.access_token");
    currentCookies.delete("auth.token_type");
}

const getCurrentUser = async (token_type: string, token: string) => {
    let response = await fetch(`https://${process.env.NODE_ENV == "development" ? "dev." : ""}lisek.world/api/v1/oauth2/user`, {
        headers: {
            "Authorization": `${token_type} ${token}`
        }
    });

    if (!response.ok) return;

    return response.json();
}

const fetchUser = async (id: number): Promise<UserResponse["data"] | undefined> => {
    let response = await fetch(`https://${process.env.NODE_ENV == "development" ? "dev." : ""}lisek.world/api/v2/users/${id}`).then(res => res.json()) as UserResponse;

    if (!response.ok) return;

    return response.data;
}

const fetchUserWithToken = async (token_type: string, token: string): Promise<UserResponse["data"] | undefined> => {
    let response = await fetch(`https://${process.env.NODE_ENV == "development" ? "dev." : ""}lisek.world/api/v2/users/@me`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${token_type} ${token}`
        }
    }).then(res => res.json()) as UserResponse;

    if (!response.ok) return;

    return response.data;
}