import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "placeholder:text-neutral-500 border-neutral-300 h-9 w-full min-w-0 rounded-md border bg-white px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus:border-neutral-500 focus-visible:ring-neutral-300 focus-visible:ring-[3px]",
        className
      )}
      {...props}
    />
  );
}

export { Input };
