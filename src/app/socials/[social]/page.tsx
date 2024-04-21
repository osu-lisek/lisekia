import { redirect } from "next/navigation"

type Socials = "discord";

type PageProps = {
    params: {
        social: Socials
    }
}

const socials: { [K in Socials]: string } = {
    'discord': "https://discord.gg/Pke7upHf3m"
};
export default async function SocialsPage({ params }: PageProps) {
    if (socials[params.social]) return redirect(socials[params.social])

    return redirect("/");
}