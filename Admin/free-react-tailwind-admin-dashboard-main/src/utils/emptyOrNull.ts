export const emptyOrNull = (
  text: string | null | undefined,
  deafultTxt: string,
): string => {
  if (!text || text == "") return deafultTxt;
  return text;
};
