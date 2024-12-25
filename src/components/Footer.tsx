import { CodeIcon, Globe2Icon, PencilIcon, Users2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";


export async function Footer() {
    return (
        <div className="bg-mine-shaft-950 pt-4 px-4 sm:px-[10%] flex flex-col gap-20 sm:gap-12">
            <div className="flex flex-col sm:flex-row justify-center items-center sm:justify-between gap-6">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-20">
                    <div className="flex flex-col gap-1.5 text-center sm:text-left">
                        <div className="flex flex-row gap-1 text-3xl items-center justify-center sm:justify-start text-center sm:text-left">
                            <Globe2Icon className="hidden sm:block" /> General
                        </div>
                        <div className="flex flex-col gap-0.5 text-xl text-primary-600 text-center sm:text-left">
                            <Link href={`https://osu.lisek.cc/docs/how-to-connect`} className="hover:text-primary-500 duration-300">
                                How to connect?
                            </Link>
                            <Link href={`https://osu.lisek.cc/docs/rules`} className="hover:text-primary-500 duration-300 ">
                                Rules
                            </Link>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5 text-center sm:text-left">
                        <div className="flex flex-row gap-1 text-3xl items-center justify-center sm:justify-start text-center sm:text-left">
                            <Users2Icon className="hidden sm:block" /> Social
                        </div>
                        <div className="flex flex-col gap-0.5 text-xl text-primary-600">
                            <Link href={`https://discord.com/invite/Pke7upHf3m`} className="hover:text-primary-500 duration-300">
                                Discord
                            </Link>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5  text-center sm:text-left">
                        <div className="flex flex-row gap-1 text-3xl items-center justify-center sm:justify-start text-center sm:text-left">
                            <PencilIcon className="hidden sm:block" /> Dev
                        </div>
                        <div className="flex flex-col gap-0.5 text-xl text-primary-600">
                            <Link href={`https://gitlab.osu.lisek.cc`} className="hover:text-primary-500 duration-300">
                                Gitlab
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center flex-col  gap-2">
                    <div className="flex flex-col">
                        <div className="text-4xl justify-center sm:justify-start flex">
                            osu!<span className="text-primary-600">lisek</span>
                        </div>
                        <div className="text-white/60">
                            We don't look for easy ways.
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <a href="https://aaio.so/" target="_blank">
                            <Image src="https://aaio.so/assets/svg/banners/big/dark-2.svg" title="Aaio - Сервис по приему онлайн платежей" alt="aaio" width={100} height={50} />
                        </a>
                    </div>

                </div>
            </div>
            <div className="w-full flex justify-center items-center pb-16 sm:pb-2 text-background-300 flex-col">
                <span>
                    Lisekia - The next frontend of osu!lisek
                </span>
                <span>
                    contact@lisek.cc
                </span>
            </div>
        </div>
    )
}