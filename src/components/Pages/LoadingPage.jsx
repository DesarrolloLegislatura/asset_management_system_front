export const LoadingPage = ({ mensaje = "Cargando" }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="text-center flex flex-col items-center justify-center gap-4">
        <div className="h-24 w-24 rounded-full border-4 border-t-primary border-slate-200 dark:border-slate-700 animate-spin" />
        <div className="text-center space-y-2">
          <p className="text-xl text-foreground font-semibold animate-pulse">
            {mensaje}
          </p>
        </div>
      </div>
    </div>
  );
};
