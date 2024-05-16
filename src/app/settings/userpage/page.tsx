import { BookUser } from "lucide-react";
import { useServerSession } from "@/hooks/useSession";
import NavigationSettings from "@/components/NavigationSettings"

export default async function Page() {
    const { user } = await useServerSession();
    return (
        <div className="w-full sm:w-[80%] flex gap-2.5">
            <NavigationSettings/>
            <div className="w-full sm:w-[80%] bg-background-900/50 rounded-b-xl rounded-t-md">
                <div className="h-5 flex flex-row items-center gap-2 py-6 px-4 bg-background-950/20 text-xl rounded-t-md">
                    <BookUser /> Userpage
                </div>
                <div className="w-full flex p-2.5">
                    <div className="w-full flex flex-col">
                        {user &&
                        <>
                        <form action="">
                            <div className="flex flex-col gap-4">
                                <textarea className="w-full min-h-52 appearance-none rounded bg-background-900 p-1 placeholder:text-background-200 outline:none focus:outline-none" name="userpage" id="userpage">
                                    { user.userpage_content }
                                </textarea>
                                <div className="flex gap-4 ml-auto">
                                    <a className="hover:text-white/50 duration-[200ms]" href="/rules">Rules</a>
                                    <a className="hover:text-white/50 duration-[200ms]" href="/docs/что-то">Markdown or bbcode я не ебу</a>
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
