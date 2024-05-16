import { Brush } from "lucide-react";
import { useServerSession } from "@/hooks/useSession";
import NavigationSettings from "@/components/NavigationSettings"

export default async function Page() {
    const { user } = await useServerSession();
    return (
        <div className="w-full sm:w-[80%] flex gap-2.5">
            <NavigationSettings/>
            <div className="w-full sm:w-[80%] bg-background-900/50 rounded-b-xl rounded-t-md">
                <div className="h-5 flex flex-row items-center gap-2 py-6 px-4 bg-background-950/20 text-xl rounded-t-md">
                    <Brush /> Appearance
                </div>
                <div className="w-full flex p-2.5">
                    <div className="w-full flex flex-col">
                        {user &&
                        <>
                        <form action="">
                            <div className="flex flex-col gap-4">
                                <div className="flex gap-12">
                                    <span className="text-white/80">Banner</span>
                                    <input type="file" accept="image/jpeg, image/png" name="banner" id="banner" className="w-full hidden" />
                                    <label htmlFor="banner" className="cursor-pointer [&>img]:hover:brightness-90 [&>img]:hover:opacity-50">
                                        <img width={350} src={`https://osu.okayu.pw/banners/36`} className="rounded-md border-2 border-background-300/70 duration-[200ms]" alt="" />
                                    </label>
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
