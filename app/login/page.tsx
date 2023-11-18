import LoginPage from "@components/LoginPage";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function Login() {
  const session = await getServerSession(authOptions as any);
  if (session) redirect("/");

  return <LoginPage />;
}
