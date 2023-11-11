import { toastDuration } from "@/utils/constants";
import toast from "react-hot-toast";

const useToast = () => {
  const successToast = (message: string) => {
    toast.success(message, {
      style: {
        border: "1px solid green",
        padding: "14px",
        color: "white",
        background: "green",
        borderRadius: "5px",
      },
      iconTheme: {
        primary: "white",
        secondary: "green",
      },
      duration: toastDuration,
    });
  };

  const errorToast = (error: any) => {
    toast.error(error, {
      style: {
        border: "1px solid red",
        padding: "14px",
        color: "white",
        background: "red",
        borderRadius: "5px",
      },
      iconTheme: {
        primary: "white",
        secondary: "red",
      },
      duration: toastDuration,
    });
  };

  return { successToast, errorToast };
};

export default useToast;
