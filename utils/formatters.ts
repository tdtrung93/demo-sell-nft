export const formatEthAddress = (str: string | undefined): string => {
  return str ? `${str.substring(0, 4)}...${str.substring(str.length - 4)}` : '';
};
