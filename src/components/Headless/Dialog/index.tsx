import { twMerge } from "tailwind-merge";
import {
  Dialog as HeadlessDialog,
  DialogPanel as HeadlessDialogPanel,
  DialogTitle as HeadlessDialogTitle,
  Description as HeadlessDescription,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment, createContext, useContext, useRef, useState } from "react";

type Size = "sm" | "md" | "lg" | "llg" | "xl";
type ExtractProps<T> = T extends React.ComponentType<infer P> ? P : T;

const dialogContext = createContext<{
  open: boolean;
  zoom: boolean;
  size: Size;
}>({
  open: false,
  zoom: false,
  size: "md",
});

function Dialog({
  children,
  className,
  as = "div",
  open = false,
  onClose,
  staticBackdrop,
  size = "md",
  ...props
}: ExtractProps<typeof HeadlessDialog> & {
  size?: Size;
  staticBackdrop?: boolean;
}) {
  const focusElement = useRef<HTMLElement | null>(null);
  const [zoom, setZoom] = useState(false);

  return (
    <dialogContext.Provider
      value={{
        open: open,
        zoom: zoom,
        size: size,
      }}
    >
      <Transition appear as={Fragment} show={open}>
        <HeadlessDialog
          as={as}
          onClose={(value) => {
            if (!staticBackdrop) {
              return onClose(value);
            } else {
              setZoom(true);
              setTimeout(() => {
                setZoom(false);
              }, 300);
            }
          }}
          initialFocus={focusElement}
          className={twMerge(["relative z-[60]", className])}
          {...props}
        >
          {children}
        </HeadlessDialog>
      </Transition>
    </dialogContext.Provider>
  );
}

Dialog.Panel = ({
  children,
  className,
  as = "div",
  ...props
}: ExtractProps<typeof HeadlessDialog.Panel> & {
  size?: Size;
}) => {
  const dialog = useContext(dialogContext);
  return (
    <>
      <TransitionChild
        as="div"
        enter="ease-in-out duration-500"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in-out duration-[400ms]"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        className="fixed inset-0 bg-black/60"
        aria-hidden="true"
      />
      <TransitionChild
        as="div"
        enter="ease-in-out duration-500"
        enterFrom="opacity-0 -mt-16"
        enterTo="opacity-100 mt-16"
        leave="ease-in-out duration-[400ms]"
        leaveFrom="opacity-100 mt-16"
        leaveTo="opacity-0 -mt-16"
        className="fixed inset-0 flex justify-center"
      >
        <HeadlessDialogPanel
          as={as}
          className={twMerge([
            "w-[90%] mx-auto my-auto bg-white relative rounded-md shadow-md transition-transform dark:bg-darkmode-600",
            dialog.size == "md" && "sm:w-[460px]",
            dialog.size == "sm" && "sm:w-[300px]",
            dialog.size == "lg" && "sm:w-[600px]",
            dialog.size == "llg" && "sm:w-[720px]",
            dialog.size == "xl" && "sm:w-[720px] lg:w-[900px]",
            dialog.zoom && "scale-105",
            className,
          ])}
          {...props}
        >
          {children}
        </HeadlessDialogPanel>
      </TransitionChild>
    </>
  );
};

Dialog.Title = ({
  children,
  className,
  as = "div",
  ...props
}: ExtractProps<typeof HeadlessDialogTitle>) => {
  return (
    <HeadlessDialogTitle
      as={as}
      className={twMerge([
        "flex items-center px-5 py-3 border-b border-slate-200/60 dark:border-darkmode-400",
        className,
      ])}
      {...props}
    >
      {children}
    </HeadlessDialogTitle>
  );
};

Dialog.Description = ({
  children,
  className,
  as = "div",
  ...props
}: ExtractProps<typeof HeadlessDescription>) => {
  return (
    <HeadlessDescription
      as={as}
      className={twMerge(["p-5", className])}
      {...props}
    >
      {children}
    </HeadlessDescription>
  );
};

Dialog.Footer = <C extends React.ElementType = "div">({
  children,
  className,
  as,
  ...props
}: {
  as?: C;
} & React.PropsWithChildren &
  React.ComponentPropsWithoutRef<C>) => {
  const Component = as || "div";

  return (
    <Component
      className={twMerge([
        "px-5 py-3 text-right border-t border-slate-200/60 dark:border-darkmode-400",
        className,
      ])}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Dialog;
