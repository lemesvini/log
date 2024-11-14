interface IssueCardProps {
  issue: {
    newIssueName: string;
    description: string;
    issueNumber: number;
    createdAt: string; // You can adjust this type if using a different date format
    vault: string;
    badge: string;
  };
}

export default function IssueCard({ issue }: IssueCardProps) {
  return (
    <div className="bg-black w-[90%] max-w-[800px] min-h-[100px] p-4 text-white cursor-pointer">
      <div className="w-full flex flex-row justify-between">
        <div className="flex flex-row gap-4">
          <div className="text-red-500">#{issue.issueNumber}</div>{" "}
          {/* Display issue number */}
          <div className="font-black text-green-600">
            {issue.newIssueName}
          </div>{" "}
          {/* Display issue title */}
        </div>
        <div
          className={`px-3 font-bold ${
            issue.badge === "log"
              ? "bg-blue-600"
              : issue.badge === "feat"
              ? "bg-orange-600"
              : issue.badge === "fix"
              ? "bg-red-600"
              : "" 
          }`}
        >
          {issue.badge}
        </div>
      </div>
      <hr className="my-3 border-[#0D1117]" />
      <div className="font-extralight">
        <p className="text-justify">{issue.description}</p>{" "}
        {/* Display issue description */}
      </div>
      <div className="mt-3 w-full flex justify-between text-[#8098A1]">
        <span>{issue.vault} vault </span>
        <span>created at: {new Date(issue.createdAt).toLocaleString()}</span>
      </div>
    </div>
  );
}
