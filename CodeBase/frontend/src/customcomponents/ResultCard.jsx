import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, ChevronUp } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const ResultCard = ({ result, result_type }) => {
  console.log(result);
  const generateGenericPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(12);
    const titleLines = doc.splitTextToSize(result.Title, 180);
    doc.text(titleLines, 14, 30);

    const tableStartY = 30 + titleLines.length * 5;

    // Add content using autoTable
    doc.autoTable({
      startY: tableStartY,
      head: [["Field", "Content"]],
      body: [
        ["Title", result.Title],
        ["Facts", result.Facts],
        ["Issues Framed", result.Issues_framed],
        ["Decisions/Holdings", result.Decisions_Holdings],
        ["Reasoning and Analysis", result.Reasoning_and_Analysis],
        ["Judgment Results", result.Judgement_Result],
      ],
      theme: "striped",
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      bodyStyles: { valign: "top" },
      columnStyles: { 0: { cellWidth: 40 }, 1: { cellWidth: "auto" } },
      margin: { top: 30 },
    });

    // Save the PDF
    doc.save(`${result.Title}.pdf`);
  };

  const generateTrademarkPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(12);
    const titleLines = doc.splitTextToSize(result.title, 180);
    doc.text(titleLines, 14, 30);

    const tableStartY = 30 + titleLines.length * 5;

    // Add content using autoTable
    doc.autoTable({
      startY: tableStartY,
      head: [["Field", "Content"]],
      body: [
        ["Title", result.title],
        ["Chapter No. ", result.chapter_no],
        ["Section No", `${result.sect_no} (${result.subsec_1}) (${result.subsec_2}) (${result.subsec_3})`],
        ["Section Discription", result.sect_desc],
        ["Subsection Discription", result.subsec_desc],
      ],
      theme: "striped",
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      bodyStyles: { valign: "top" },
      columnStyles: { 0: { cellWidth: 40 }, 1: { cellWidth: "auto" } },
      margin: { top: 30 },
    });

    // Save the PDF
    doc.save(`Sect.[${result.sect_no}]${result.title}.pdf`);
  };

  // console.log(result);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {result_type === "generic" && (
        <Card className="mb-4 w-full cursor-pointer text-xs md:text-md">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className={"font-semibold text-xs md:text-md " + `${!isExpanded && "line-clamp-2 md:line-clamp-1"}`}>
                {result.Title}
              </CardTitle>
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 shrink-0" onClick={() => setIsExpanded(!isExpanded)} />
              ) : (
                <ChevronDown className="w-5 h-5 shrink-0" onClick={() => setIsExpanded(!isExpanded)} />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center text-xs">
            
              <Badge
                onClick={() => {
                  generateGenericPDF();
                  setIsExpanded(false);
                }}
              >
                Save as PDF
              </Badge>
            </div>
            {isExpanded && (
              <div className="gap-4 grid mt-4 text-xs text-justify ">
                <Separator />
                {result.Issues_framed && result.Issues_framed != 'nil' && (
                  <div>
                    <h3 className="mb-2 font-semibold">Issues Framed</h3>
                    <p className="">{result.Issues_framed}</p>
                  </div>
                )}
                <div>
                  <h3 className="mb-2 font-semibold">Decision/Holdings</h3>
                  <p className="">{result.Decisions_Holdings}</p>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold">Reasoning and Analysis</h3>
                  <p className="">{result.Reasoning_and_Analysis}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {result_type === "trademark" && (
        <Card className="mb-4 w-full cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
          <CardHeader className="py-4">
            <div className="flex justify-between items-start">
              <CardTitle className={"font-semibold text-md " + `${!isExpanded && "line-clamp-1"}`}>{result.sect_desc}</CardTitle>
              <div className="space-x-2">
                <Badge variant={"destructive"} className="shrink-0 ml-2 bg-blue-700">
                  Section. ({result.sect_no}, {result.subsec_1}
                  {result.subsec_2}
                  {result.subsec_3}), {result.chapter_no}
                </Badge>

                <Badge className="shrink-0" onClick={() => generateTrademarkPDF()}>
                  Save as PDF
                </Badge>
              </div>
            </div>
            <div className="gap-4 grid mt-4">
              <div>
                <p className="text-sm">{result.subsec_desc}</p>
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      {result_type === "judgement" && (
        <Card className="mb-4 w-full cursor-pointer">
          <CardHeader className="py-4">
            <CardTitle className={"font-semibold text-md text-center "}>Result of this case is: {result.result}</CardTitle>
          </CardHeader>
        </Card>
      )}
    </>
  );
};

export default ResultCard;
