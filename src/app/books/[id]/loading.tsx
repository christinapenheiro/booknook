import { Spinner } from "@/components/ui/spinner";

const Loading = () => {
  return (
    <div className="flex w-full flex-1 items-center justify-center p-6">
      <div className="flex items-center gap-3">
        <Spinner className="h-5 w-5 animate-spin text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">
          Loading...
        </span>
      </div>
    </div>
  );
};

export default Loading;
