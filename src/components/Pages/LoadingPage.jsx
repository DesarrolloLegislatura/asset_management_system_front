export const LoadingPage = ({ mensaje = "Cargando" }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="text-center flex flex-col items-center justify-center">
        <div className="relative">
          <img
            src="/assets/images/chini.png"
            alt="Cargando"
            className="h-24 w-24 animate-spin"
          />
        </div>
        <div className="text-center space-y-2">
          <p className="text-xl text-foreground font-semibold animate-pulse">
            {mensaje}
          </p>
        </div>
      </div>
    </div>
  );
};
