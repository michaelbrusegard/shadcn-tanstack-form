"use client"

import { cn } from "@/lib/utils"
import { Slot } from "@radix-ui/react-slot"
import { createFormHook, createFormHookContexts } from "@tanstack/react-form"
import { type VariantProps } from "class-variance-authority"
import { XIcon } from "lucide-react"
import * as React from "react"
import { Fragment, useId, useState } from "react"

import { Button, type buttonVariants } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { InputPassword } from "@/components/ui/input-password"
import { InputPhone } from "@/components/ui/input-phone"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"

const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts()

type BaseFieldProps = {
  className?: string
  label: string
  labelVisible?: boolean
  description?: string
  labelSibling?: React.ReactNode
  fieldSuffix?: React.ReactNode
  children: React.ReactNode
}

function BaseField({
  className,
  label,
  labelVisible = true,
  labelSibling,
  fieldSuffix,
  description,
  children,
}: BaseFieldProps) {
  const field = useFieldContext()
  const id = useId()

  const labelElement =
    label && label.length > 0 && labelVisible ? (
      <Label
        className={cn(
          "mb-2 block",
          field.state.meta.errors.length > 0 && "text-destructive",
          !labelVisible && "sr-only",
        )}
        htmlFor={`${id}-form-item`}
      >
        {label}
      </Label>
    ) : null

  return (
    <div className={cn("relative space-y-2", className)}>
      {labelSibling ? (
        <div className="flex items-center justify-between">
          {labelElement}
          {labelSibling}
        </div>
      ) : (
        labelElement
      )}
      {description && (
        <p
          id={`${id}-form-item-description`}
          className={cn("text-muted-foreground text-sm", className)}
        >
          {description}
        </p>
      )}
      {fieldSuffix ? (
        <div className="flex items-center">
          <Slot
            id={`${id}-form-item`}
            aria-describedby={
              !(field.state.meta.errors.length > 0)
                ? `${id}-form-item-description`
                : `${id}-form-item-description ${id}-form-item-message`
            }
            aria-invalid={!!(field.state.meta.errors.length > 0)}
          >
            {children}
          </Slot>
          {fieldSuffix}
        </div>
      ) : (
        <Slot
          id={`${id}-form-item`}
          aria-describedby={
            !(field.state.meta.errors.length > 0)
              ? `${id}-form-item-description`
              : `${id}-form-item-description ${id}-form-item-message`
          }
          aria-invalid={!!(field.state.meta.errors.length > 0)}
        >
          {children}
        </Slot>
      )}
      <p
        id={`${id}-form-item-message`}
        className={cn(
          "text-destructive absolute -translate-y-2 text-[0.8rem] font-medium",
          className,
        )}
      >
        {field.state.meta.errors.length > 0 &&
          (field.state.meta.errors[0] as { message: string }).message}
      </p>
    </div>
  )
}

type TextFieldProps = Omit<
  React.ComponentProps<typeof Input>,
  "type" | "value" | "onChange" | "onBlur"
> & {
  label: string
  labelVisible?: boolean
  labelSibling?: React.ReactNode
  fieldSuffix?: React.ReactNode
  description?: string
}

function TextField({
  className,
  label,
  labelVisible,
  labelSibling,
  fieldSuffix,
  description,
  ...props
}: TextFieldProps) {
  const field = useFieldContext<string>()

  return (
    <BaseField
      label={label}
      labelVisible={labelVisible}
      labelSibling={labelSibling}
      fieldSuffix={fieldSuffix}
      className={className}
      description={description}
    >
      <Input
        type="text"
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        {...props}
      />
    </BaseField>
  )
}

type NumberFieldProps = Omit<
  React.ComponentProps<typeof Input>,
  "type" | "value" | "onChange" | "onBlur"
> & {
  label: string
  labelVisible?: boolean
  labelSibling?: React.ReactNode
  fieldSuffix?: React.ReactNode
  description?: string
  maxDecimals?: number
}

function NumberField({
  className,
  label,
  labelVisible,
  labelSibling,
  fieldSuffix,
  description,
  maxDecimals,
  ...props
}: NumberFieldProps) {
  const field = useFieldContext<number>()
  const [draftValue, setDraftValue] = useState<string | null>(null)

  const formValue = field.state.value
  const canonicalValue =
    formValue === null || formValue === undefined || isNaN(formValue)
      ? ""
      : String(formValue)

  const displayValue = draftValue ?? canonicalValue

  function handleChange(value: string) {
    let currentDisplayValue = value

    if (currentDisplayValue === "" || currentDisplayValue === "-") {
      setDraftValue(currentDisplayValue)
      field.handleChange(NaN)
      return
    }

    currentDisplayValue = currentDisplayValue.replace(",", ".")
    if (
      (currentDisplayValue.match(/\./g) ?? []).length > 1 ||
      currentDisplayValue.lastIndexOf("-") > 0 ||
      /[^0-9.-]/.test(currentDisplayValue)
    ) {
      return
    }

    if (maxDecimals !== undefined) {
      const parts = currentDisplayValue.split(".")
      if (parts[1] && parts[1].length > maxDecimals) {
        parts[1] = parts[1].substring(0, maxDecimals)
        currentDisplayValue = parts.join(".")
      }
    }

    setDraftValue(currentDisplayValue)

    if (currentDisplayValue.endsWith(".")) {
      const num = Number.parseFloat(currentDisplayValue.slice(0, -1))
      field.handleChange(isNaN(num) ? NaN : num)
    } else {
      const num = Number.parseFloat(currentDisplayValue)
      field.handleChange(isNaN(num) ? NaN : num)
    }
  }

  function handleBlur() {
    const num = Number.parseFloat(draftValue ?? "")
    if (!isNaN(num)) {
      field.handleChange(num)
    } else {
      field.handleChange(NaN)
    }
    field.handleBlur()
    setDraftValue(null)
  }

  return (
    <BaseField
      label={label}
      labelVisible={labelVisible}
      labelSibling={labelSibling}
      fieldSuffix={fieldSuffix}
      className={className}
      description={description}
    >
      <Input
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={handleBlur}
        {...props}
      />
    </BaseField>
  )
}

type TextAreaFieldProps = Omit<
  React.ComponentProps<typeof Textarea>,
  "value" | "onChange" | "onBlur"
> & {
  label: string
  labelVisible?: boolean
  labelSibling?: React.ReactNode
  fieldSuffix?: React.ReactNode
  description?: string
}

function TextAreaField({
  className,
  label,
  labelVisible,
  labelSibling,
  fieldSuffix,
  description,
  ...props
}: TextAreaFieldProps) {
  const field = useFieldContext<string>()

  return (
    <BaseField
      label={label}
      labelVisible={labelVisible}
      labelSibling={labelSibling}
      fieldSuffix={fieldSuffix}
      className={className}
      description={description}
    >
      <Textarea
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        {...props}
      />
    </BaseField>
  )
}

type SelectOption = {
  label: string
  value: string
}

type SelectFieldProps = {
  label: string
  labelVisible?: boolean
  className?: string
  placeholder?: string
  options: SelectOption[]
  required?: boolean
  labelSibling?: React.ReactNode
  fieldSuffix?: React.ReactNode
  description?: string
}

function SelectField({
  label,
  labelVisible,
  className,
  placeholder = "Select an option",
  options,
  required = true,
  labelSibling,
  fieldSuffix,
  description,
}: SelectFieldProps) {
  const field = useFieldContext<string>()

  return (
    <BaseField
      label={label}
      labelVisible={labelVisible}
      labelSibling={labelSibling}
      fieldSuffix={fieldSuffix}
      className={className}
      description={description}
    >
      <div className="flex gap-2">
        <Select
          value={field.state.value ?? undefined}
          onValueChange={field.handleChange}
          required={required}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {!required && field.state.value && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => field.handleChange("")}
          >
            <XIcon className="h-4 w-4" />
          </Button>
        )}
      </div>
    </BaseField>
  )
}

type RadioOption = {
  label: string
  value: string
}

type RadioGroupFieldProps = {
  label: string
  labelVisible?: boolean
  className?: string
  options: RadioOption[]
  labelSibling?: React.ReactNode
  fieldSuffix?: React.ReactNode
  description?: string
}

function RadioGroupField({
  label,
  labelVisible,
  className,
  options,
  labelSibling,
  fieldSuffix,
  description,
}: RadioGroupFieldProps) {
  const field = useFieldContext<string>()

  return (
    <BaseField
      label={label}
      labelVisible={labelVisible}
      labelSibling={labelSibling}
      fieldSuffix={fieldSuffix}
      className={className}
      description={description}
    >
      <RadioGroup
        onValueChange={field.handleChange}
        defaultValue={field.state.value}
        className="mt-4 flex flex-col space-y-2"
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem value={option.value} id={option.value} />
            <Label
              className={cn(
                "block",
                field.state.meta.errors.length > 0 && "text-destructive",
              )}
              htmlFor={option.value}
            >
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </BaseField>
  )
}

type CheckboxFieldProps = Omit<
  React.ComponentProps<typeof Checkbox>,
  "checked" | "onCheckedChange" | "onBlur"
> & {
  label: string
  labelVisible?: boolean
  labelSibling?: React.ReactNode
  fieldSuffix?: React.ReactNode
  description?: string
}

function CheckboxField({
  className,
  label,
  labelVisible = true,
  description,
  ...props
}: CheckboxFieldProps) {
  const field = useFieldContext<boolean>()
  const id = useId()

  return (
    <div className={cn("relative space-y-2", className)}>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${id}-form-item`}
          checked={field.state.value}
          onCheckedChange={() => field.handleChange(!field.state.value)}
          onBlur={field.handleBlur}
          aria-describedby={
            !(field.state.meta.errors.length > 0)
              ? `${id}-form-item-description`
              : `${id}-form-item-description ${id}-form-item-message`
          }
          aria-invalid={!!(field.state.meta.errors.length > 0)}
          className="cursor-pointer"
          {...props}
        />
        {label && labelVisible && (
          <Label
            className={cn(
              "block",
              field.state.meta.errors.length > 0 && "text-destructive",
              !labelVisible && "sr-only",
            )}
            htmlFor={`${id}-form-item`}
          >
            {label}
          </Label>
        )}
      </div>
      {description && (
        <p
          id={`${id}-form-item-description`}
          className={cn("text-muted-foreground text-sm", className)}
        >
          {description}
        </p>
      )}
      <p
        id={`${id}-form-item-message`}
        className={cn(
          "text-destructive absolute -translate-y-2 text-[0.8rem] font-medium",
          className,
        )}
      >
        {field.state.meta.errors.length > 0 &&
          (field.state.meta.errors[0] as { message: string }).message}
      </p>
    </div>
  )
}

type PhoneFieldProps = Omit<
  React.ComponentProps<typeof InputPhone>,
  "value" | "onChange" | "onBlur"
> & {
  label: string
  labelVisible?: boolean
  labelSibling?: React.ReactNode
  fieldSuffix?: React.ReactNode
  description?: string
}

function PhoneField({
  className,
  label,
  labelVisible,
  fieldSuffix,
  labelSibling,
  description,
  ...props
}: PhoneFieldProps) {
  const field = useFieldContext<string>()

  return (
    <BaseField
      label={label}
      labelVisible={labelVisible}
      fieldSuffix={fieldSuffix}
      labelSibling={labelSibling}
      className={className}
      description={description}
    >
      <InputPhone
        value={field.state.value}
        onChange={(value) => field.handleChange(value)}
        onBlur={field.handleBlur}
        {...props}
      />
    </BaseField>
  )
}

type OTPFieldProps = Omit<
  React.ComponentPropsWithoutRef<typeof InputOTP>,
  "value" | "onChange" | "onBlur" | "maxLength" | "render"
> & {
  label: string
  labelVisible?: boolean
  labelSibling?: React.ReactNode
  fieldSuffix?: React.ReactNode
  slots?: number
  groups?: number[]
  description?: string
}

function OTPField({
  className,
  label,
  labelVisible,
  labelSibling,
  fieldSuffix,
  slots = 6,
  groups = [],
  description,
  ...props
}: OTPFieldProps) {
  const field = useFieldContext<string>()

  const renderSlots = () => {
    if (groups.length === 0) {
      return (
        <InputOTPGroup>
          {Array.from({ length: slots }).map((_, index) => (
            <InputOTPSlot key={`slot-${field.name}-${index}`} index={index} />
          ))}
        </InputOTPGroup>
      )
    }

    return groups.map((groupSize, groupIndex) => (
      <Fragment key={`group-${field.name}-${groupIndex}`}>
        {groupIndex > 0 && <InputOTPSeparator />}
        <InputOTPGroup>
          {Array.from({ length: groupSize }).map((_, slotIndex) => {
            const globalIndex =
              groups.slice(0, groupIndex).reduce((sum, size) => sum + size, 0) +
              slotIndex
            return (
              <InputOTPSlot
                key={`slot-${field.name}-${globalIndex}`}
                index={globalIndex}
              />
            )
          })}
        </InputOTPGroup>
      </Fragment>
    ))
  }

  return (
    <BaseField
      label={label}
      labelVisible={labelVisible}
      labelSibling={labelSibling}
      fieldSuffix={fieldSuffix}
      className={className}
      description={description}
    >
      <InputOTP
        value={field.state.value}
        onChange={(value) => field.handleChange(value)}
        onBlur={field.handleBlur}
        maxLength={slots}
        {...props}
      >
        {renderSlots()}
      </InputOTP>
    </BaseField>
  )
}

type PasswordFieldProps = Omit<
  React.ComponentProps<typeof InputPassword>,
  "value" | "onChange" | "onBlur"
> & {
  label: string
  labelVisible?: boolean
  labelSibling?: React.ReactNode
  fieldSuffix?: React.ReactNode
  description?: string
}

function PasswordField({
  className,
  label,
  labelVisible,
  labelSibling,
  fieldSuffix,
  description,
  ...props
}: PasswordFieldProps) {
  const field = useFieldContext<string>()

  return (
    <BaseField
      label={label}
      labelVisible={labelVisible}
      labelSibling={labelSibling}
      fieldSuffix={fieldSuffix}
      className={className}
      description={description}
    >
      <InputPassword
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        {...props}
      />
    </BaseField>
  )
}

type SubmitButtonProps = Omit<React.ComponentProps<typeof Button>, "type"> &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean
  }

function SubmitButton({
  children,
  className,
  loading,
  ...props
}: SubmitButtonProps) {
  const form = useFormContext()
  return (
    <form.Subscribe
      selector={(state) => [
        state.isSubmitting,
        state.isPristine,
        state.isValidating,
      ]}
    >
      {([isSubmitting, isPristine, isValidating]) => (
        <Button
          className={cn("min-w-28", className)}
          type="submit"
          disabled={isSubmitting ?? isPristine ?? isValidating ?? loading}
          {...props}
        >
          {isSubmitting || isValidating || loading ? (
            <Spinner size="sm" className="text-primary-foreground" />
          ) : (
            children
          )}
        </Button>
      )}
    </form.Subscribe>
  )
}

const { useAppForm } = createFormHook({
  fieldComponents: {
    BaseField,
    TextField,
    NumberField,
    TextAreaField,
    SelectField,
    RadioGroupField,
    CheckboxField,
    PhoneField,
    PasswordField,
    // DateField,
    OTPField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
})

export { useAppForm }
