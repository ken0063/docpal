"use client";
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  RotateCcw,
  RotateCw,
  Search,
} from "lucide-react";
import { FC, useState } from "react";
import toast from "react-hot-toast";
import { Document, Page, pdfjs } from "react-pdf";
import { useResizeDetector } from "react-resize-detector";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SimpleBar from "simplebar-react";

import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { z } from "zod";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import DocFullPage from "./DocFullPage";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

type Props = {
  url: string;
};

const PdfRenderer: FC<Props> = ({ url }) => {
  const [pageNum, setPageNum] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [renderedScale, setRenderedScale] = useState<number | null>(null);

  const isLoading = renderedScale !== zoom;

  const pageValidator = z.object({
    page: z.string().refine((num) => Number(num) > 0 && Number(num) <= pageNum),
  });

  type PageType = z.infer<typeof pageValidator>;

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<PageType>({
    defaultValues: {
      page: String(currentPage),
    },
    resolver: zodResolver(pageValidator),
  });
  const { width, ref, height } = useResizeDetector();
  const handleSubmitPage = (data: PageType) => {
    setCurrentPage(Number(data.page));
    setValue("page", String(data?.page));
  };

  return (
    <div className="bg-white rounded-md w-full shadow flex flex-col items-center">
      <div className="h-14  border-b border-slate-300 w-full flex items-center justify-between px-2">
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1.5">
            <Input
              className={cn(
                "w-12 h-8",
                errors.page && "focus-visible:ring-red-500"
              )}
              {...register("page")}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit(handleSubmitPage)();
                }
              }}
            />

            <p className="text-slate-500 text-sm space-x-1">
              <span>/</span>
              <span>{pageNum}</span>
            </p>
          </div>
          <div className="flex flex-col  justify-around items-center ">
            <Button
              aria-label="next page"
              variant="ghost"
              className="p-0 m-0 h-fit"
              onClick={() => {
                setCurrentPage((prev) => {
                  if (prev - 1 > 1) {
                    return prev - 1;
                  }
                  return 1;
                });
                setValue("page", String(currentPage - 1));
              }}
              disabled={currentPage <= 1}
            >
              <ChevronUp className="w-4 h-4 " />
            </Button>
            <Button
              aria-label="previous page"
              variant="ghost"
              className="p-0 m-0 h-fit"
              onClick={() => {
                setCurrentPage((prev) => {
                  if (prev + 1 < pageNum) {
                    return prev + 1;
                  }

                  return pageNum;
                });
                setValue("page", String(currentPage + 1));
              }}
              disabled={currentPage >= pageNum}
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>{" "}
        </div>
        <div className="space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                aria-label="zoom"
                className="gap-1 px-3"
              >
                <Search className="w-4 h-4" />
                {zoom * 100}%
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-14">
              <DropdownMenuItem
                onSelect={() => {
                  setZoom(1.5);
                }}
              >
                150%
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  setZoom(1.25);
                }}
              >
                125%
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  setZoom(1);
                }}
              >
                100%
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  setZoom(0.75);
                }}
              >
                75%
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant={"ghost"}
            className="p-2"
            aria-label="rotate 90 degress"
            onClick={() => {
              setRotate((prev) => prev + 90);
            }}
          >
            <RotateCw className="w-4 h-4" />
          </Button>

          <DocFullPage url={url} />
        </div>
      </div>

      <div className="flex-1 max-h-screen w-full">
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
              {isLoading && renderedScale ? (
                <Page
                  pageNumber={currentPage}
                  width={width ?? 1}
                  height={height ?? 1}
                  scale={zoom}
                  rotate={rotate}
                  key={"#" + renderedScale}
                />
              ) : null}

              <Page
                className={cn(isLoading ? "hidden" : "")}
                pageNumber={currentPage}
                width={width ?? 1}
                key={"#" + zoom}
                height={height ?? 1}
                scale={zoom}
                rotate={rotate}
                loading={
                  <div className="flex flex-col gap-4 justify-center items-center">
                    <Loader2 className="w-14 h-14 animate-spin" />
                    Loading PDF...
                  </div>
                }
                onRenderSuccess={() => setRenderedScale(zoom)}
              />
            </Document>
          </div>
        </SimpleBar>
      </div>
    </div>
  );
};

export default PdfRenderer;
