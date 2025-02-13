// utils/formatDate.js
export const formatDate = (mongoDate, options = {}) => {
  if (!mongoDate) {
    return "Invalid Date";
  }

  try {
    const date = new Date(mongoDate);
    const defaultOptions = {
      year: "numeric",
      month: "long", // e.g., "January"
      day: "numeric", // e.g., "1" or "31"
    };

    return date.toLocaleDateString("en-US", { ...defaultOptions, ...options });
  } catch (error) {
    //.error("Error formatting date:", error);
    return "Invalid Date";
  }
};
