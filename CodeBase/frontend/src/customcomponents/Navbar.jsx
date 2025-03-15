import { Link, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Scale, UserIcon, HistoryIcon, LogOutIcon, Trash, Eraser } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import toast from "react-hot-toast";
import { useLogout } from "@/hooks/useLogout";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useHistoryContext } from "@/context/userHistoryContext";
import useSearch from "@/hooks/useSearch";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const { searchHistory, loading, error, deleteSearchEntry, clearSearchHistory } = useHistoryContext(); // Get search history from context
  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleHistoryClick = (entry) => async () => {
    console.log("ENTRY", entry);
    switch (entry.searchType) {
      case "generic":
        navigate("/search", { state: { searchType: entry.searchType, queryData: entry.query_data, caseType:entry.case_type } }); // Navigate to the search results page
        break;
      case "trademark":
        if (entry.query_data.query_type === "section_no") {
          navigate("/search", { state: { searchType: entry.searchType, queryData: entry.query_data, query_type: "section",caseType:entry.case_type } }); // Navigate to the search results page
        } else {
          navigate("/search", { state: { searchType: entry.searchType, queryData: entry.query_data, query_type: "text",caseType:entry.case_type } });
        }
        break;
      case "judgement":
        navigate("/search", { state: { searchType: entry.searchType, queryData: entry.query_data } }); // Navigate to the search results page
        break;
    }
  };

  return (
    <header className="flex items-center px-2 lg:px-2 h-12 pt-2">
      <Link className="flex justify-center items-center cursor-pointer" to="/">
        <Scale className="w-6 h-6  " />
      </Link>
      <nav className="flex gap-4 sm:gap-6 ml-auto font-medium text-sm mx-4">
        <Link className="underline-offset-4 hover:underline transition hover:duration-200 cursor-pointer ease-in-out hidden sm:block" to="/search">
          Search Engine
        </Link>
        {/* <Link className="underline-offset-4 hover:underline transition hover:duration-200 cursor-pointer ease-in-out hidden sm:block" to="/chatbot">
          Chatbot
        </Link> */}
        {/* <Link className="underline-offset-4 hover:underline transition hover:duration-200 cursor-pointer ease-in-out hidden sm:block" to="/aboutus">
          About Us!
        </Link> */}
      </nav>

      {user && (
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
          <SheetContent aria-describedby="description">
            <SheetHeader>
              <SheetTitle>
                <SheetDescription className="text-start text-xl text-primary ">Profile</SheetDescription>
              </SheetTitle>
            </SheetHeader>
            <div className="py-4 flex flex-col justify-between">
              <div className="flex items-center  space-x-2 md:space-x-4">
                <Avatar className="w-10 h-10 md:w-16 md:h-16 ">
                  <AvatarImage src="/placeholder-user.jpg" alt="User" />
                  <AvatarFallback>
                    <UserIcon className="w-6 h-6 md:w-8 md:h-8" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-lg md:text-xl font-bold">{user.name}</h2>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold md:mb-2">Chat History</h3>
                <ScrollArea className="h-[300px]">
                  {loading && <p>Loading history...</p>}
                  {error && <p className="text-red-500">{error}</p>}
                  {!loading && !error && searchHistory.length === 0 && <p>No history available.</p>}
                  <ul className="space-y-2">
                    {!loading &&
                      searchHistory.map((entry, index) => (
                        <li key={index} className="flex items-center space-x-2 text-sm" >
                          <div className="w-full flex justify-between items-center">
                            <div className="flex items-center space-x-1" onClick={handleHistoryClick(entry)}>
                              <HistoryIcon className="w-4 h-4" />
                              <span>
                                {entry.searchType === "trademark" ? (
                                  entry.query_data.query_type === "section_no" ? (
                                    "Ordinance Sec No " + entry.query_data.section_no
                                  ) : (
                                    "Ordinance: " + entry.query_data.text
                                  )
                                ) : (
                                  entry.query_data.text || entry.query_data
                                )}
                              </span>
                            </div>
                            <button onClick={() => deleteSearchEntry(entry._id)}>
                              <Trash className="w-4 h-4 self-end" />
                            </button>
                          </div>
                        </li>
                      ))}
                  </ul>
                </ScrollArea>
              </div>

              <div className="mt-6">
                <Button variant="" className="w-full mb-4 " onClick={clearSearchHistory}>
                  <Eraser className="w-4 h-4 mr-2" />
                  Clear History
                </Button>
                <Button variant="outline" className="w-full " onClick={handleLogout}>
                  <LogOutIcon className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}

      {!user && (
        <>
          <Button size="sm" className="bg-blue-700 hover:bg-blue-700/90 mr-2" asChild>
            <Link to="/register">Sign Up</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/login">Sign In</Link>
          </Button>
        </>
      )}
    </header>
  );
};

export default Navbar;
