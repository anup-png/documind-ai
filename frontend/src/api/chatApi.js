import api from "./api";

export const askQuestion = async (documentId, question) => {
  const response = await api.post(
    `/documents/${documentId}/chat`,
    null,
    {
      params: {
        question,
      },
    }
  );

  return response.data;
};