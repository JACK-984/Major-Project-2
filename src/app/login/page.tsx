"use client";

import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";

import Image from "next/image";
import { FcGoogle } from "react-icons/fc";

export default function page() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-20 h-20 relative">
            <Image
              src="/placeholder.svg"
              alt="Email Client Logo"
              layout="fill"
              objectFit="contain"
            />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Welcome to PHNER</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in with your Google account to access your emails
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Button
            className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => {
              signIn("google");
            }}
          >
            <FcGoogle className="w-5 h-5 mr-2" />
            Sign in with Google
          </Button>
        </div>
      </div>
    </div>
  );
}
