import { RedirectType, redirect } from "next/navigation";

export default function Page({ params: { id, mode } }: { params: { id: string, mode: string } }) {
    return redirect(`/users/${id}/${mode}`, RedirectType.push);
}