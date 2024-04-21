import { redirect } from "next/navigation";


export default async function Page() {
    return redirect("/friends/all");
}