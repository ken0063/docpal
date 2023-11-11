"use client";

import { trpc } from "@/app/_trpc/client";
import Upload from "./Upload";
import { Ghost, Loader2, MessagesSquare, Plus, Trash } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import Link from "next/link";
import { formatDate } from "@/utils";
import { Button } from "./ui/button";
import ConfirmAction from "./ConfirmAction";
import useToast from "@/app/hooks/useToast";
import { useState } from "react";

const Dashboard = () => {
  const { data: files, isLoading } = trpc.getUserFiles.useQuery();

  const { errorToast, successToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const utils = trpc.useUtils();

  const { mutate: deleteFile, isLoading: isDeleteLoading } =
    trpc.deleteFile.useMutation({
      onSuccess: () => {
        successToast("File Deleted Succefully");
        utils.getUserFiles.invalidate();
        setIsOpen(false);
      },
      onError: (error: any) => {
        errorToast(error);
      },
    });

  return (
    <div className="mx-auto max-w-7xl md:p-10">
      <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
        <h1 className="mb-3 font-bold text-5xl text-gray-700">
          Uploaded Files
        </h1>
        <Upload />
      </div>

      {/* Display uploaded files */}

      <div>
        {files && files?.length !== 0 ? (
          <ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-500 md:grid-cols-2 lg:grid-cols-3">
            {files?.map((file: any) => (
              <li
                key={file?.id}
                className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg"
              >
                <Link
                  href={`/dashboard/${file.id}`}
                  className="flex flex-col gap-2"
                >
                  <div className="pt-6 px-6 flex w-full items-center justify-between space-x-6">
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
                    <div className="flex-1 truncate">
                      <div className="flex items-center space-x-3">
                        <h3 className="truncate text-md font-medium text-gray-900 capitalize">
                          {file?.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                </Link>
                <div className="px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-6 text-xs texte-zinc-500">
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    {formatDate(file?.createdAt)}
                  </div>

                  <div className="flex items-center gap-2">
                    <MessagesSquare className="w-4 h-4" />
                    mocked
                  </div>

                  <ConfirmAction
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    trigger={
                      <Button size={"sm"} variant={"ghost"}>
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    }
                    action={
                      <Button
                        variant={"destructive"}
                        className="w-full"
                        onClick={() => deleteFile({ id: file?.id })}
                      >
                        {isDeleteLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          "Delete File"
                        )}
                      </Button>
                    }
                    message={
                      <p>
                        Are you sure you want to delete{" "}
                        <span className="font-semibold capitalize">
                          {file?.name}
                        </span>
                        ?
                      </p>
                    }
                    title="Delete File"
                    disabled={isDeleteLoading}
                  />
                </div>
              </li>
            ))}
          </ul>
        ) : isLoading ? (
          <Skeleton height={40} className="my-2" count={3} />
        ) : (
          <div className="mt-24 flex flex-col items-center gap-2">
            <Ghost className="h-8 w-8 text-purple-700" />
            <h3 className="font-semibold text-xl">No files uploaded yet.</h3>
            <p>Upload your first file</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
