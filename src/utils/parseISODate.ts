/* eslint-disable import/no-anonymous-default-export */
import { format, parseISO } from "date-fns";

export default function (ISOdate: string, formatString: string) {
  return format(parseISO(ISOdate), formatString);
}
