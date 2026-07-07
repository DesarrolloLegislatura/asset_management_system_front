// Declaración de acompañamiento (no autogenerada): tipa el borde de
// form.jsx sin migrarlo a TypeScript. Ver button.d.ts para el porqué.
// Form/FormField son re-exports directos de react-hook-form (FormProvider,
// Controller): se tipan igual que el original. El resto son wrappers simples
// sobre elementos HTML.
import type { ComponentProps, JSX, ReactNode } from "react";
import type { Controller, FormProvider } from "react-hook-form";

export declare const Form: typeof FormProvider;
export declare const FormField: typeof Controller;

export declare function FormItem(props: ComponentProps<"div">): JSX.Element;
export declare function FormLabel(props: ComponentProps<"label">): JSX.Element;
export declare function FormControl(props: {
  children: ReactNode;
}): JSX.Element;
export declare function FormDescription(
  props: ComponentProps<"p">
): JSX.Element;
export declare function FormMessage(props: ComponentProps<"p">): JSX.Element;
