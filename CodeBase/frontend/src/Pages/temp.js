<Sheet>
  <SheetTrigger asChild>
    <Button variant="ghost" size="icon" className="rounded-full">
      <Avatar>
        <AvatarImage src="/placeholder-user.jpg" alt="User" />
        <AvatarFallback>
          <UserIcon className="w-4 h-4" />
        </AvatarFallback>
      </Avatar>
    </Button>
  </SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Profile</SheetTitle>
    </SheetHeader>
    <div className="py-4">
      <div className="flex items-center space-x-4">
        <Avatar className="w-16 h-16">
          <AvatarImage src="/placeholder-user.jpg" alt="User" />
          <AvatarFallback>
            <UserIcon className="w-8 h-8" />
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-bold">Jane Doe</h2>
          <p className="text-sm text-muted-foreground">jane.doe@example.com</p>
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Chat History</h3>
        <ScrollArea className="h-[200px]">
          <ul className="space-y-2">
            <li className="flex items-center space-x-2 text-sm">
              <HistoryIcon className="w-4 h-4" />
              <span>Personal Injury Case - 2 days ago</span>
            </li>
            <li className="flex items-center space-x-2 text-sm">
              <HistoryIcon className="w-4 h-4" />
              <span>Property Dispute - 1 week ago</span>
            </li>
            <li className="flex items-center space-x-2 text-sm">
              <HistoryIcon className="w-4 h-4" />
              <span>Employment Law - 2 weeks ago</span>
            </li>
          </ul>
        </ScrollArea>
      </div>
      <div className="mt-6">
        <Button variant="outline" className="w-full" onClick={toggleLogin}>
          {isLoggedIn ? (
            <>
              <LogOutIcon className="w-4 h-4 mr-2" />
              Logout
            </>
          ) : (
            <>
              <UserIcon className="w-4 h-4 mr-2" />
              Login
            </>
          )}
        </Button>
      </div>
    </div>
  </SheetContent>
</Sheet>;
