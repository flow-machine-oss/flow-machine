import { Daytona } from "@daytonaio/sdk";
import { config } from "@/lib/config";

export const daytonaClient = new Daytona({ apiKey: config.daytona.apiKey });
