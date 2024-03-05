import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) { 
    const body = req.body;
    return NextResponse.json({})
}