import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "./input";
import { cn } from "@/utils/utils";
import PropTypes from "prop-types";

export function SearchableSelect({
  options = [],
  value,
  onChange,
  placeholder = "Buscar...",
  disabled = false,
  loading = false,
  emptyMessage = "No se encontraron resultados.",
}) {
  const [searchText, setSearchText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedOption = useMemo(
    () => options.find((opt) => String(opt.id) === String(value)),
    [options, value],
  );

  useEffect(() => {
    if (selectedOption) {
      setSearchText(selectedOption.name);
    } else if (!value) {
      setSearchText("");
    }
  }, [selectedOption, value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        if (selectedOption) {
          setSearchText(selectedOption.name);
        } else if (!value) {
          setSearchText("");
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedOption, value]);

  const filteredOptions = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return options;
    return options.filter((opt) =>
      opt.name.toLowerCase().includes(query),
    );
  }, [options, searchText]);

  const handleInputChange = useCallback(
    (e) => {
      const text = e.target.value;
      setSearchText(text);
      setIsOpen(true);

      if (!text.trim()) {
        onChange("");
      }
    },
    [onChange],
  );

  const handleSelect = useCallback(
    (option) => {
      onChange(String(option.id));
      setSearchText(option.name);
      setIsOpen(false);
    },
    [onChange],
  );

  const handleFocus = () => {
    if (!disabled && !loading) {
      setIsOpen(true);
    }
  };

  const showDropdown = isOpen && !disabled && !loading;

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative">
        <Input
          type="text"
          value={searchText}
          onChange={handleInputChange}
          onFocus={handleFocus}
          placeholder={loading ? "Cargando..." : placeholder}
          disabled={disabled || loading}
          className="w-full pr-9"
          autoComplete="off"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
          {loading ? (
            <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </div>
      </div>

      {showDropdown && (
        <div
          className={cn(
            "absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-y-auto",
          )}
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                className={cn(
                  "w-full px-4 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground transition-colors",
                  String(option.id) === String(value) && "bg-accent/50",
                )}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(option)}
              >
                {option.name}
              </button>
            ))
          ) : (
            <p className="px-4 py-3 text-sm text-muted-foreground text-center">
              {emptyMessage}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

SearchableSelect.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
    }),
  ),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  emptyMessage: PropTypes.string,
};
