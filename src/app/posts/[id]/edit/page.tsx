import { pool } from "@/app/layout";
import PostForm, { PostServerState } from "@/components/forms/post";
import { useServerSession } from "@/hooks/useSession";
import { put } from '@vercel/blob';
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {

    const { user } = await useServerSession();

    if (!user) {
        return redirect("/");
    }

    if (!(user.permissions & 16)) {
        return redirect("/");
    }

    const post = await pool.query(`SELECT * FROM "Post" WHERE "id" = $1`, [params.id]).then(r => r.rows[0]);

    if (!post) return redirect('/news/create');

    const processPost = async (data: PostServerState, payload: FormData): Promise<PostServerState> => {
        "use server";

        const { user } = await useServerSession();

        if (!user) {
            return {
                message: "You need to be logged in to post",
                ok: false
            }
        }

        if (!(user.permissions & 16)) {
            return {
                message: "You need to be an admin to post",
                ok: false
            }
        }


        const payloadData: { title: string, content: string, slug: string, background: File, id?: number } = Object.fromEntries(payload) as unknown as any;

        if (!payloadData.title || !payloadData.content || !payloadData.slug) {
            return {
                message: "All fields are required",
                ok: false
            }
        }

        let blobUrl = post.imageUrl;
        if (payloadData.background.size > 0) {
            blobUrl = await put(`/posts/${post.id}/image.png`, payloadData.background, {
                access: "public"
            }).then(r => r.url);
        }

        await pool.query(`
UPDATE "Post" 
SET "title" = $1, "subtitle" = $2, "description" = $3, "imageUrl" = $4
WHERE "id" = $5
RETURNING "id"

        `, [payloadData.title, payloadData.slug, payloadData.content, blobUrl, post.id]);

        return redirect("/");
    }
    return (<div className="w-full sm:w-3/4 min-h-24 bg-background-900/20 rounded-xl flex flex-col justify-center p-4 flex-wrap">
        <PostForm process={processPost} post={post} />
    </div>)
}