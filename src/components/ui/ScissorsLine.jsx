import { ScissorsLineDashed } from "lucide-react";

export const ScissorsLine = () => {
  return (
    <div className=" print:relative print:w-full print:flex print:items-center print:justify-center ">
      <div className="">
        <ScissorsLineDashed className="h-6 w-6" color="#6a7282" />
      </div>
      <div className="border-t-2 border-dashed border-gray-500 flex-grow"></div>
      <div className="flex justify-end">
        <ScissorsLineDashed
          className="h-6 w-6 transform rotate-180"
          color="#6a7282"
        />
      </div>
    </div>
  );
};
