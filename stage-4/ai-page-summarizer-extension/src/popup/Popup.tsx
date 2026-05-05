import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { getCachedSummary, cacheSummary } from "../storage/summaryStorage";
import { Loader2, Copy, Check, RotateCcw, FileText } from "lucide-react";
import { calculateReadingTime } from "../utils/readingTime";

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

  const [isCached, setIsCached] = useState(false);

  const [copied, setCopied] = useState(false);

  const readingStats = pageData ? calculateReadingTime(pageData.content) : null;

  const handleSummarize = async () => {
    if (loading) return;

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

      const cachedSummary = await getCachedSummary(response.data.url);

      if (cachedSummary) {
        setIsCached(true);

        setSummary(cachedSummary);

        setLoading(false);

        return;
      }

      const summaryResponse = await chrome.runtime.sendMessage({
        type: "GENERATE_SUMMARY",
        content: response.data.content,
      });

      if (!summaryResponse.success) {
        throw new Error(summaryResponse.error);
      }

      setIsCached(false);

      setSummary(summaryResponse.summary);

      await cacheSummary(response.data.url, summaryResponse.summary);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCopySummary = async () => {
    if (!summary) return;

    try {
      await navigator.clipboard.writeText(summary);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy summary", error);
    }
  };

  const handleReset = () => {
    setPageData(null);

    setSummary("");

    setError("");

    setIsCached(false);

    setCopied(false);
  };

  return (
    <main className="w-105 min-h-150 bg-slate-950 text-white p-5">
      <div>
        <h1 className="text-xl font-bold">AI Page Summarizer</h1>

        <p className="text-sm text-slate-400 mt-1">
          Summarize webpages instantly with AI
        </p>
      </div>
      <div className="mt-6 flex gap-3">
        <button
          onClick={handleSummarize}
          disabled={loading}
          className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 px-4 py-3 font-medium shadow-lg shadow-blue-500/20"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Summarizing...
            </span>
          ) : (
            "Summarize Page"
          )}
        </button>

        {(pageData || summary || error) && (
          <button
            onClick={handleReset}
            className="
      flex
      items-center
      justify-center
      rounded-xl
      border
      border-slate-700
      bg-slate-900
      px-4
      py-3
      text-slate-300
      hover:bg-slate-800
      transition-colors
    "
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        )}
      </div>
      {error && (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
          {error}
        </div>
      )}
      <div className="mt-6 rounded-xl border border-slate-800 p-4">
        {!pageData ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-2xl bg-slate-900 p-4">
              <FileText className="h-8 w-8 text-slate-500" />
            </div>

            <h3 className="mt-4 text-sm font-medium text-white">
              No summary yet
            </h3>

            <p className="mt-2 max-w-xs text-sm text-slate-400">
              Open an article or blog post and click "Summarize Page" to
              generate an AI-powered summary.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold text-base">{pageData.title}</h2>

                <p className="text-xs text-slate-500 mt-1 break-all">
                  {pageData.url}
                </p>

                {readingStats && (
                  <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
                    <span>{readingStats.words.toLocaleString()} words</span>

                    <span>•</span>

                    <span>{readingStats.minutes} min read</span>
                  </div>
                )}

                {isCached && (
                  <p className="mt-2 text-xs text-green-400">Cached summary</p>
                )}
              </div>

              {summary && (
                <button
                  onClick={handleCopySummary}
                  className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-300 hover:bg-slate-700 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-green-400" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="border-t border-slate-800" />

            <div className="max-h-80 overflow-y-auto rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              {loading ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-4 rounded bg-slate-700" />
                  <div className="h-4 rounded bg-slate-700" />
                  <div className="h-4 w-5/6 rounded bg-slate-700" />
                  <div className="h-4 w-4/6 rounded bg-slate-700" />
                </div>
              ) : summary ? (
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
