import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    return NextResponse.json({ user: session?.user || null });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { user:null }
    );  
  }
}
