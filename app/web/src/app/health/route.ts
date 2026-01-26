import { NextResponse } from "next/server";
import { config } from "@/lib/config";

export const GET = () => {
  return NextResponse.json({
    status: "ok",
    version: config.app.version,
    environment: config.app.env,
  });
};
