import ReportForm, { ReportFormServerState } from "@/components/forms/report-form";
import Modal from "@/components/modals/Modal";
import { UserResponse, useServerSession } from "@/hooks/useSession";
import { verifyCaptcha } from "@/utils/captcha";
import { convertModeToInt } from "@/utils/modes";
import { AlertTriangle } from "lucide-react";
import moment from "moment";
import { redirect } from "next/navigation";

interface IModalProps {
    params: {
        id: string,
        mode: string
    }
}

const ratelimits = new Map();
`text-primary-600`
export default async function Page({ params }: IModalProps) {
    const { user, headers } = await useServerSession();

    let ok: boolean, data: UserResponse["data"], message: string;
    if (user) {
        let response = await fetch(`https://lisek.world/api/v2/users/${params.id}?mode=${convertModeToInt(params.mode)}`, {
            headers: {
                ...headers
            }
        }).then(res => res.json()) as UserResponse;

        if (!response.ok) {
            let response = await fetch(`https://lisek.world/api/v2/users/${params.id}?mode=${convertModeToInt(params.mode)}`).then(res => res.json()) as UserResponse;


            ok = response.ok;
            data = response.data;
            message = response.message as string;
        } else {
            ok = response.ok;
            data = response.data;
            message = response.message as string;
        }
    } else {
        let response = await fetch(`https://lisek.world/api/v2/users/${params.id}?mode=${convertModeToInt(params.mode)}`).then(res => res.json()) as UserResponse;

        ok = response.ok;
        data = response.data;
        message = response.message as string;
    }

    if (!ok) return redirect(`/users/${params.id}/${params.mode}`);

    const report = async (state: ReportFormServerState, payload: FormData): Promise<ReportFormServerState> => {
        "use server";

        const { user: authorized_user, headers } = await useServerSession();


        if (!authorized_user || !data) return {
            ...state,
            ok: false,
            message: "Unauthorized"
        }

        if (!verifyCaptcha(payload.get("cf-turnstile-response") as string)) return {
            ...state,
            ok: false,
            message: "Captcha is invalid, consider reopening this modal."
        }


        if (ratelimits.has(authorized_user.id) && ratelimits.get(authorized_user.id) > Date.now()) return {
            ...state,
            ok: false,
            message: `Please wait ${moment.duration(Math.round((ratelimits.get(authorized_user.id) - Date.now()) / 1000), "ms").humanize()} before reporting again`
        }

        if (authorized_user.permissions & 8) {
            return {
                ...state,
                ok: false,
                message: "You are restricted."
            }
        };

        if (!process.env.DISCORD_REPORT_WEBHOOK) return {
            ...state,
            ok: false,
            message: "Missing Discord webhook"
        }

        let response = await fetch(process.env.DISCORD_REPORT_WEBHOOK, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                embeds: [
                    {
                        title: "New report!",
                        author: {
                            name: authorized_user.username,
                            icon_url: `https://a.lisek.world/${authorized_user.id}`,
                            url: `https://next.lisek.cc/users/${authorized_user.id}`
                        },
                        thumbnail: {
                            url: `https://a.lisek.world/${data.id}`
                        },
                        color: 0xff0000,
                        timestamp: new Date().toISOString(),
                        footer: {
                            text: `${data.id}`,
                        },
                        description: `**${user?.username} ** Reported **[${data.username}](https://next.lisek.cc/users/${data.id})** for **${payload.get("selected_reason")}: ${payload.get("note")}**`
                    }
                ]
            })
        });

        if (!response.ok) return {
            ...state,
            ok: false,
            message: "Failed to report"
        }

        ratelimits.set(authorized_user.id, Date.now() + (1000 * 60 * 60 * 60));

        return redirect(`/users/${params.id}/${params.mode}`);
    }

    return (<Modal>
        <div className="flex flex-col gap-2">
            <div className="text-xl flex flex-col justify-center items-center px-12">
                <AlertTriangle size={64} />
                <span className="inline">
                    Report <span className="font-semibold text-red-500">{data?.username}</span>?
                </span>
            </div>
            <ReportForm action={report} />
        </div>
    </Modal>)
}