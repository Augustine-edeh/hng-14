export async function getCachedSummary(url: string): Promise<string | null> {
  const result = await chrome.storage.local.get(url);

  return (result[url] as string) ?? null;
}

export async function cacheSummary(url: string, summary: string) {
  await chrome.storage.local.set({
    [url]: summary,
  });
}
