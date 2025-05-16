import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useAsset } from "../../hooks/useAsset";
import { Search } from "lucide-react";

export const InventorySerch = ({
  value,
  onChange,
  onDescriptionChange,
  disabled = false,
  error,
}) => {
  const [inputValue, setInputValue] = useState(value || "");
  const [isOpen, setIsOpen] = useState(false);
  const { assets, loading } = useAsset();
  const dropdownRef = useRef(null);

  //los assets vienen de la api y son un array de objetos,
  console.log("los assets", assets);

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

  // Memorizar la función handleSelectPart
  const handleSelectPart = useCallback(
    (part) => {
      setInputValue(part.inventory);
      onChange(part.inventory);
      if (onDescriptionChange && part.typeasset?.name) {
        onDescriptionChange(part.typeasset.name);
      }
      setIsOpen(false);
    },
    [onChange, onDescriptionChange]
  );

  // Memorizar las partes filtradas para evitar recalcularlas en cada render
  const filteredInventory = useMemo(() => {
    if (!inputValue.trim() || !assets.length) return [];

    // TODO: Verificar por que algunos assets.inventory son null, xq funciona bien cuando agrego la restriccion de !== null
    return assets.filter(
      (asset) =>
        asset.inventory !== null &&
        asset.inventory.toString().includes(inputValue)
    );
  }, [inputValue, assets]);

  // Memorizar el contenido del dropdown para evitar recrearlo en cada render
  const dropdownContent = useMemo(() => {
    if (!isOpen) return null;

    if (filteredInventory.length > 0) {
      return (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {filteredInventory.map((part, index) => (
            <div
              key={index}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSelectPart(part)}
            >
              <div className="font-medium">{part.inventory}</div>
              {part.typeasset?.name && (
                <div className="text-sm text-gray-500 truncate">
                  {part.typeasset.name}
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
  }, [isOpen, filteredInventory, inputValue, handleSelectPart]);

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center relative">
        <input
          type="number"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => inputValue.trim() && setIsOpen(true)}
          placeholder="Ingresar Numero de Inventario"
          className={`w-full px-4 py-2 pr-10 border ${
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
        <p className="text-xs text-gray-500 ml-auto">{inputValue.length}/10</p>
      </div>
    </div>
  );
};
