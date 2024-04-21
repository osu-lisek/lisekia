'use client';

import { faHeart, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useFormState, useFormStatus } from "react-dom";
import ClientFriendButton from "../ClientFriendButton";
import { UserIcon } from "lucide-react";

interface IClientProfileFriendFormProps {
    user: number
    handle: (state: { status: string, new_count: number }, data: FormData) => Promise<{ status: string, new_count: number }>;
    is_friend: boolean
    is_mutual: boolean
    count: number
    disabled: boolean
}

const getFriendStatus = (is_friend: boolean, is_mutual: boolean) => {
    if (is_friend && is_mutual) {
        return "mutual";
    }

    if (is_friend) {
        return "friend";
    }

    return "none";
}

export default function ProfileClientFriendForm({ disabled, count, user, handle, is_friend, is_mutual }: IClientProfileFriendFormProps) {
    const [state, formAction] = useFormState(handle, { new_count: count, status: getFriendStatus(is_friend, is_mutual) });
    const { pending } = useFormStatus();

    

    return (<form action={formAction}>
        <input type="hidden" name="user" value={user} />
        <ClientFriendButton>
            <button data-pending={pending} type="submit" data-disabled={disabled} data-status={state.status} className={`duration-300 data-[status="friend"]:hover:bg-green-500 data-[status="friend"]:bg-green-700 data-[status="mutual"]:hover:bg-pink-500 data-[status="mutual"]:bg-pink-700 rounded-full flex flex-row items-center data-[pending="true"]:brightness-50 bg-background-800/80 px-6 py-2 data-[disabled="true"]:pointer-events-none`}>
                <UserIcon size={24} /> {state.new_count}
            </button>
        </ClientFriendButton>

    </form>)
}