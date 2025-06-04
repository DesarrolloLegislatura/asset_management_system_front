import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useAsset } from "../../hooks/useAsset";
import { Search } from "lucide-react";
import { Input } from "../ui/input";

export const InventorySerch = ({
  value,
  onChange,
  onTypeassetChange,
  onAreaChange,
  onBuildingChange,
  disabled = false,
  onEditMode = false,
  error,
}) => {
  const { assets, loading } = useAsset();

  const [inputValue, setInputValue] = useState(value || "");
  const [isOpen, setIsOpen] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  const dropdownRef = useRef(null);

  // Actualizar el valor del input cuando cambia el prop value
  useEffect(() => {
    setInputValue(value || "");

    // En modo edición, marcar como inicializado después de cargar el valor
    if (onEditMode && value && !hasInitialized) {
      setHasInitialized(true);
    }
  }, [value, onEditMode, hasInitialized]);

  // Cerrar el dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Memorizar la función handleInputChange para evitar recrearla en cada render
  const handleInputChange = useCallback(
    (e) => {
      const newValue = e.target.value;
      setInputValue(newValue);

      // En modo edición, solo llamar onChange si ya se inicializó o si el usuario está escribiendo
      if (!onEditMode || hasInitialized) {
        onChange(newValue);
      }

      // La lógica para mostrar/ocultar el dropdown basado en el input
      if (newValue.trim()) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    },
    [onChange, onEditMode, hasInitialized]
  );

  // Memorizar la función handleSelectAsset
  const handleSelectAsset = useCallback(
    (asset) => {
      setInputValue(asset.inventory);
      onChange(asset.inventory, asset.id);

      // Solo actualizar los campos relacionados si no estamos en modo edición
      // o si el usuario explícitamente selecciona un nuevo asset
      if (!onEditMode || hasInitialized) {
        if (onTypeassetChange && asset.typeasset?.name) {
          onTypeassetChange(asset.typeasset.name);
        }
        if (onAreaChange && asset.area?.name) {
          onAreaChange(asset.area.name);
        }
        if (onBuildingChange && asset.building?.name) {
          onBuildingChange(asset.building.name);
        }
      }

      setIsOpen(false);
    },
    [
      onChange,
      onTypeassetChange,
      onAreaChange,
      onBuildingChange,
      onEditMode,
      hasInitialized,
    ]
  );

  // Memorizar las partes filtradas para evitar recalcularlas en cada render
  const filteredAsset = useMemo(() => {
    if (!inputValue || !assets.length) return [];
    return assets.filter(
      (asset) =>
        asset.inventory !== null &&
        asset.inventory.toString().includes(inputValue)
    );
  }, [inputValue, assets]);

  // Memorizar el contenido del dropdown para evitar recrearlo en cada render
  const dropdownContent = useMemo(() => {
    if (!isOpen) return null;

    if (filteredAsset.length > 0) {
      return (
        <div className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
          {filteredAsset.map((asset, index) => (
            <div
              key={index}
              className="px-4 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
              onClick={() => handleSelectAsset(asset)}
            >
              <div className="font-medium text-foreground">
                {asset.inventory}
              </div>
              {asset.typeasset?.name && (
                <div className="text-sm text-muted-foreground truncate">
                  {asset.typeasset.name}
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }

    if (inputValue.trim()) {
      return (
        <div className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-md shadow-lg p-4 text-center">
          <p className="text-muted-foreground">
            No se encontraron resultados. Puedes ingresar un nuevo Inventory.
          </p>
        </div>
      );
    }

    return null;
  }, [isOpen, filteredAsset, inputValue, handleSelectAsset]);

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center relative">
        <Input
          type="number"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => inputValue.trim() && setIsOpen(true)}
          placeholder="Ingresar Numero de Inventario"
          className={`w-full ${
            error ? "border-destructive focus:border-destructive" : ""
          }`}
          disabled={disabled}
          maxLength={10}
        />
        <div className="absolute right-3 text-muted-foreground">
          {loading ? (
            <div className="h-5 w-5 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
          ) : (
            <Search size={20} />
          )}
        </div>
      </div>

      {dropdownContent}

      <div className="flex justify-between items-center mt-1">
        {error && <p className="text-destructive text-xs">{error}</p>}
      </div>
    </div>
  );
};
