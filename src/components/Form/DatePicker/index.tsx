import React, { useMemo } from "react";
import {
  DatePicker as AntdDatePicker,
  DatePickerProps as AntdDatePickerProps,
} from "antd";

import FieldWrapper from "../FieldWrapper";
import { FieldValues, RegisterOptions, useFormContext } from "react-hook-form";
import dayjs, { Dayjs } from "dayjs";
import { twMerge } from "tailwind-merge";
import { READABLE_FORMAT } from "main/constants/date";

export type DatePickerProps = AntdDatePickerProps & {
  label: string;
  name: string;
  registerOptions?: RegisterOptions<FieldValues, string>;
};

export const DatePicker: React.FC<DatePickerProps> = ({
  name,
  label,
  onChange: customChange,
  onBlur: customBlur,
  format = READABLE_FORMAT,
  style,
  direction,
  registerOptions,
  className,
  ...rest
}) => {
  const {
    register,
    formState: { errors },
    setValue,
    getValues,
  } = useFormContext();
  const { onChange, ...registerMethods } = register(name, registerOptions);

  const onInputChange = (date: Dayjs, dateString: string | string[]) => {
    customChange?.(date, dateString);
    if (typeof dateString === "string") {
      setValue(name, dateString);
    }
  };

  const isHaveError = useMemo(() => {
    return Boolean(errors[name]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errors, name, errors[name]]);

  const watchValue = getValues(name);
  return (
    <FieldWrapper label={label} name={name}>
      <AntdDatePicker
        {...registerMethods}
        onChange={onInputChange}
        value={watchValue ? dayjs(watchValue, READABLE_FORMAT) : undefined}
        onBlur={(...props) => {
          customBlur?.(...props);
        }}
        style={{
          width: "100%",
          padding: "7px 11px 7px",
          ...style,
        }}
        format={format}
        className={twMerge([className])}
        status={isHaveError ? "error" : undefined}
        {...rest}
      />
    </FieldWrapper>
  );
};
