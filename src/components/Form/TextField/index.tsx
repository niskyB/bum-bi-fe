import React, {
  FunctionComponent,
  InputHTMLAttributes,
  ReactNode,
  useMemo,
} from "react";
import { FieldValues, RegisterOptions, useFormContext } from "react-hook-form";
import FieldWrapper, { FieldWrapperProps } from "../FieldWrapper";
import { twMerge } from "tailwind-merge";
import FormInput from "../FormInput";

type TextFieldCProps = Omit<InputHTMLAttributes<HTMLInputElement>, "prefix"> &
  FieldWrapperProps & {
    registerOptions?: RegisterOptions<FieldValues, string>;
    prefixIcon?: ReactNode;
    postfixIcon?: ReactNode;
  };

const TextFieldC: FunctionComponent<TextFieldCProps> = ({
  label,
  name,
  className,
  onChange: onChangeProp,
  registerOptions,
  layout,
  isCheckbox,
  prefixIcon,
  postfixIcon,
  ...rest
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const { onChange, ...registerMethods } = register(name, registerOptions);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeProp?.(e);

    onChange(e);
  };

  const isHaveError = useMemo(() => {
    return Boolean(errors[name]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errors, name, errors[name]]);

  return (
    <FieldWrapper
      label={label}
      name={name}
      isCheckbox={isCheckbox}
      layout={layout}
    >
      <div className={twMerge("relative")}>
        {prefixIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-2">
            {prefixIcon}
          </div>
        )}
        <FormInput
          {...registerMethods}
          {...rest}
          onChange={onInputChange}
          className={twMerge(
            className,
            isHaveError && "border-red-500",
            prefixIcon && "pl-5",
            postfixIcon && "pr-5"
          )}
        />
        {postfixIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            {postfixIcon}
          </div>
        )}
      </div>
    </FieldWrapper>
  );
};

export default TextFieldC;
