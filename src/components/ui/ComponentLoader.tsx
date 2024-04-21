import { Loader2 } from "lucide-react";


export default function ComponentLoader() {
    return (
        <div className="flex justify-center items-center w-full">
            <Loader2 className="animation w-12 h-12 animate-spin" />
        </div>
    )
}