import { RedirectType, redirect } from "next/navigation";

type Props = {
    params: { id: string }
}

export default async function Page({ params: { id } }: Props) {
    return redirect(`/users/${id}/standard`, RedirectType.push);
}