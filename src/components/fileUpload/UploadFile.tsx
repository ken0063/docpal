"use client";
import Dropzone from "react-dropzone";
import { DialogHeader, DialogTitle } from "../ui/dialog";
import { Cloud, File } from "lucide-react";
import { useState } from "react";
import { Progress } from "../ui/progress";
import { useUploadThing } from "@/lib/uploadthing";
import toast from "react-hot-toast";
import { trpc } from "@/app/_trpc/client";
import { useRouter } from "next/navigation";

const UploadFile = () => {
  const [isUploading, setIsUplaoding] = useState(true);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  const { startUpload } = useUploadThing("pdfUploader");

  const { mutate: startPolling } = trpc.getFile.useMutation({
    onSuccess: (file) => {
      router.push(`/dashboard/${file.id}`);
    },
    retry: true,
    retryDelay: 500,
  });

  const simulateUpload = () => {
    setProgress(0);
    const totalSteps = 100;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep += 5;
      setProgress((currentStep / totalSteps) * 100);

      if (currentStep === totalSteps) {
        clearInterval(interval);
      }
    }, 100);
    return interval;
  };

  const handleUpload = async (acceptedFile: any[]) => {
    setIsUplaoding(true);
    const progressInterval = simulateUpload();
    const res = await startUpload(acceptedFile);
    if (!res) {
      toast.error("Something went wrong.Please try again later.");
    }
    const [fileResponse]: any = res;
    const key = fileResponse?.key;

    if (!key) {
      toast.error("Something went wrong.Please try again later.");
    }
    clearInterval(progressInterval);
    setProgress(100);
    startPolling({ key });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Upload File</DialogTitle>
      </DialogHeader>
      <Dropzone
        multiple={false}
        onDrop={(acceptedFile) => handleUpload(acceptedFile)}
      >
        {({ getRootProps, getInputProps, acceptedFiles }) => (
          <div
            {...getRootProps()}
            className="border h-64 m-4 border-dashed rounded-lg border-slate-300"
          >
            <div className="flex items-center justify-center h-full w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-full cursor-pointer bg-zinc-50 rounded-lg hover:bg-zinc-100"
              >
                {acceptedFiles && acceptedFiles[0] ? (
                  <div className="max-w-xs bg-white flex items-center rounded-md overflow-hidden outline outline-1 outline-gray-300 divide-x divide-gray-300">
                    <div className="px-3 py-2 h-full grid place-items-center">
                      <File className="h-4 w-4 text-slate-500" />
                    </div>
                    <div className="px-3 py-2 h-full text-sm truncate">
                      {acceptedFiles[0]?.name}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center text-sm">
                    <Cloud className="h-12 w-12 text-slate-400 mb-2" />
                    <p className="mb-2">
                      <span className="font-semibold">Click to Browse</span> or
                      Drag & Drop Your PDF Here
                    </p>
                    <p className="text-slate-500">PDF (up to 4MB)</p>
                  </div>
                )}
                {isUploading && acceptedFiles[0] ? (
                  <div className="w-full mt-6 max-w-xs max-auto">
                    <Progress
                      value={progress}
                      max={100}
                      className="w-full h-1"
                    />
                  </div>
                ) : null}
                <input
                  type="file"
                  id="dropzone-file"
                  className="hidden"
                  aria-hidden={true}
                  {...getInputProps()}
                />
              </label>
            </div>
          </div>
        )}
      </Dropzone>
    </>
  );
};

export default UploadFile;
