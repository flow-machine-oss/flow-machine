import { SignUp } from "@clerk/nextjs";
import { Center } from "@/component/extended-ui/center";

export default function Page() {
  return (
    <Center>
      <SignUp />
    </Center>
  );
}
