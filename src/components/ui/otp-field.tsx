"use client"

import { OTPField as OTPFieldPrimitive } from "@base-ui/react/otp-field"

import { cn } from "@/lib/utils"

function OTPFieldRoot({ className, ...props }: OTPFieldPrimitive.Root.Props) {
  return (
    <OTPFieldPrimitive.Root
      data-slot="otp-field"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  )
}

function OTPFieldInput({ className, ...props }: OTPFieldPrimitive.Input.Props) {
  return (
    <OTPFieldPrimitive.Input
      data-slot="otp-field-input"
      className={cn(
        "flex h-11 w-10 items-center justify-center rounded-lg border border-input bg-transparent text-center text-lg font-medium shadow-xs transition-[color,box-shadow] outline-none dark:bg-input/30",
        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        "data-[filled]:border-ring/60",
        className,
      )}
      {...props}
    />
  )
}

export { OTPFieldRoot as OTPField, OTPFieldInput }
