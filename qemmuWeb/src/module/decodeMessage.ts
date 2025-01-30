export const decodeMessage = (data: string): any => {
  try {
    const { content }: { content: string } = JSON.parse(data);
    let returnData: string | object = atob(content);

    let i = 0;
    while (typeof returnData === "string" && i <= 10) {
      returnData = JSON.parse(returnData);
      i++;
    }

    if (typeof returnData === "string") {
      console.warn("Max iterations reached. Returning raw data.");
      return returnData;
    }

    return returnData;
  } catch (error) {
    console.error("Error decoding message:", error);
    throw new Error("Failed to decode message");
  }
};
