import { faHeart, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ClientFriendForm from "./ProfileClientFriendForm";
import { redirect } from "next/navigation";
import { useServerSession } from "@/hooks/useSession";
import ProfileClientFriendForm from "./ProfileClientFriendForm";

const getFriendStatus = (is_friend: boolean, is_mutual: boolean) => {
    if (is_mutual) {
        return "mutual";
    }

    if (is_friend) {
        return "friend";
    }

    return "none";
}

export default async function ProfileFriendButton({ disabled, is_friend, is_mutual, user, count } : { is_friend: boolean, is_mutual: boolean, user: number, count: number, disabled: boolean }) {

    const handle = async (state: { status: string, new_count: number }, payload: FormData): Promise<{ status: string, new_count: number }> => {
        "use server";        

        const { headers, user: auth } = await useServerSession();

        if (!headers) return redirect("/login");

        let user = payload.get("user")?.toString();

        let status = await fetch(`https://osu.lisek.cc/api/v2/users/${user}/friend`, { method: "POST", headers: {...headers} }).then(res => res.json());


        if (!status.ok) {
            return redirect("/");
        }

        let friends = await fetch(`https://osu.lisek.cc/api/v2/users/${auth?.id}/friends`, { method: "GET", headers: {...headers} }).then(res => res.json());


        let friend_entry = friends.data.find((friend: { id: number }) => friend.id == parseInt(user??"0"));

        let friend_profile = await fetch(`https://osu.lisek.cc/api/v2/users/${user}`, { method: "GET", headers: {...headers} }).then(res => res.json());

        return { status: getFriendStatus(friend_entry ? true : false, friend_entry?.is_mutual), new_count: friend_profile?.data?.followers };
    }
    return (<ProfileClientFriendForm disabled={disabled} is_friend={is_friend} is_mutual={is_mutual} user={user} handle={handle} count={count} />)
}