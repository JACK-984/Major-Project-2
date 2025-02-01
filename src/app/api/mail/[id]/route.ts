import { auth } from "@/lib/auth";
import { getGmailService } from "@/utils/gmail";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const session = await auth();
  const access_token = session?.accessToken;
  const refresh_token = session?.refreshToken;

  if (session === null) return new NextResponse("Unauthorized", { status: 401 });
  else if (access_token === null) return new NextResponse("No access token", { status: 401 });
  else if (refresh_token === null) return new NextResponse("No refresh token", { status: 401 });

  const gmail = getGmailService(access_token as string, refresh_token as string);
  const response = await (
    await gmail
  ).users.threads.get({
    userId: "me",
    id: id,
    format: "full", // Use 'full' to get the complete message data
  });

  const thread = response.data;
  const messages = thread.messages || [];

  // Extract necessary data from each message in the thread
  const formattedMessages = messages.map((message) => {
    const headers = message.payload?.headers || [];
    const subjectHeader = headers.find((header) => header.name === "Subject");
    const fromHeader = headers.find((header) => header.name === "From");
    const toHeader = headers.find((header) => header.name === "To");
    const dateHeader = headers.find((header) => header.name === "Date");

    // Extract the body of the message
    const body =
      message.payload?.parts?.find((part) => part.mimeType === "text/plain")?.body?.data || "";
    const htmlBody =
      message.payload?.parts?.find((part) => part.mimeType === "text/html")?.body?.data || "";

    return {
      id: message.id,
      subject: subjectHeader?.value || "No Subject",
      from: fromHeader?.value || "Unknown Sender",
      to: toHeader?.value || "Unknown Recipient",
      date: dateHeader?.value || "Unknown Date",
      body: Buffer.from(body, "base64").toString("utf-8"), // Decode base64 encoded body
      htmlBody: Buffer.from(htmlBody, "base64").toString("utf-8"), // Decode base64 encoded HTML body
    };
  });

  return new NextResponse(JSON.stringify(formattedMessages), { status: 200 });
}

// export async function GET(req: Request, { params }: { params: { id: string } }) {
//   const { id } = params;
//   const session = await auth();
//   const access_token = session?.accessToken;
//   const refresh_token = session?.refreshToken;

//   if (session === null) return new NextResponse("Unauthorized", { status: 401 });
//   else if (access_token === null) return new NextResponse("No access token", { status: 401 });
//   else if (refresh_token === null) return new NextResponse("No refresh token", { status: 401 });
//   const gmail = getGmailService(access_token as string, refresh_token as string);
//   const response = await (
//     await gmail
//   ).users.threads.get({
//     userId: "me",
//     id: id,
//     format: "minimal",
//   });

//   return new NextResponse(JSON.stringify(response.data), { status: 200 });
// }
