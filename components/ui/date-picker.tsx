"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CustomCalendar } from "@/components/ui/custom-calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {useEffect} from "react";

export function DatePicker({value, onChange}: {value: Date | null, onChange: any}) {
  const [date, setDate] = React.useState<Date>()

    useEffect(() => {
        if(value){
            setDate(value);
        }
    }, [value]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
          <CustomCalendar
              mode="single"
              captionLayout="dropdown-buttons"
              selected={date}
              onSelect={onChange}
              fromYear={1960}
              toYear={2030}
          />
      </PopoverContent>
    </Popover>
  )
}
