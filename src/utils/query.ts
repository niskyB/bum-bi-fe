import axios from "axios";
import { QueryRetryParameters } from "main/interfaces/query";

export const queryRetry =
  (
    retryTimes: number,
    {
      compareType = "greater-equal",
      statusCode = 500,
    }: QueryRetryParameters = {}
  ) =>
  (failureCount: number, error: unknown) => {
    if (failureCount >= retryTimes) {
      return false;
    }

    if (axios.isAxiosError(error)) {
      const responseStatusCode = error.response?.status;
      if (typeof responseStatusCode === "number") {
        if (compareType === "equal" && responseStatusCode === statusCode)
          return true;
        if (compareType === "greater" && responseStatusCode > statusCode)
          return true;
        if (compareType === "lower" && responseStatusCode < statusCode)
          return true;
        if (compareType === "greater-equal" && responseStatusCode >= statusCode)
          return true;
        if (compareType === "lower-equal" && responseStatusCode <= statusCode)
          return true;
      }
    }

    return false;
  };
