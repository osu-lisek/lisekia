"use client";

import MDEditor from "@uiw/react-md-editor";


export default function Markdown({ children, ...props }: { children: string, className: string }) {
    return (
        <MDEditor.Markdown source={children} {...props} />
    )
}