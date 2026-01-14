import { SignIn } from "@clerk/nextjs";
import { Center } from "@/component/extended-ui/center";

export default function Page() {
  return (
    <Center>
      <SignIn />
    </Center>
  );
}
