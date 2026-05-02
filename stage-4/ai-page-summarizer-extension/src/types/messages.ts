export type ExtractedPageContent = {
  title: string;
  content: string;
  url: string;
};

export type ExtractContentResponse = {
  success: boolean;
  data?: ExtractedPageContent;
  error?: string;
};
