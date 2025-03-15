import React, { useState, useRef, useEffect } from "react";
import { X, MessageCircle, Send } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BotMessageSquare } from "lucide-react";

export default function ChatBotComp() {
  const [isOpen, setIsOpen] = useState(false);

  const formatChatbotResponse = (response) => {
    let responseArray = response.split("**");
    let formattedResponse = "";

    for (let i = 0; i < responseArray.length; i++) {
      if (i % 2 === 1) {
        formattedResponse += "<b>" + responseArray[i] + "</b>";
      } else {
        formattedResponse += responseArray[i];
      }
    }

    return formattedResponse.split("*").join("<br>");
  };

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ChatBot",
      content: formatChatbotResponse(
        `Hi! You can ask for cases or ordinance from me like given below, Click them to try.`
      ),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  const messagesEndRef = useRef(null);
  const formRef = useRef(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", inline: "start" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageText) => {
    const syntheticEvent = {
      preventDefault: () => {},
      target: {
        elements: {
          message: { value: '' }
        }
      }
    };

    if (messageText) {
      const userMessage = {
        id: messages.length + 1,
        sender: "You",
        content: messageText,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages([...messages, userMessage]);

      setIsThinking(true);
      const thinkingMessage = {
        id: messages.length + 2,
        sender: "ChatBot",
        content: "...",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prevMessages) => [...prevMessages, thinkingMessage]);

      setLoading(true);

      try {
        const response = await fetch(`https://fyp-frontend-backend.onrender.com/search/chatbot/?text=${encodeURIComponent(messageText)}`, {
            method: "GET",
        });
    
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        if (data.result) {
          const formattedResponse = formatChatbotResponse(data.result);

          const botMessage = {
            id: messages.length + 3,
            sender: "ChatBot",
            content: formattedResponse,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          };
          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages];
            updatedMessages[updatedMessages.length - 1] = botMessage;
            return updatedMessages;
          });
        } else {
          throw new Error("No result in response");
        }
      } catch (error) {
        console.error("Error sending message to chatbot API:", error);
        
        const errorMessage = {
          id: messages.length + 3,
          sender: "ChatBot",
          content: "Sorry, Something went wrong",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          updatedMessages[updatedMessages.length - 1] = errorMessage;
          return updatedMessages;
        });
      } finally {
        setIsThinking(false);
        setLoading(false);
      }
    }
  };

  const renderPredefinedOptions = () => {
    const options = [
      "Give me details of Section 12",
      "Search case related to food"
    ];

    return options.map((option, index) => (
      <div className={`flex flex-col mb-4 items-end select-text`}>
                
      <div 
        key={index} 
        onClick={() => handleSendMessage(option)}
        className="cursor-pointer hover:bg-blue-600 rounded-lg p-2 my-1 text-sm select-text bg-gray-700 hover:text-gray-100 text-gray-200"
        >
        {option}
      </div>
        </div>
    ));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const messageInput = e.target.elements.message;
    const messageText = messageInput.value.trim();
    
    if (messageText) {
      handleSendMessage(messageText);
      messageInput.value = '';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-lg w-[500px] h-screen max-h-[90vh] min-h-[600px] flex flex-col">
          <div className="flex justify-between items-center p-4 border-b border-gray-700 bg-gray-800">
            <div className="flex items-center space-x-2">
              <Avatar className="flex justify-center items-center h-8 w-8 bg-gray-700">
                <BotMessageSquare color="#3b82f6" />
              </Avatar>
              <div>
                <h3 className="font-semibold text-sm text-gray-100">Legal Bot</h3>
                <p className="text-xs text-gray-400">Online</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={toggleChat} className="text-gray-400 hover:text-gray-100 hover:bg-gray-700">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <ScrollArea className="flex-grow p-4 overflow-y-auto bg-gray-900">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex flex-col mb-4 ${message.sender === "You" ? "items-end" : "items-start"} select-text`}
              >
                <div 
                  className={`
                    rounded-lg p-2 max-w-[95%] 
                    ${message.sender === "You" ? "bg-blue-600 text-gray-100" : "bg-gray-800 text-gray-100"}
                  `}
                >
                  <p 
                    className="text-sm" 
                    dangerouslySetInnerHTML={{ __html: message.content }}
                  ></p>
                </div>
                <span className="text-xs text-gray-500 mt-1">{message.time}</span>
              </div>
            ))}
            {messages.length === 1 && (
              <div className="mt-4">
                {renderPredefinedOptions()}
              </div>
            )}
            <div ref={messagesEndRef} />
          </ScrollArea>
          <form onSubmit={handleSubmit} ref={formRef} className="border-t border-gray-700 p-4 flex items-center bg-gray-800">
            <Input 
              type="text" 
              placeholder="Type a message..." 
              name="message" 
              className="flex-grow mr-2 bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-blue-500" 
              disabled={loading || isThinking} 
            />
            <Button
              type="submit"
              size="icon"
              className="shrink-0 text-gray-100 bg-blue-600 hover:bg-blue-700 transition hover:duration-200"
              disabled={loading || isThinking}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      ) : (
        <Button onClick={toggleChat} className="rounded-full h-12 w-12 bg-blue-600 text-gray-100 hover:bg-blue-700">
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}

// import React, { useState, useRef, useEffect } from "react";
// import { X, MessageCircle, Send } from "lucide-react";
// import { Avatar } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { BotMessageSquare } from "lucide-react";

// export default function ChatBotComp() {
//   const [isOpen, setIsOpen] = useState(false);

//   const formatChatbotResponse = (response) => {
//     let responseArray = response.split("**");
//     let formattedResponse = "";

//     for (let i = 0; i < responseArray.length; i++) {
//       if (i % 2 === 1) {
//         formattedResponse += "<b>" + responseArray[i] + "</b>";
//       } else {
//         formattedResponse += responseArray[i];
//       }
//     }

//     return formattedResponse.split("*").join("<br>");
//   };

//   const [messages, setMessages] = useState([
//     {
//       id: 1,
//       sender: "ChatBot",
//       content: formatChatbotResponse(
//         `Hi! You can ask for cases or ordinance from me like given below, Click them to try.`
//       ),
//       time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//     },
//   ]);

//   const [loading, setLoading] = useState(false);
//   const [isThinking, setIsThinking] = useState(false);

//   const messagesEndRef = useRef(null);
//   const formRef = useRef(null);

//   const toggleChat = () => setIsOpen(!isOpen);

//   const scrollToBottom = () => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: "smooth", inline: "start" });
//     }
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const handleSendMessage = async (messageText) => {
//     const syntheticEvent = {
//       preventDefault: () => {},
//       target: {
//         elements: {
//           message: { value: '' }
//         }
//       }
//     };

//     if (messageText) {
//       const userMessage = {
//         id: messages.length + 1,
//         sender: "You",
//         content: messageText,
//         time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//       };
//       setMessages([...messages, userMessage]);

//       setIsThinking(true);
//       const thinkingMessage = {
//         id: messages.length + 2,
//         sender: "ChatBot",
//         content: "...",
//         time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//       };
//       setMessages((prevMessages) => [...prevMessages, thinkingMessage]);

//       setLoading(true);

//       try {
//         const response = await fetch(`https://fyp-frontend-backend.onrender.com/search/chatbot/?text=${encodeURIComponent(messageText)}`, {
//             method: "GET",
//         });
    
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }

//         const data = await response.json();

//         if (data.result) {
//           const formattedResponse = formatChatbotResponse(data.result);

//           const botMessage = {
//             id: messages.length + 3,
//             sender: "ChatBot",
//             content: formattedResponse,
//             time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//           };
//           setMessages((prevMessages) => {
//             const updatedMessages = [...prevMessages];
//             updatedMessages[updatedMessages.length - 1] = botMessage;
//             return updatedMessages;
//           });
//         } else {
//           throw new Error("No result in response");
//         }
//       } catch (error) {
//         console.error("Error sending message to chatbot API:", error);
        
//         const errorMessage = {
//           id: messages.length + 3,
//           sender: "ChatBot",
//           content: "Sorry, Something went wrong",
//           time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//         };
//         setMessages((prevMessages) => {
//           const updatedMessages = [...prevMessages];
//           updatedMessages[updatedMessages.length - 1] = errorMessage;
//           return updatedMessages;
//         });
//       } finally {
//         setIsThinking(false);
//         setLoading(false);
//       }
//     }
//   };

//   const renderPredefinedOptions = () => {
//     const options = [
//       "Give me details of Section 12",
//       "Search case related to food"
//     ];

//     return options.map((option, index) => (
//       <div className={`flex flex-col mb-4 items-end select-text`}>
                
//       <div 
//         key={index} 
//         onClick={() => handleSendMessage(option)}
//         className="cursor-pointer hover:bg-primary rounded-lg p-2 my-1 text-sm select-text bg-muted hover:text-primary-foreground"
//         >
//         {option}
//       </div>
//         </div>
//     ));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const messageInput = e.target.elements.message;
//     const messageText = messageInput.value.trim();
    
//     if (messageText) {
//       handleSendMessage(messageText);
//       messageInput.value = '';
//     }
//   };

//   return (
//     <div className="fixed bottom-4 right-4 z-50">
//       {isOpen ? (
//         <div className="bg-gray-50/70 border rounded-lg shadow-lg w-[500px] h-screen max-h-[90vh] min-h-[600px] flex flex-col">
//           <div className="flex justify-between items-center p-4 border-b">
//             <div className="flex items-center space-x-2">
//               <Avatar className="flex justify-center items-center h-8 w-8">
//                 <BotMessageSquare color="blue" />
//               </Avatar>
//               <div>
//                 <h3 className="font-semibold text-sm">Legal Bot</h3>
//                 <p className="text-xs text-muted-foreground">Online</p>
//               </div>
//             </div>
//             <Button variant="ghost" size="icon" onClick={toggleChat}>
//               <X className="h-4 w-4" />
//             </Button>
//           </div>
//           <ScrollArea className="flex-grow p-4 overflow-y-auto">
//             {messages.map((message, index) => (
//               <div 
//                 key={index} 
//                 className={`flex flex-col mb-4 ${message.sender === "You" ? "items-end" : "items-start"} select-text`}
//               >
//                 <div 
//                   className={`
//                     rounded-lg p-2 max-w-[95%] 
//                     ${message.sender === "You" ? "bg-primary text-primary-foreground" : "bg-muted"}
//                   `}
//                 >
//                   <p 
//                     className="text-sm" 
//                     dangerouslySetInnerHTML={{ __html: message.content }}
//                   ></p>
//                 </div>
//                 <span className="text-xs text-muted-foreground mt-1">{message.time}</span>
//               </div>
//             ))}
//             {messages.length === 1 && (
//               <div className="mt-4">
//                 {renderPredefinedOptions()}
//               </div>
//             )}
//             <div ref={messagesEndRef} />
//           </ScrollArea>
//           <form onSubmit={handleSubmit} ref={formRef} className="border-t p-4 flex items-center">
//             <Input 
//               type="text" 
//               placeholder="Type a message..." 
//               name="message" 
//               className="flex-grow mr-2" 
//               disabled={loading || isThinking} 
//             />
//             <Button
//               type="submit"
//               size="icon"
//               className="shrink-0 text-white bg-blue-700 hover:bg-blue-800 transition hover:duration-200"
//               disabled={loading || isThinking}
//             >
//               <Send className="h-4 w-4" />
//             </Button>
//           </form>
//         </div>
//       ) : (
//         <Button onClick={toggleChat} className="rounded-full h-12 w-12 bg-blue-700 text-primary-foreground hover:bg-primary/90">
//           <MessageCircle className="h-6 w-6" />
//         </Button>
//       )}
//     </div>
//   );
// }
