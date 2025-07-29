import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "default", 
  children, 
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
    danger: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-sm hover:shadow-md hover:scale-[1.02]",
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    default: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3 text-base",
  };

  return (
    <button
      ref={ref}
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;