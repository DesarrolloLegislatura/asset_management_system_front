// Declaración de acompañamiento (no autogenerada): tipa el borde de
// card.jsx sin migrarlo a TypeScript. Sin esta declaración, la inferencia
// de TS sobre el .jsx (allowJs, checkJs: false) marca `className` como
// prop requerida —no tiene default en la desestructuración—, rompiendo a
// cualquier consumidor en TSX que no la pase explícitamente.
// Si cambia la firma exportada en el .jsx, actualizar este archivo en el
// mismo cambio.
import type { ComponentProps, JSX } from "react";

type DivProps = ComponentProps<"div">;

export declare function Card(props: DivProps): JSX.Element;
export declare function CardHeader(props: DivProps): JSX.Element;
export declare function CardFooter(props: DivProps): JSX.Element;
export declare function CardTitle(props: DivProps): JSX.Element;
export declare function CardAction(props: DivProps): JSX.Element;
export declare function CardDescription(props: DivProps): JSX.Element;
export declare function CardContent(props: DivProps): JSX.Element;
