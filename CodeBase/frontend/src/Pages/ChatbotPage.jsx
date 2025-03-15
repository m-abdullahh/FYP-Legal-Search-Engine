import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GavelIcon, SendIcon, UserIcon, HistoryIcon, LogOutIcon, MessageSquareIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import Navbar from "@/customcomponents/Navbar";

export default function ChatbotPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [chatStarted, setChatStarted] = useState(false);

  const toggleLogin = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  const startChat = () => {
    setChatStarted(true);
  };

  return (
    <>
      <main className="flex-1 overflow-hidden">
        {!chatStarted ? (
          <div className="flex flex-col items-center justify-center h-full">
            <MessageSquareIcon className="w-16 h-16 mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-2">Welcome to Legal Cases Chatbot</h2>
            <p className="text-center text-muted-foreground mb-4">Get instant answers to your legal case questions</p>
            <Button onClick={startChat}>Start a New Chat</Button>
          </div>
        ) : (
          <ScrollArea className="h-full p-4">
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <Avatar>
                  <AvatarFallback>
                    <GavelIcon className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-sm">Welcome to the Legal Cases Chatbot. How can I assist you today?</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 justify-end">
                <div className="bg-primary text-primary-foreground p-3 rounded-lg">
                  <p className="text-sm">I have a question about a personal injury case. What's the statute of limitations in California?</p>
                </div>
                <Avatar>
                  <AvatarFallback>
                    <UserIcon className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex items-start space-x-4">
                <Avatar>
                  <AvatarFallback>
                    <GavelIcon className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-sm">
                    In California, the statute of limitations for most personal injury cases is two years from the date of the injury. However, there
                    are exceptions: 1. If the injury was not discovered right away, the deadline may be extended to one year from the date the injury
                    was discovered. 2. For medical malpractice cases, it's three years from the date of injury or one year from the date the injury
                    was discovered, whichever comes first. 3. Claims against government entities have a much shorter deadline, typically six months
                    from the date of injury. It's important to consult with a lawyer as soon as possible to ensure you don't miss any deadlines.
                  </p>
                </div>
              </div>
            </div>
          </ScrollArea>
        )}
      </main>
      <footer className="p-4 border-t">
        <form className="flex items-center space-x-2">
          <Input className="flex-1" placeholder="Type your legal question here..." />
          <Button type="submit" size="icon">
            <SendIcon className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </footer>
    </>
  );
}
