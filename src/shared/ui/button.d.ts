// Declaración de acompañamiento (no autogenerada): tipa el borde de
// button.jsx sin migrarlo a TypeScript. Sin esta declaración, la inferencia
// de TS sobre el .jsx (allowJs, checkJs: false) marca `variant`/`size` como
// props requeridas —no tienen default en la desestructuración—, rompiendo a
// cualquier consumidor en TSX que no las pase explícitamente.
// Si cambia la firma exportada en el .jsx, actualizar este archivo en el
// mismo cambio.
import type { ComponentProps, JSX } from "react";

type ButtonVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link";
type ButtonSize = "default" | "sm" | "lg" | "icon";

export interface ButtonProps extends ComponentProps<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

export declare function Button(props: ButtonProps): JSX.Element;
