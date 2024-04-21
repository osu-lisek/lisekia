import { NextRequest, NextResponse } from "next/server";


export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
    return NextResponse.redirect(`https://lisek.world/api/v1/scores/${params.id}/replay`)
}