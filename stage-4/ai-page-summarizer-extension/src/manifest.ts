const manifest = {
  manifest_version: 3,
  name: "AI Page Summarizer",
  version: "1.0.0",
  description: "Summarize webpages instantly using AI.",

  permissions: ["storage", "activeTab", "scripting"],

  host_permissions: [
    "<all_urls>",
    "https://generativelanguage.googleapis.com/*",
  ],
  action: {
    default_popup: "popup.html",
  },

  background: {
    service_worker: "src/background/background.ts",
    type: "module",
  },

  content_scripts: [
    {
      matches: ["<all_urls>"],
      js: ["src/content/content.ts"],
    },
  ],
};

export default manifest;
