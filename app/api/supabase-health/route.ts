import { NextResponse } from "next/server";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in environment.",
      },
      { status: 500 },
    );
  }

  try {
    const response = await fetch(`${supabaseUrl}/auth/v1/health`, {
      method: "GET",
      headers: {
        apikey: anonKey,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          ok: false,
          message: `Supabase responded with status ${response.status}.`,
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Supabase is reachable from the app server.",
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Unable to reach Supabase. Check project status and network/firewall settings.",
      },
      { status: 504 },
    );
  }
}