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
  error,
}) => {
  const { assets, loading } = useAsset();

  const [inputValue, setInputValue] = useState(value || "");
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef(null);

  // Actualizar el valor del input cuando cambia el prop value
  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

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
      onChange(newValue);

      // La lógica para mostrar/ocultar el dropdown basado en el input
      if (newValue.trim()) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    },
    [onChange]
  );

  // Memorizar la función handleSelectAsset
  const handleSelectAsset = useCallback(
    (asset) => {
      setInputValue(asset.inventory);
      onChange(asset.inventory, asset.id);
      if (onTypeassetChange && asset.typeasset?.name) {
        onTypeassetChange(asset.typeasset.name);
      }
      if (onAreaChange && asset.area?.name) {
        onAreaChange(asset.area.name);
      }
      if (onBuildingChange && asset.building?.name) {
        onBuildingChange(asset.building.name);
      }
      setIsOpen(false);
    },
    [onChange, onTypeassetChange, onAreaChange, onBuildingChange]
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
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {filteredAsset.map((asset, index) => (
            <div
              key={index}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSelectAsset(asset)}
            >
              <div className="font-medium">{asset.inventory}</div>
              {asset.typeasset?.name && (
                <div className="text-sm text-gray-500 truncate">
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
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-4 text-center">
          <p className="text-gray-500">
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
            error ? "border-red-500" : "border-gray-300"
          } rounded-md`}
          disabled={disabled}
          maxLength={10}
        />
        <div className="absolute right-3 text-gray-400">
          {loading ? (
            <div className="h-5 w-5 border-t-2 border-b-2 border-gray-500 rounded-full animate-spin"></div>
          ) : (
            <Search size={20} />
          )}
        </div>
      </div>

      {dropdownContent}

      <div className="flex justify-between items-center mt-1">
        {error && <p className="text-red-500 text-xs">{error}</p>}
      </div>
    </div>
  );
};
