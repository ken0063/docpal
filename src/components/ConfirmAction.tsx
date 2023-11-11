import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Dispatch, FC, ReactNode, SetStateAction } from "react";

type Props = {
  action: ReactNode;
  trigger: ReactNode;
  message: ReactNode | string;
  title: string;
  disabled: boolean;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

const ConfirmAction: FC<Props> = ({
  action,
  trigger,
  message,
  title,
  disabled,
  isOpen,
  setIsOpen,
}) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(visible) => {
        if (!visible) {
          setIsOpen(visible);
        }
      }}
    >
      <DialogTrigger
        asChild
        disabled={disabled}
        onClick={() => setIsOpen(true)}
      >
        {trigger}
      </DialogTrigger>
      <DialogContent className="w-fit">
        <DialogHeader>
          <DialogTitle className="text-center w-full">{title}</DialogTitle>
        </DialogHeader>

        <p className="text-center text-base text-zinc-900 py-2">{message}</p>
        <DialogFooter className="w-full">{action}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmAction;
