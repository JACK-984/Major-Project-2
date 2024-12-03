"use client";
import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import Link from "next/link";
import { log } from "console";

export default function LoginPage() {
  const { data: session } = useSession();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center">
            <Icons.logo className="h-12 w-12" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Sign in to your account</CardTitle>
          <CardDescription className="text-center">
            Use your Google account to sign in or create a new account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button className="w-full" variant="outline" onClick={() => signIn("google")}>
            <Icons.google className="mr-2 h-4 w-4" />
            Sign in with Google
          </Button>
          <Button className="w-full" variant="outline" onClick={() => console.log(session)}>
            <Icons.google className="mr-2 h-4 w-4" />
            LOG OUT SESSION
          </Button>
        </CardContent>
        <CardFooter>
          <p className="text-center text-sm text-gray-600 mt-2 w-full">
            Don&apos;t have an account?{" "}
            <Link href="#" className="font-medium text-blue-600 hover:text-blue-500">
              Sign up with Google
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
