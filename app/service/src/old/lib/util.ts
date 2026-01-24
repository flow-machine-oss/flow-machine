export const maskApiKey = (apiKey: string) => {
  if (apiKey.length <= 8) {
    return "********";
  }
  return "****" + apiKey.slice(-4);
};
