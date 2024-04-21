import { faHeart, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ClientFriendForm from "./ClientFriendForm";
import { redirect } from "next/navigation";
import { useServerSession } from "@/hooks/useSession";


export default async function FriendButton({ is_friend, is_mutual, user, filter } : { is_friend: boolean, is_mutual: boolean, user: number, filter: string }) {

    const handle = async (state: {}, payload: FormData): Promise<any> => {
        "use server";        

        const { headers } = await useServerSession();

        if (!headers) return redirect("/login");

        let user = payload.get("user");

        let status = await fetch(`https://lisek.world/api/v2/users/${user}/friend`, { method: "POST", headers: {...headers} }).then(res => res.json());


        if (!status.ok) {
            return redirect("/");
        }

        return redirect(`/friends/${filter}`);
    }
    return (<ClientFriendForm is_friend={is_friend} is_mutual={is_mutual} user={user} handle={handle} />)
}