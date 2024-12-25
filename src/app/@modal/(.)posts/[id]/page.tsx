import { pool } from "@/app/layout";
import { NewsEntry } from "@/app/page";
import Modal from "@/components/modals/Modal";
import Markdown from "@/components/ui/Markdown";
import Image from "next/image";
import Link from "next/link";

export default async function Page({ params: { id } }: { params: { id: string } }) {

    const post: NewsEntry = await pool.query(`
SELECT "Post".*, "User"."username" 
FROM "Post" 
INNER JOIN "User" ON "User".id = "Post"."createdBy"
WHERE "Post"."id" = $1
`, [id]).then(r => r.rows[0]);
    return (<Modal style={{ container: "!w-[50%] p-0" }}>
        <div className="rounded-xl overflow-hidden">
            <div>
                <Image src={post.imageUrl} alt={post.title} width={1000} height={1000} className="max-h-32 object-cover" />
                <div className="px-4 pt-2 flex flex-col gap-1">
                    <p className="text-3xl">{post.title}</p>
                    <p className="text-sm text-background-400 flex flex-row gap-1 items-center"><Link href={`/users/${post.createdBy}`} className="flex flex-row gap-1 items-center"><Image src={`https://a.lisek.cc/${post.createdBy}`} width={32} height={32} alt={post.username} className="rounded-full"/>{post.username}</Link></p>
                    <p className="text-sm text-background-400">
                        {/** @ts-ignore */}
                        {new Date(post.date).toLocaleDateString({ locale: 'en-US' }, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
            </div>
            <div className="p-4">
                <Markdown className="max-h-128 overflow-x-auto text-balance">
                    {post.description}
                </Markdown>
            </div>

        </div>
    </Modal>)
}