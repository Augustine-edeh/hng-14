import { useState } from "react";
import ReactMarkdown from "react-markdown";

type ExtractedContent = {
  title: string;
  content: string;
  url: string;
};

export default function Popup() {
  const [loading, setLoading] = useState(false);

  const [pageData, setPageData] = useState<ExtractedContent | null>(null);

  const [error, setError] = useState("");

  const [summary, setSummary] = useState("");

  const handleSummarize = async () => {
    try {
      setLoading(true);
      setError("");

      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab.id) {
        throw new Error("No active tab found");
      }

      const response = await chrome.tabs.sendMessage(tab.id, {
        type: "EXTRACT_PAGE_CONTENT",
      });

      if (!response.success) {
        throw new Error(response.error);
      }

      setPageData(response.data);

      const summaryResponse = await chrome.runtime.sendMessage({
        type: "GENERATE_SUMMARY",
        content: response.data.content,
      });

      if (!summaryResponse.success) {
        throw new Error(summaryResponse.error);
      }

      setSummary(summaryResponse.summary);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-100 min-h-125 bg-slate-950 text-white p-4">
      <div>
        <h1 className="text-xl font-bold">AI Page Summarizer</h1>

        <p className="text-sm text-slate-400 mt-1">
          Summarize webpages instantly with AI
        </p>
      </div>

      <div className="mt-6">
        <button
          onClick={handleSummarize}
          disabled={loading}
          className="
            w-full
            rounded-xl
            bg-blue-600
            hover:bg-blue-500
            disabled:opacity-50
            transition-colors
            px-4
            py-3
            font-medium
          "
        >
          {loading ? "Extracting..." : "Summarize Page"}
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="mt-6 rounded-xl border border-slate-800 p-4">
        {!pageData ? (
          <p className="text-sm text-slate-400">
            Your extracted page content will appear here.
          </p>
        ) : (
          <div className="space-y-4">
            <div>
              <h2 className="font-semibold text-base">{pageData.title}</h2>

              <p className="text-xs text-slate-500 mt-1 break-all">
                {pageData.url}
              </p>
            </div>

            <div className="max-h-62.5 overflow-y-auto rounded-lg bg-slate-900 p-3">
              {summary ? (
                <div className="prose prose-invert prose-sm max-w-none prose-headings:text-white prose-p:text-slate-300 prose-strong:text-white prose-li:text-slate-300">
                  <ReactMarkdown>{summary}</ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm text-slate-400 whitespace-pre-wrap">
                  {pageData.content.slice(0, 3000)}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
