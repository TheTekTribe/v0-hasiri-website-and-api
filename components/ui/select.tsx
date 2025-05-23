"use client"

import * as React from "react"
import { Check, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"

const Select = React.forwardRef<
  React.ElementRef<typeof Popover>,
  React.ComponentPropsWithoutRef<typeof Popover> & {
    value?: string
    onValueChange?: (value: string) => void
    placeholder?: string
    disabled?: boolean
  }
>(({ className, value, onValueChange, placeholder, disabled, children, ...props }, ref) => {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen} {...props}>
      <PopoverTrigger asChild>
        <Button
          ref={ref}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", value ? "text-foreground" : "text-muted-foreground", className)}
          disabled={disabled}
          onClick={() => setOpen(!open)}
        >
          {value
            ? React.Children.toArray(children).find(
                (child) => React.isValidElement(child) && child.props.value === value,
              ) || placeholder
            : placeholder || "Select..."}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No item found.</CommandEmpty>
            <CommandGroup>
              {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                  return React.cloneElement(child, {
                    onSelect: (currentValue: string) => {
                      onValueChange?.(currentValue)
                      setOpen(false)
                    },
                  })
                }
                return child
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
})
Select.displayName = "Select"

const SelectTrigger = React.forwardRef<React.ElementRef<typeof Button>, React.ComponentPropsWithoutRef<typeof Button>>(
  ({ className, children, ...props }, ref) => (
    <Button variant="outline" className={cn("w-full justify-between", className)} ref={ref} {...props}>
      {children}
      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  ),
)
SelectTrigger.displayName = "SelectTrigger"

const SelectContent = React.forwardRef<
  React.ElementRef<typeof PopoverContent>,
  React.ComponentPropsWithoutRef<typeof PopoverContent>
>(({ className, children, ...props }, ref) => (
  <PopoverContent className={cn("w-full p-0", className)} align="start" {...props} ref={ref}>
    <Command>
      <CommandInput placeholder="Search..." />
      <CommandList>
        <CommandEmpty>No item found.</CommandEmpty>
        <CommandGroup>{children}</CommandGroup>
      </CommandList>
    </Command>
  </PopoverContent>
))
SelectContent.displayName = "SelectContent"

const SelectItem = React.forwardRef<
  React.ElementRef<typeof CommandItem>,
  React.ComponentPropsWithoutRef<typeof CommandItem> & { value: string }
>(({ className, children, value, ...props }, ref) => (
  <CommandItem
    ref={ref}
    value={value}
    className={cn("text-sm cursor-pointer", className)}
    onSelect={(currentValue) => props.onSelect?.(currentValue)}
    {...props}
  >
    {children}
    <Check className="ml-auto h-4 w-4" />
  </CommandItem>
))
SelectItem.displayName = "SelectItem"

const SelectValue = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, children, ...props }, ref) => (
    <span className={cn("line-clamp-1", className)} {...props} ref={ref}>
      {children}
    </span>
  ),
)
SelectValue.displayName = "SelectValue"

const SelectSeparator = Separator

const SelectGroup = React.forwardRef<
  React.ElementRef<typeof CommandGroup>,
  React.ComponentPropsWithoutRef<typeof CommandGroup>
>(({ className, children, ...props }, ref) => (
  <CommandGroup className={cn("p-1", className)} {...props} ref={ref}>
    {children}
  </CommandGroup>
))
SelectGroup.displayName = "SelectGroup"

export const DropdownMenuGroup = SelectGroup

export {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectSeparator,
  SelectGroup as SelectGroupDeprecated,
}
