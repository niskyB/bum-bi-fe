import { FunctionComponent, PropsWithChildren } from "react";
import { FieldValues, FormProvider, UseFormReturn } from "react-hook-form";

interface FormWrapperProps<T extends FieldValues = any, V = any>
  extends PropsWithChildren {
  methods: UseFormReturn<T, V>;
}

const FormWrapper: FunctionComponent<FormWrapperProps> = ({
  methods,
  children,
}) => {
  return <FormProvider {...methods}>{children}</FormProvider>;
};

export default FormWrapper;
