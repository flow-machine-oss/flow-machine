import { Inngest } from "inngest";

class InngestClientFactory {
  make() {
    return new Inngest({ id: "flow-machine" });
  }
}

export { InngestClientFactory };
