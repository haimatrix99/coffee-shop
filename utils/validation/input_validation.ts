const MIN_PASSWORD_LENGTH = 7;
const isNotEmpty = (value: string): boolean => value.trim() !== "";
const isMinPassLength = (value: string): boolean =>
  value.length >= MIN_PASSWORD_LENGTH;

export const isValidPassword = (password: string) => {
  return isNotEmpty(password) && isMinPassLength(password);
};

export const isValidPhoneNumber = (phoneNumber: string) => {
  return isNotEmpty(phoneNumber);
};

export const isValidName = (userName: string) => {
  return isNotEmpty(userName);
};
