import React from "react";
import { Spinner } from "@/components/ui/spinner";

const Loading = () => {
  return (
    <div className="flex h-full w-full min-h-[50vh] items-center justify-center p-6">
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
