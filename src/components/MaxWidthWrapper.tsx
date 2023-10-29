import { cn } from "@/lib/utils";
import { FC, ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

const MaxWidthWrapper: FC<Props> = ({ className, children }) => {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-screen-2xl px-2.5 md:px-20",
        className
      )}
    >
      {children}
    </div>
  );
};
export default MaxWidthWrapper;
