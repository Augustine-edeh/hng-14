import { FileText } from "lucide-react";

const EmptyStateUI = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-2xl bg-slate-900 p-4">
        <FileText className="h-8 w-8 text-slate-500" />
      </div>

      <h3 className="mt-4 text-sm font-medium text-white">No summary yet</h3>

      <p className="mt-2 max-w-xs text-sm text-slate-400">
        Open an article or blog post and click "Summarize Page" to generate an
        AI-powered summary.
      </p>
    </div>
  );
};

export default EmptyStateUI;
