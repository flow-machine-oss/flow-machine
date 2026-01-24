import { Daytona } from "@daytonaio/sdk";
import { config } from "@/old/lib/config";

export const daytonaClient = new Daytona({ apiKey: config.daytona.apiKey });
