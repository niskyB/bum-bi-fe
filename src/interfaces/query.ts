export interface QueryRetryParameters {
  compareType?: "equal" | "greater" | "lower" | "greater-equal" | "lower-equal";
  statusCode?: number;
}
