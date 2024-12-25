import LoginForm, { LoginServerState } from "@/components/forms/login-form";
import { FormButton } from "@/components/ui/FormButton";
import InputFieldWithIcon from "@/components/ui/InputFieldWithIcon";
import { useServerSession } from "@/hooks/useSession";
import { LockIcon, MailIcon } from "lucide-react";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";


export default async function Page() {
    const { user } = await useServerSession();

    if (user) return redirect("/");
    async function authorize(state: LoginServerState, payload: FormData): Promise<LoginServerState> {
        "use server";

        let response = await fetch(`https://osu.lisek.cc/oauth/token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                client_id: process.env.LISEK_OAUTH2_CLIENT_ID,
                client_secret: process.env.LISEK_OAUTH2_CLIENT_SECRET,
                grant_type: "password",
                scope: "*",
                username: payload.get("username") as string,
                password: payload.get("password") as string
            }),
            cache: "no-cache"
        }).then(res => res.json());

        if (response.error && !["username", "password"].includes(response.hint)) return {
            ok: false,
            hints: {
                username: response.message,
                password: response.message,
            },
            message: response.message
        }

        if (response.error) return {
            ok: false,
            hints: {
                username: response.hint == "username" ? response.message : "",
                password: response.hint == "password" ? response.message : ""
            },
            message: response.message
        };

       const { access_token, token_type, expires_in, refresh_token } = response;

       let cookie = cookies();
       let options = {
        expires: new Date(Date.now() + (1000 * 60 * 60 * 24 * 21)),
       } as ResponseCookie;
       cookie.set("auth.access_token", access_token, options);
       cookie.set("auth.token_type", token_type, options);
       cookie.set("auth.refresh_token", refresh_token, options);
       cookie.set("auth.expires_in", (Date.now()/1000) + expires_in, options);

       let origin = cookie.get("auth.origin")?.value??"/";
       return redirect(origin);
    }


    return (<div className="w-full min-h-screen flex justify-center items-center -mt-[10%] animate-fade-up animate-once animate-duration-[300ms] animate-ease-linear">
        <div className="bg-background-900/20 w-full sm:w-[30%] min-h-10 flex flex-col gap-5 justify-center items-center rounded-xl">
            <div className="text-3xl bg-background-950/50 w-full min-h-10 py-10 flex justify-center">
                Login
            </div>
            <LoginForm action={authorize} />
        </div>
    </div>)
}