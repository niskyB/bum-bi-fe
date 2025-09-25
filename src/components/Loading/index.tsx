import { FunctionComponent, HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface LoadingProps extends HTMLAttributes<HTMLDivElement> {
  loadingText?: string;
  className?: string;
}

const Loading: FunctionComponent<LoadingProps> = ({
  loadingText = "Loading...",
  className,
  ...rest
}) => {
  return (
    <div
      className={twMerge(
        "inline-block h-8 w-8 animate-spin text-white rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]",
        className
      )}
      role="status"
      {...rest}
    >
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)] text-white"></span>
    </div>
  );
};

export default Loading;
