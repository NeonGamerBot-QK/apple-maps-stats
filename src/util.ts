export enum Phrases {
  STARTING,
  UPDATED,
  ENDING,
  UNK = -1,
}
export type StrResult = {
  phrase: string;
  type: Phrases;
  location: string;
  timestamp?: string;
};
export const startANDEnd = (content: string, start: string, end: string) => {
  if (content.includes(start) && content.includes(end)) {
    return true;
  }
  return false;
};
export const parseStr = (content: string) => {
  // const arrivalRegex = /I will arrive at (.*) around (.*)\. I'll let you know if i'm running late\./i;
  // const updatedRegex = /My updated arrival time to (.*) is now around (.*)\./;
  // const endingRegex = /I'm arriving at (.*) soon/;
  const result: StrResult = {
    phrase: content,
    type: Phrases.UNK,
    location: "",
  };
  if (startANDEnd(content.trim(), "I will arrive at", "running late.")) {
    result.type = Phrases.STARTING;
    result.location = content.split("I will arrive at ")[1].split(" around")[0];
    result.timestamp = content
      .split("around ")[1]
      .split(" I")[0]
      .replaceAll(".", "");
  } else if (
    startANDEnd(content.trim(), "My updated arrival time to", "is now around")
  ) {
    result.type = Phrases.UPDATED;
    result.location = content
      .split("My updated arrival time to ")[1]
      .split(" is now around")[0];
    result.timestamp = content.split("is now around ")[1].split(".")[0];
  } else if (content.includes("arriving at")) {
    result.type = Phrases.ENDING;
    result.location = content
      .split("arriving at ")[1]
      .split(".")[0]
      .split(" soon")[0];
  }
  return result;
};
export const hashEmail = (email: string) => {
  // using md5 for this cuz gravatar is real
  // remember emails are from XXXXXXXXXX@mms.att.net
  const hash = new Bun.MD5();
  hash.update(email);
  return hash.digest("hex");
};
