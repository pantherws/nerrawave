import { NextResponse } from "next/server"

export function GET() {
  return NextResponse.json({
    ok: true,
    app: "nerrawave-web",
    time: new Date().toISOString(),
  })
}
