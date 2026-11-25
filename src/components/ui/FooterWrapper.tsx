import { connection } from "next/server";
import { db } from "@/lib/db/api";
import Footer from "@/components/ui/Footer";

export default async function FooterWrapper() {
  await connection();
  const bankAccounts = await db.getBankAccounts();
  return <Footer bankAccounts={bankAccounts} />;
}

