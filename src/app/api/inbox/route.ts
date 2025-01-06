import { auth } from "@/lib/auth";
import { getGmailService } from "@/utils/gmail";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await auth();
  const access_token = session?.accessToken;
  const refresh_token = session?.refreshToken;

  if (session === null) return new NextResponse("Unauthorized", { status: 401 });
  else if (access_token === null) return new NextResponse("No access token", { status: 401 });
  else if (refresh_token === null) return new NextResponse("No refresh token", { status: 401 });

  const gmail = getGmailService(access_token as string, refresh_token as string);

  const response = await (
    await gmail
  ).users.messages.list({
    userId: "me",
    maxResults: 10,
  });

  // Return just the message IDs and basic info
  return new NextResponse(JSON.stringify(response.data), { status: 200 });
}

// const res2 = await (await gmail).users.messages.get({
//   userId: "me",
//   id: response.data.messages[0].id as string
// })

// export async function GET(req: Request) {
//   const session = await auth();
//   const access_token = session?.accessToken;
//   const refresh_token = session?.refreshToken;

//   if (session === null) return new NextResponse("Unauthorized", { status: 401 });
//   else if (access_token === null) return new NextResponse("No access token", { status: 401 });
//   else if (refresh_token === null) return new NextResponse("No refresh token", { status: 401 });

//   const gmail = getGmailService(access_token as string, refresh_token as string);

//   const response = await (
//     await gmail
//   ).users.messages.list({
//     userId: "me",
//     maxResults: 10,
//   });

//   const messages = await Promise.all(
//     response.data.messages?.map(async (message) => {
//       const fullMessage = await (
//         await gmail
//       ).users.messages.get({
//         userId: "me",
//         id: message.id as string,
//       });
//       return fullMessage.data;
//     }) ?? []
//   );

//   return new NextResponse(JSON.stringify(messages), { status: 200 });
// }