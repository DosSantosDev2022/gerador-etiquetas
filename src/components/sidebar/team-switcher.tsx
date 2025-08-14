import {  File,  } from "lucide-react"

export function TeamSwitcher() {

 
  return (
   <div className="flex items-center gap-3.5">
        <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
          <File className="size-4" />
        </div>
        <div className="grid flex-1 text-left leading-tight">
          <span className="truncate font-bold text-lg">Ferramentas</span>
          <span className="truncate text-sm font-medium">TJSP</span>
        </div>
      </div>
  )
}
