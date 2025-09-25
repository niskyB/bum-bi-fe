import { useContext, forwardRef } from "react";
import { formInlineContext } from "../FormInline";
import { twMerge } from "tailwind-merge";
import { Select } from "antd";
import type { SelectProps } from "antd";

interface FormSelectProps extends SelectProps {
  formSelectSize?: "sm" | "lg";
}

const FormSelect = forwardRef<any, FormSelectProps>((props, ref) => {
  const formInline = useContext(formInlineContext);
  const { formSelectSize, className, ...computedProps } = props;
  return (
    <Select
      {...computedProps}
      ref={ref}
      size={
        formSelectSize === "sm"
          ? "small"
          : formSelectSize === "lg"
          ? "large"
          : undefined
      }
      className={twMerge(["w-full", formInline && "flex-1", className])}
    />
  );
});

export default FormSelect;
