import { NextResponse } from "next/server";
import { globalConfig } from "@/lib/global-config";

export const GET = () => {
  return NextResponse.json({
    status: "ok",
    version: globalConfig.app.version,
    environment: globalConfig.app.env,
  });
};
