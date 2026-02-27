import { InngestHttpRouterFactory } from "@/v2/api/module/inngest/http-router-factory";
import { InngestClientFactory } from "@/v2/infra/inngest/client-factory";

const inngestClientFactory = new InngestClientFactory();
const inngestClient = inngestClientFactory.make();

const inngestHttpRouterFactory = new InngestHttpRouterFactory(
  inngestClient,
  [],
);

export { inngestHttpRouterFactory };
