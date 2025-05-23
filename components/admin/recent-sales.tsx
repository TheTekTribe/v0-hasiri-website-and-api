import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RecentSales() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder.svg?height=36&width=36&text=RK" alt="Avatar" />
          <AvatarFallback>RK</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Rajesh Kumar</p>
          <p className="text-sm text-muted-foreground">rajesh@example.com</p>
        </div>
        <div className="ml-auto font-medium">+₹1,999.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder.svg?height=36&width=36&text=AP" alt="Avatar" />
          <AvatarFallback>AP</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Anita Patel</p>
          <p className="text-sm text-muted-foreground">anita@example.com</p>
        </div>
        <div className="ml-auto font-medium">+₹3,499.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder.svg?height=36&width=36&text=SR" alt="Avatar" />
          <AvatarFallback>SR</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Suresh Reddy</p>
          <p className="text-sm text-muted-foreground">suresh@example.com</p>
        </div>
        <div className="ml-auto font-medium">+₹2,699.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder.svg?height=36&width=36&text=MK" alt="Avatar" />
          <AvatarFallback>MK</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Meena Kumari</p>
          <p className="text-sm text-muted-foreground">meena@example.com</p>
        </div>
        <div className="ml-auto font-medium">+₹899.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder.svg?height=36&width=36&text=VS" alt="Avatar" />
          <AvatarFallback>VS</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Vikram Singh</p>
          <p className="text-sm text-muted-foreground">vikram@example.com</p>
        </div>
        <div className="ml-auto font-medium">+₹4,999.00</div>
      </div>
    </div>
  )
}
