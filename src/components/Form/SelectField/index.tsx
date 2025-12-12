import { FunctionComponent, useEffect, useMemo } from "react";
import { FieldValues, RegisterOptions, useFormContext } from "react-hook-form";
import FieldWrapper from "../FieldWrapper";
import FormSelect from "../FormSelect";
import { twMerge } from "tailwind-merge";
import { ISelectOptions, SelectValueType } from "main/interfaces/form/select";
import type { SelectProps } from "antd";

type SelectFieldCProps<T extends SelectValueType = SelectValueType, V = any> = {
  label: string;
  name: string;
  registerOptions?: RegisterOptions<FieldValues, string>;
  options: ISelectOptions<T, V>[];
  withEmptyOption?: boolean;
  shouldHideEmptyOption?: boolean;
  className?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  formSelectSize?: "sm" | "lg";
} & Omit<
  SelectProps,
  "options" | "onChange" | "value" | "placeholder" | "className"
>;

const SelectFieldC: FunctionComponent<SelectFieldCProps> = ({
  label,
  name,
  className,
  onChange: onChangeProp,
  registerOptions,
  options,
  withEmptyOption,
  shouldHideEmptyOption = true,
  placeholder,
  ...rest
}) => {
  const {
    register,
    formState: { errors },
    getValues,
    setValue,
  } = useFormContext();
  const { onChange, ...registerMethods } = register(name, registerOptions);

  const onInputChange = (value: any) => {
    // mimic native event for RHF
    const syntheticEvent = {
      target: { name, value },
    } as unknown as React.ChangeEvent<HTMLSelectElement>;
    onChangeProp?.(syntheticEvent);
    onChange(syntheticEvent);
  };

  const isHaveError = useMemo(() => {
    return Boolean(errors[name]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errors, name, errors[name]]);

  const emptyOption: ISelectOptions<SelectValueType, any> = {
    label: placeholder ?? "",
    value: "",
    config: { hidden: shouldHideEmptyOption },
  };

  useEffect(() => {
    if (name == "") return;
    const value = getValues(name);
    setValue(name, value);
  }, [options, name, getValues, setValue]);

  return (
    <FieldWrapper label={label} name={name}>
      <FormSelect
        {...registerMethods}
        {...rest}
        options={(withEmptyOption ? [emptyOption, ...options] : options).map(
          ({ label, value, disabled }) => ({ label, value, disabled })
        )}
        onChange={onInputChange}
        value={getValues(name)}
        placeholder={placeholder}
        className={twMerge(
          "w-full intro-y",
          isHaveError && "border-red-500",
          className
        )}
      />
    </FieldWrapper>
  );
};

export default SelectFieldC;
