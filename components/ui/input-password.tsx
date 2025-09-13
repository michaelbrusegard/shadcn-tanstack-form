"use client"

import { cn } from "@/lib/utils"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import * as React from "react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function InputPassword({ className, ...props }: React.ComponentProps<"input">) {
  const [showPassword, setShowPassword] = useState(false)
  const disabled =
    props.value === "" || props.value === undefined || props.disabled

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        className={cn("pr-10", className)}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
        onClick={() => setShowPassword((prev) => !prev)}
        disabled={disabled}
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword && !disabled ? (
          <EyeIcon className="h-4 w-4" aria-hidden="true" />
        ) : (
          <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
        )}
      </Button>
    </div>
  )
}

export { InputPassword }
