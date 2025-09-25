import { BaseOptionType } from "antd/es/select";
import { DetailedHTMLProps, OptionHTMLAttributes } from "react";

export type SelectValueType = string | number;

export type ISelectOptions<
  T extends SelectValueType = SelectValueType,
  V = any
> = BaseOptionType & {
  label: string;
  value: T;
  extraData?: V;
  config?: Omit<
    DetailedHTMLProps<
      OptionHTMLAttributes<HTMLOptionElement>,
      HTMLOptionElement
    >,
    "value" | "label" | "className"
  >;
};
