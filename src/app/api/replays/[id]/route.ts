import { NextRequest, NextResponse } from "next/server";


export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
    return NextResponse.redirect(`https://osu.lisek.cc/api/v1/scores/${params.id}/replay`)
}