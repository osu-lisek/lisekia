import { Shield } from "lucide-react";
import { useServerSession } from "@/hooks/useSession";
import NavigationSettings from "@/components/NavigationSettings"

export default async function Page() {
    const { user } = await useServerSession();
    return (
        <div className="w-full sm:w-[80%] flex gap-2.5">
            <NavigationSettings/>
            <div className="w-full sm:w-[80%] bg-background-900/50 rounded-b-xl rounded-t-md">
                <div className="h-5 flex flex-row items-center gap-2 py-6 px-4 bg-background-950/20 text-xl rounded-t-md">
                    <Shield /> Security
                </div>
                <div className="w-full flex p-2.5">
                    <div className="w-full flex flex-col">
                        {user &&
                        <>
                        <form action="">
                            <div className="flex flex-col gap-4">
                                <div className="flex-col sm:w-[50%]">
                                    <span className="text-white/80 mb-1">Current password</span>
                                    <input className="w-full appearance-none rounded bg-background-900 p-1 placeholder:text-background-200 outline:none focus:outline-none" type="password" name="password" />
                                </div>
                                <div className="flex-col sm:w-[50%]">
                                    <span className="text-white/80 mb-1">New password</span>
                                    <input className="w-full appearance-none rounded bg-background-900 p-1 placeholder:text-background-200 outline:none focus:outline-none" type="password" name="new-pass" />
                                </div>
                                <div className="flex-col sm:w-[50%]">
                                    <span className="text-white/80 mb-1">Repeat new password</span>
                                    <input className="w-full appearance-none rounded bg-background-900 p-1 placeholder:text-background-200 outline:none focus:outline-none" type="password" name="new-pass" />
                                </div>
                                <button type="submit" className="p-1.5 hover:bg-primary-700 duration-[200ms] bg-primary-900 rounded-md">Submit</button>
                            </div>
                        </form>
                        </>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
