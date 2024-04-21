import { pool } from "@/app/layout";
import PostForm, { PostServerState } from "@/components/forms/post";
import { useServerSession } from "@/hooks/useSession";
import { put } from '@vercel/blob';
import { redirect } from "next/navigation";

export default async function Page() {

    const { user } = await useServerSession();
        
    if (!user) {
        return redirect("/");
    }

    if (!(user.permissions & 16)) {
        return redirect("/");
    }


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

        const id = crypto.randomUUID();

        
        
        let blob = await put(`/posts/${id}/image.png`, payloadData.background, {
            access: "public"
        });

        let result = await pool.query(`
INSERT INTO "Post"("id", "createdBy", "title", "subtitle", "description", "imageUrl")
VALUES
        ($1, $2, $3, $4, $5, $6)
RETURNING "id"
        `, [id, user.id, payloadData.title, payloadData.slug, payloadData.content, blob.url]).then(r => r.rows[0]);

        return redirect("/");
    }
    return (<div className="w-full sm:w-3/4 min-h-24 bg-background-900/20 rounded-xl flex flex-col justify-center p-4 flex-wrap">
        <PostForm process={processPost} />
    </div>)
}