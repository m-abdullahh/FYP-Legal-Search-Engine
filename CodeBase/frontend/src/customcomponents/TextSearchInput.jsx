import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

import { Input } from "@/components/ui/input";

const TextSearchInput = ({ form, onSubmit, inputType = "text", searchType, placeholder = "Enter text" }) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex justify-center items-center gap-x-2 my-4">
        <FormField
          control={form.control}
          name={inputType}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type={inputType == "text" ? "text" : "number"}
                  className={`${searchType === "trademark" ? "min-w-50" : "min-w-72"} md:w-80 lg:w-96`}
                  placeholder={placeholder}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="px-2 sm:px-4 py-2 sm:py-2 bg-blue-700 hover:bg-blue-700/90">
          <ChevronRight className="block sm:hidden w-6 h-4 shrink-0" />
          <span className="sm:block hidden">Search</span>
        </Button>
      </form>
    </Form>
  );
};

export default TextSearchInput;
