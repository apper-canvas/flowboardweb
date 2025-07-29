import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Checkbox = forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      type="checkbox"
      ref={ref}
      className={cn("custom-checkbox", className)}
      {...props}
    />
  );
});

Checkbox.displayName = "Checkbox";

export default Checkbox;