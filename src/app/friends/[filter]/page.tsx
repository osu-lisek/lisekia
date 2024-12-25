import FriendButton from "@/components/social/FriendButton";
import { useServerSession } from "@/hooks/useSession";
import { UserSquare2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

type FriendsEntry = {
    id: number
    username: string
    is_mutual: boolean
    is_online: boolean
    banner?: string
    country: String
}
export type FriendsResponse = {
    ok: boolean
    data: Array<FriendsEntry>
}


const filterColors = {
    online: "bg-green-600",
    offline: "bg-red-600",
    mutual: "bg-blue-600",
    all: "bg-white",
    followers: "bg-yellow-600"
}

const FilterItem = ({ color, count, name, active }: { count: number, color: keyof typeof filterColors, name: String, active: boolean }) => {
    return (<Link href={`/friends/${name.toLowerCase()}`} className={`select-none text-md pl-1 pr-6 flex flex-col justify-start relative data-[active="false"]:brightness-50`} data-active={active}>
        <div className={`absolute h-1 w-full ${filterColors[color]} rounded-xl`}></div>
        <div className="text-md font-semibold px-1 pt-1">
            {name}
        </div>
        <div className="px-1">
            {count > -1 ? count : ""}
        </div>
    </Link>)
}

const UserCard = ({ user, filter }: { user: FriendsEntry, filter: string }) => {
    return (<div className="rounded-xl w-full sm:w-[280px] bg-background-950/50 duration-300">
        <div className="h-12 w-full">
            <Image src={user.banner ? `${user.banner}` : "https://assets.osu.lisek.cc/banners/0"} width={1000} height={200} alt="User background" className="w-full h-full object-cover rounded-t-xl brightness-50"/>
        </div>
        <div className="px-4 flex flex-row gap-4">
            <div className="relative">
                <Image src={`https://a.lisek.cc/${user.id}`} width={64} height={64} className="rounded-full -translate-y-6" alt="User avatar"/>
            </div>
            <div className="text-xl flex flex-col gap-1.5">
                <div>
                    <Link href={`/users/${user.id}`}>{user.username}</Link>
                </div>
                <div className="flex flex-row gap-2">
                    <Image src={`/images/flags/${user.country == "XX" ? "__" : user.country}.png`} width={32} height={24} alt="User country" className="w-fit" />
                    <div>
                        <FriendButton is_mutual={user.is_mutual} is_friend={true} user={user.id} filter={filter} />
                    </div>
                </div>
            </div>
        </div>
        <div data-online={user.is_online} className={`w-full h-5 data-[online="true"]:bg-green-600 data-[online="false"]:bg-gray-600/20 py-4 flex flex-row items-center px-6 rounded-b-xl`}>
            {user.is_online ? "Online" : "Offline"}
        </div>
    </div>);
}

const filterUsers = (data: Array<FriendsEntry>, filter: string) => (
    { online: data.filter(user => user.is_online),
      offline: data.filter(user => !user.is_online),
      mutual: data.filter(user => user.is_mutual),
      all: data,
    }[filter] || data
);

export default async function Page({ params }: { params: { filter: string } }) {

    if (!["online", "offline", "mutual", "all", "followers"].includes(params.filter)) {
        return redirect("/friends/all");
    }

    let { user, headers } = await useServerSession();

    if (!user) return redirect("/login");

    let friends: Array<FriendsEntry> = [];

    
    const { ok, data: friendEntries } = await fetch(`https://osu.lisek.cc/api/v2/users/${user.id}/friends`, { headers: { ...headers } }).then(res => res.json()) as FriendsResponse;
    friends = friendEntries;

    //TODO: Internal server error card
    if (!ok) return <>Whoops, 500...</>;

    let followersCount = -1;

    if (user.is_donor) {
        const { ok, data: followers } = await fetch(`https://osu.lisek.cc/api/v2/users/${user.id}/followers`, { headers: { ...headers } }).then(res => res.json()) as FriendsResponse;

        if (!ok) return <>Whoops, 500...</>;

        followersCount = followers.length;

        if (params.filter == "followers") {
            friends = followers;
        }
    }

    const entries = filterUsers(friends, params.filter);
    return (
        <div className="min-h-24 w-full sm:w-[80%] bg-background-900/50 rounded-b-xl rounded-t-md">
            <div className="h-5 flex flex-row items-center gap-2 py-6 px-4 bg-background-950/20 text-xl rounded-t-md">
                <UserSquare2Icon size={32} /> Friends
            </div>

            <div className="bg-background-950/60 min-h-2 w-full flex flex-row flex-wrap px-4 py-2 gap-4">
                <FilterItem color="online" count={friendEntries.filter(c => c.is_online).length} name={"Online"} active={params.filter == "online"} />
                <FilterItem color="offline" count={friendEntries.filter(c => !c.is_online).length} name={"Offline"} active={params.filter == "offline"} />
                <FilterItem color="all" count={friendEntries.length} name={"All"} active={params.filter == "all"} />
                {user.is_donor && <FilterItem color="followers" count={followersCount} name={"Followers"} active={params.filter == "followers"} />}
            </div>
            <div className="bg-background-950/25 min-h-2 w-full flex flex-row flex-wrap px-4 py-6 gap-4">
                {entries.map((user, i) => <UserCard user={user} key={i} filter={params.filter} />)}
                {!entries.length && <div className="w-full flex flex-row justify-start text-xl">
                    Seems like no one found by this filter.    
                </div>}
            </div>
        </div>
    )
}