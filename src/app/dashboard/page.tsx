import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const user = await currentUser();

  if (!user || !user?.id) {
    redirect("/auth-callback?origin=dashboard");
  }

  return <div>DashboardPage</div>;
};

export default DashboardPage;
