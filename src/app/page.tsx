"use client";
import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  return (
    <div>
      {session?.user && <p>logged in</p>}
      <div>home page</div>
      <Button onClick={() => signOut()}>Sign out</Button>
    </div>
  );
}
