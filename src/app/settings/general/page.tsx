import { UserRoundCog } from "lucide-react";
import { useServerSession } from "@/hooks/useSession";
import NavigationSettings from "@/components/NavigationSettings"

export default async function Page() {
    const { user } = await useServerSession();
    return (
        <div className="w-full sm:w-[80%] flex gap-2.5">
            <NavigationSettings/>
            <div className="w-full sm:w-[80%] bg-background-900/50 rounded-b-xl rounded-t-md">
                <div className="h-5 flex flex-row items-center gap-2 py-6 px-4 bg-background-950/20 text-xl rounded-t-md">
                    <UserRoundCog /> General
                </div>
                <div className="w-full flex p-2.5">
                    <div className="w-full flex flex-col">
                        {user &&
                        <>
                        <form action="">
                            <div className="flex items-center gap-4 mb-4">
                                <input type="file" accept="image/jpeg, image/png" name="avatar" id="avatar" className="w-full hidden" />
                                <label htmlFor="avatar" className="cursor-pointer [&>img]:hover:brightness-90 [&>img]:hover:opacity-50">
                                    <img width={100} src={`https://a.lisek.world/${user.id}`} className="rounded-md duration-[200ms]" alt="" />
                                </label>
                                <div className="flex flex-col">
                                    <span>max size: 500Kb</span>
                                    <span className="text-">recomended image size: 512x512 (or 1:1 ratio)</span>
                                    <button type="submit" className="p-1.5 hover:bg-primary-700 duration-[200ms] bg-primary-900 rounded-md">Submit</button>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4">
                                <div className="flex-col sm:w-[50%]">
                                    <span className="text-white/80 mb-1">Username</span>
                                    <input className="w-full appearance-none rounded bg-background-900 p-1 placeholder:text-background-200 outline:none focus:outline-none" type="text" name="username" defaultValue={user.username} />
                                </div>
                                <div className="flex-col sm:w-[50%]">
                                    <span className="text-white/80 mb-1">Email</span>
                                    <input className="w-full appearance-none rounded bg-background-900 p-1 placeholder:text-background-200 outline:none focus:outline-none" type="text" name="email" disabled />
                                </div>
                                <button type="submit" className="p-1.5 hover:bg-primary-700 duration-[200ms] bg-primary-900 rounded-md">Save</button>
                                {/* <div className="flex">
                                    <span className="text-white/80">Preffered mode</span>
                                    <select className="text-white/80 bg-background-900 rounded ml-4 w-60" name="fav" id="fav_mode">
                                        <option value="std"> Standard</option>
                                        <option value="taiko"> Taiko</option>
                                        <option value="ctb"> CTB</option>
                                        <option value="mania">Mania</option>
                                        <option value="std!rx">Standard!RX</option>
                                    </select>
                                </div> */}
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
