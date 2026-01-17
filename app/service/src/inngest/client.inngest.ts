import { Inngest } from "inngest";

export const inngestClient = new Inngest({ id: "flow-machine" });

const helloWorld = inngestClient.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  },
);

export const inngestFunctions = [helloWorld];
