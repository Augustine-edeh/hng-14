export default function Popup() {
  return (
    <main className="w-[400px] min-h-[500px] bg-slate-950 text-white p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">AI Page Summarizer</h1>

          <p className="text-sm text-slate-400 mt-1">
            Summarize webpages instantly with AI
          </p>
        </div>
      </div>

      <div className="mt-6">
        <button
          className="
            w-full
            rounded-xl
            bg-blue-600
            hover:bg-blue-500
            transition-colors
            px-4
            py-3
            font-medium
          "
        >
          Summarize Page
        </button>
      </div>

      <div className="mt-6 rounded-xl border border-slate-800 p-4">
        <p className="text-sm text-slate-400">
          Your AI-generated summary will appear here.
        </p>
      </div>
    </main>
  );
}
