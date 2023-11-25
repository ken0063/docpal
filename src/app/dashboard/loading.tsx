import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="h-screen w-full flex flex-col justify-center items-center">
      <Loader2 className="w-20 h-20 animate-spin" />
      Loading...
    </div>
  );
};

export default Loading;
