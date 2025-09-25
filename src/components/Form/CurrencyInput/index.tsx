import { useContext, forwardRef } from "react";
import { formInlineContext } from "../FormInline";
import { inputGroupContext } from "../InputGroup";
import { twMerge } from "tailwind-merge";
import CurrencyInputC from "react-currency-input-field";

interface CurrencyInputProps extends React.ComponentPropsWithoutRef<"input"> {
  formInputSize?: "sm" | "lg";
  rounded?: boolean;
  name: string;
  onValueChange?: (
    value: string | undefined,
    name?: string,
    values?: any
  ) => void;
  value?: number | string;
}

type CurrencyInputRef = React.ComponentPropsWithRef<"input">["ref"];

const CurrencyInput = forwardRef(
  (props: CurrencyInputProps, ref: CurrencyInputRef) => {
    const formInline = useContext(formInlineContext);
    const inputGroup = useContext(inputGroupContext);
    const {
      formInputSize,
      rounded,
      onValueChange,
      value,
      onChange,
      onBlur,
      name,
      placeholder,
      className,
      disabled,
      ...restProps
    } = props;

    return (
      <CurrencyInputC
        name={name}
        placeholder={placeholder}
        disabled={disabled}
        ref={ref}
        value={value}
        onValueChange={onValueChange}
        className={twMerge([
          className,
          "h-9 p-2",
          "disabled:bg-slate-100 disabled:cursor-not-allowed dark:disabled:bg-darkmode-800/50 dark:disabled:border-transparent",
          "[&[readonly]]:bg-slate-100 [&[readonly]]:cursor-not-allowed [&[readonly]]:dark:bg-darkmode-800/50 [&[readonly]]:dark:border-transparent",
          "transition duration-200 ease-in-out w-full text-sm border-slate-200 shadow-sm rounded-md placeholder:text-slate-400/90 focus:outline-none focus:ring-1 focus:ring-[#fd4d5f] focus:border-[#FD4D5F] dark:bg-darkmode-800 dark:border-transparent dark:focus:ring-[#fd4d5f]/40 dark:placeholder:text-slate-500/80",
          "hover:border-[#FD4D5F]",
          formInputSize == "sm" && "text-xs py-1.5 px-2",
          formInputSize == "lg" && "text-lg py-1.5 px-4",
          rounded && "rounded-full",
          formInline && "flex-1",
          inputGroup &&
            "rounded-none [&:not(:first-child)]:border-l-transparent first:rounded-l last:rounded-r z-10",
          props.className,
        ])}
      />
    );
  }
);

export default CurrencyInput;
