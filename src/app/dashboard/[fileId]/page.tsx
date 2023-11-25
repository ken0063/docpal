import ChatWrapper from "@/components/ChatWrapper";
import PdfRenderer from "@/components/PdfRenderer";
import { db } from "@/db";
import { currentUser } from "@clerk/nextjs";
import { notFound, redirect } from "next/navigation";
import { FC } from "react";

type Props = {
  params: {
    fileId: string;
  };
};

const FileDetailsPage: FC<Props> = async ({ params }) => {
  const fileId = params?.fileId;

  const user = await currentUser();

  if (!user || !user?.id) {
    redirect(`/auth-callback?origin=dashboard/${fileId}`);
  }
  const dbUser = await db?.user?.findFirst({
    where: {
      id: user?.id,
    },
  });

  if (!dbUser) redirect(`/auth-callback?origin=dashboard/${fileId}`);

  const file = await db.file.findFirst({
    where: {
      id: fileId,
      userId: dbUser?.id,
    },
  });

  if (!file) notFound();

  return (
    <div className="flex flex-col flex-1 justify-between h-[calc(100vh-3.5rem)] w-full">
      <div className="full max-w-8xl grow lg:flex xl:px-2">
        {/* left side */}

        <div className="flex-1 xl:flex">
          <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
            <PdfRenderer url={file?.url} />
          </div>
        </div>

        {/* right side */}
        <div className="shrink-0 flex-[0.75] border-t border-slate-300 lg:w-96 lg:border-l lg:border-t-0">
          {" "}
          <ChatWrapper />
        </div>
      </div>
    </div>
  );
};

export default FileDetailsPage;
