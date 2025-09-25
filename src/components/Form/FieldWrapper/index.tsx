import { FC, PropsWithChildren } from "react";
import { useFormContext } from "react-hook-form";

export interface FieldWrapperProps extends PropsWithChildren {
  label: string;
  name: string;
  isCheckbox?: boolean;
  layout?: "horizontal" | "vertical";
}

const FieldWrapper: FC<FieldWrapperProps> = ({
  label,
  name,
  isCheckbox = false,
  children,
  layout = "vertical",
}) => {
  const {
    formState: { errors },
  } = useFormContext();

  if (isCheckbox) {
    return (
      <div className="flex text-xs intro-x text-slate-600 dark:text-slate-500 sm:text-sm">
        <div className="flex items-center mr-auto">
          <div className="mr-2">{children}</div>
          <label className="cursor-pointer select-none" htmlFor="usingZalo">
            {label}
          </label>
        </div>
      </div>
    );
  }
  return (
    <div
      className={`flex ${
        layout === "vertical" ? "flex-col" : "flex-row gap-5 items-center"
      }`}
    >
      <label
        htmlFor={name}
        className={`block text-sm font-medium leading-6 text-gray-900 ${
          layout === "horizontal" ? "w-16 text-wrap" : ""
        }`}
      >
        {label}
      </label>
      <div className={`flex flex-col gap-1 mt-0`}>
        {children}
        {/* {Boolean(errors[name]) && (
          <div className="text-danger pt-1">
            {errors[name]?.message?.toString()}
          </div>
        )} */}
      </div>
    </div>
  );
};

export default FieldWrapper;
