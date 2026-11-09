import { db } from "@/lib/db/api";
import Footer from "@/components/ui/Footer";

export default async function FooterWrapper() {
  const bankAccounts = await db.getBankAccounts();
  return <Footer bankAccounts={bankAccounts} />;
}

