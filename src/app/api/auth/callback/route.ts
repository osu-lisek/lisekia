import { AlertType } from "@/components/ui/WebsiteAlert";
import { addAlert } from "@/utils/alerts";
import { cookies, headers } from "next/headers";
import { NextRequest } from "next/server";


export async function GET(request: NextRequest) {
    let cookie = cookies();
    let origin = cookie.get("auth.origin")?.value || request.headers.get("host") + "/";

    let code = new URL(request.url).searchParams.get("code");

    let response = await fetch(`https://lisek.world/api/v1/oauth2/token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            code,
            grant_type: "authorization_code",
            redirect_uri: process.env.LISEK_OAUTH_REDIRECT_URI as string,
        })
    });

    //Removing origin from cookies
    cookie.delete("auth.origin");

    if (!response.ok) {
        addAlert({ type: AlertType.Warning, message: "Failed to authorize, try again."});

        return Response.redirect(origin);
    }

    let data = await response.json();

    cookie.set("auth.access_token", data.access_token, { path: "/", expires: new Date(Date.now() + (1000 * 60 * 60 * 24) * 31) });
    cookie.set("auth.token_type", data.token_type, { path: "/", expires: new Date(Date.now() + (1000 * 60 * 60 * 24) * 31) });
    
    return Response.redirect(origin);
}