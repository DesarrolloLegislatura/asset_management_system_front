// Declaración de acompañamiento (no autogenerada): tipa el borde de
// badge.jsx sin migrarlo a TypeScript. Ver button.d.ts para el porqué.
import type { ComponentProps, JSX } from "react";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

export interface BadgeProps extends ComponentProps<"span"> {
  variant?: BadgeVariant;
  asChild?: boolean;
}

export declare function Badge(props: BadgeProps): JSX.Element;
