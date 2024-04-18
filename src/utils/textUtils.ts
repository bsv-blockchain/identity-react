export const truncateText = (text: string, maxLength: number = 10): string => {
  // Check if the text length is greater than the maximum allowed length
  if (text.length > maxLength) {
    // Return the truncated text with an ellipsis
    return text.substring(0, maxLength) + '...';
  }
  // Return the original text if it does not exceed the maximum length
  return text;
}
