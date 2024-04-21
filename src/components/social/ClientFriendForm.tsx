'use client';

import { faHeart, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useFormState, useFormStatus } from "react-dom";
import ClientFriendButton from "./ClientFriendButton";

interface IClientFriendFormProps {
    user: number
    handle: (state: {}, data: FormData) => Promise<any>;
    is_friend: boolean
    is_mutual: boolean
}

export default function ClientFriendForm({ user, handle, is_friend, is_mutual }: IClientFriendFormProps) {
    const [state, formAction] = useFormState(handle, { ok: false, message: "" });
    const { pending } = useFormStatus();


    return (<form action={formAction}>
        <input type="hidden" name="user" value={user} />
        <ClientFriendButton>
            <button data-pending={pending} type="submit" data-status={is_friend && !is_mutual ? "friend" : "mutual"} className={`duration-300 data-[status="friend"]:hover:bg-green-500 data-[status="friend"]:bg-green-700 data-[status="mutual"]:hover:bg-pink-500 data-[status="mutual"]:bg-pink-700 px-4 py-0.5 rounded-full flex flex-row items-center data-[pending="true"]:brightness-50`}>
            {is_friend && !is_mutual && <FontAwesomeIcon icon={faStar} width={16} height={16}  />}
            {is_mutual && <FontAwesomeIcon icon={faHeart} width={16} height={16} />}
            </button>
        </ClientFriendButton>

    </form>)
}