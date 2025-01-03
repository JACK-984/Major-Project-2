"use client";
import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div>
      {session?.user && <p>Logged in</p>}
      <Button onClick={() => signIn("google")}>test sign in</Button>
      <Button onClick={() => console.log(session?.user)}>Log out session</Button>
    </div>
  );
}
