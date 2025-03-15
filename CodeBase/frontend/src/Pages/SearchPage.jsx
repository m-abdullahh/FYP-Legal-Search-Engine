import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { set, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TextSearchInput from "@/customcomponents/TextSearchInput";
import ResultCard from "@/customcomponents/ResultCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator"
import useSearch from "@/hooks/useSearch"; // Import the custom hook
import { useLocation } from "react-router-dom"; // Import useLocation
// import toast from "react-hot-toast";

//! TEXT SCHEMA
const textSchema = z
  .object({
    text: z
      .string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a string",
      })
      .optional(),
    section: z
      .string()
      .optional()
      .nullable()
      .refine((val) => val === null || !Number.isNaN(val), {
        message: "Expected a valid number",
      }),
  })
  .refine((data) => data.text || data.section, {
    message: "Either text or section must be provided",
  });

const SearchPage = () => {
  const location = useLocation(); // Access location
  const { state } = location; // Retrieve state
  const [searchType, setSearchType] = useState("generic");
  const [caseType, setcaseType] = useState("trademark");
  const [inputType, setInputType] = useState("text");

  // Use the custom hook
  const {
    setGenericSearchResult,
    setJudgementClassificationResult,
    setTrademarkSearchResult,
    search,
    genericSearchResult,
    trademarkSearchResult,
    judgementClassificationResult,
    loading,
    hasSearched,
    setHasSearched
  } = useSearch();

  // Initialize form state
  const form = useForm({
    resolver: zodResolver(textSchema),
    defaultValues: { text: "", section: "" },
  });

  useEffect(() => {
    // console.log("STATE", state);
    if (state && state.searchType !== "" && state.caseType !== "") {
      setSearchType(state.searchType);
      console.log("CASE TYPE", state);
      setcaseType(state.queryData.case_type);
      if (state.queryData) {
        if (state.searchType === "trademark" && state.query_type === "section") {
          setInputType("section");
          form.setValue("section", state.queryData.section_no); // Set section value
        } else if (state.searchType === "trademark" && state.query_type === "text") {
          setInputType("text");
          form.setValue("text", state.queryData.text); // Set section value
        } else {
          form.setValue("text", state.queryData.text); // Set text value
        }
      }
      search(state.searchType, state.query_type, form.getValues(),state.queryData.case_type, true); // Perform search based on the state
    }
  }, [state, form]);

  const handleSearchType = (type) => {
    setSearchType(type); // Set the search type
    // Reset the form and search results
    form.reset();
    setGenericSearchResult([]);
    setJudgementClassificationResult([]);
    setTrademarkSearchResult([]);
    setHasSearched(false);
  };

  const handleCaseType = (type) => {
    setcaseType(type); // Set the search type
    // Reset the form and search results
    form.reset();
    setGenericSearchResult([]);
    setJudgementClassificationResult([]);
    setTrademarkSearchResult([]);
    setHasSearched(false);

  };

  // On submit
  const onSubmit = async (data) => {
    await search(searchType, inputType, data,caseType); // Call the search function from the custom hook

    console.log("SEARCH TYPE", searchType);
    console.log(judgementClassificationResult);
  };

  return (
    <div className="flex flex-col min-h-screen mx-2">
      <h1 className="mt-6 mb-4 font-extrabold text-3xl text-center">Legal Search Engine</h1>
      <main className="flex flex-col justify-center gap-y-4">
        <CaseTypeRadio caseType={caseType} handleCaseType={handleCaseType} />
        <Separator className="my-0  w-36 self-center" decorative />
        <SearchTypeRadio searchType={searchType} handleSearchType={handleSearchType} />
      </main>
      <section className="mx-2">
        {searchType === "generic" && <TextSearchInput {...{ form, onSubmit, searchType }} />}
        {searchType === "trademark" && (
          <TrademarkSearch
            {...{ form, onSubmit, inputType, setInputType, searchType }}
            placeholder={inputType === "section" ? "Enter Section No." : "Enter Text"}
          />
        )}
        {searchType === "judgement" && <TextSearchInput {...{ form, onSubmit, searchType }} />}
      </section>
      {hasSearched && searchType != "judgement" && (
        <Badge variant="outline" className="text-muted-foreground text-sm self-end mr-6 mb-2">
          {genericSearchResult.length + trademarkSearchResult.length} Results
        </Badge>
      )}
      <section className="">
        {loading ? (
          <div className="flex w-full flex-col space-y-3">
            <Skeleton className="h-[125px] w-full rounded-xl" />
          </div>
        ) : (
          <>
            {genericSearchResult.length > 0 &&
              Array.isArray(genericSearchResult) &&
              genericSearchResult.map((result, index) => <ResultCard key={index} result={result} result_type={searchType} />)}

            {trademarkSearchResult.length > 0 &&
              trademarkSearchResult.map((result, index) => <ResultCard key={index} result={result} result_type={searchType} />)}

            {judgementClassificationResult.result && <ResultCard result={judgementClassificationResult} result_type={searchType} />}
          </>
        )}
      </section>
    </div>
  );
};

const SearchTypeRadio = ({ searchType, handleSearchType }) => {
  return (
    <RadioGroup value={searchType} onValueChange={handleSearchType} className="flex flex-wrap justify-center">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="generic" id="generic" />
        <Label htmlFor="generic"> Cases</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="trademark" id="trademark" />
        <Label htmlFor="trademark"> Ordinance </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="judgement" id="judgement" />
        <Label htmlFor="judgement">Judgement Classification</Label>
      </div>
    </RadioGroup>
  );
};

const CaseTypeRadio = ({ caseType, handleCaseType }) => {
  return (
    <RadioGroup value={caseType} onValueChange={handleCaseType} className="flex flex-wrap justify-center">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="trademark" id="trademark" />
        <Label htmlFor="trademark"> Trademark </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="copyright" id="copyright" />
        <Label htmlFor="copyright"> Copyright</Label>
      </div>
    
    </RadioGroup>
  );
};


const TrademarkSearch = ({ form, onSubmit, inputType, setInputType, searchType, placeholder }) => {
  return (
    <div className="flex justify-center items-center gap-x-2 ">
      <Select
        className=""
        defaultValue="text"
        onValueChange={(value) => {
          setInputType(value);
          form.reset(); // Reset form when input type changes
        }}
      >
        <SelectTrigger className="w-[100px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="text">Text</SelectItem>
            <SelectItem value="section">Section</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <TextSearchInput {...{ form, onSubmit, inputType, searchType, placeholder }} />
    </div>
  );
};

export default SearchPage;
