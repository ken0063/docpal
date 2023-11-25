"use client";

import { FC, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Expand, Loader2 } from "lucide-react";
import SimpleBar from "simplebar-react";
import { Document, Page } from "react-pdf";
import { useResizeDetector } from "react-resize-detector";
import toast from "react-hot-toast";

type Props = {
  url: string;
};

const DocFullPage: FC<Props> = ({ url }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { width, ref, height } = useResizeDetector();
  const [pageNum, setPageNum] = useState(0);
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(visible) => {
        if (!visible) {
          setIsOpen(visible);
        }
      }}
    >
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        <Button variant="ghost" className="p-2" aria-label="fullscreen">
          <Expand className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl w-full">
        <SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)]">
          <div ref={ref}>
            <Document
              className="max-h-full"
              file={url}
              onLoadError={() =>
                toast.error("Error loading PDF. Please try again later")
              }
              onLoadSuccess={({ numPages }) => {
                setPageNum(numPages);
              }}
              loading={
                <div className="flex flex-col gap-4 justify-center items-center h-[calc(100vh-35rem)]">
                  <Loader2 className="w-14 h-14 animate-spin" />
                  Loading PDF...
                </div>
              }
            >
              {new Array(pageNum).fill(0).map((_, i) => (
                <Page
                  pageNumber={i + 1}
                  width={width ?? 1}
                  height={height ?? 1}
                  key={i}
                />
              ))}
            </Document>
          </div>
        </SimpleBar>
      </DialogContent>
    </Dialog>
  );
};

export default DocFullPage;
