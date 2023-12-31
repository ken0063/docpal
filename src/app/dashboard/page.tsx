import Dashboard from "@/components/Dashboard";
import { db } from "@/db";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const user = await currentUser();

  if (!user || !user?.id) {
    redirect("/auth-callback?origin=dashboard");
  }
  const dbUser = await db?.user?.findFirst({
    where: {
      id: user?.id,
    },
  });

  if (!dbUser) redirect("/auth-callback?origin=dashboard");

  return <Dashboard />;
};

export default DashboardPage;
