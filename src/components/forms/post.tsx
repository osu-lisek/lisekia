"use client";

import InputFieldWithIcon from "../ui/InputFieldWithIcon";
import { ALargeSmallIcon, FileIcon, PodcastIcon } from "lucide-react";
import MDEditor from '@uiw/react-md-editor';
import { useRef, useState } from "react";
import { useFormState } from "react-dom";
import WebsiteAlert, { AlertType } from "../ui/WebsiteAlert";
import { FormButton } from "../ui/FormButton";


export interface PostServerState {
    ok: boolean;
    message: string;
}

export interface Post {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    background: string;
    user_id: number;
    created_at: string;
    updated_at: string;
}


export default function PostForm({ process, post }: { process: (state: PostServerState, payload: FormData) => Promise<PostServerState>, post?: Post }) {
    const [value, setValue] = useState(post?.description ?? "");
    const [file, setFile] = useState<File>();
    const backgroundInputRef = useRef<HTMLInputElement>(null);
    const [state, formAction] = useFormState(process, { ok: false, message: "" });

    return (
        <form className="w-full flex flex-col justify-center gap-2" action={formAction}>
            {!state.ok && state.message && <WebsiteAlert data={{ type: AlertType.Error, message: state.message }} />}
            <InputFieldWithIcon type="text" required={false} icon={<ALargeSmallIcon />} name="title" placeholder="Title" className="w-full" title="Name" defaultValue={post?.title} />
            <InputFieldWithIcon type="text" required={false} icon={<PodcastIcon />} name="slug" placeholder="Slug" className="w-full" title="Slug (short description under title)"  defaultValue={post?.subtitle} />
            {/* @ts-ignore */}
            <MDEditor onChange={setValue} value={value} className="bg-background-950/40 w-full"   />
            <input type="hidden" name="content" value={value} ref={backgroundInputRef} />
            <div className="w-32 h-32 bg-background-950 rounded-md">
                <input type="file" name="background" className="hidden" onChange={(e) => setFile(e.target.files?.[0])} id="background" accept="image/*" />
                <label className="w-full h-full flex flex-col justify-center items-center gap-1 cursor-pointer select-none" htmlFor="background">
                    <FileIcon size={32} />
                    <span className="text-background-300">
                        {file?.name ?? "Upload image"}
                    </span>
                </label>
            </div>
            <FormButton className="px-12 py-2 shadow-md w-fit" disabled={state.ok}>
                {post ? "Update" : "Create"}
            </FormButton>
        </form>
    )
}