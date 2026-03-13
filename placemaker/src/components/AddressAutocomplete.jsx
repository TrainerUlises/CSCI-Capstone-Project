import { useEffect, useRef, useState } from "react";
import { loadPlacesLibrary } from "../googlemaps";
import "./components.css";

function AddressAutocomplete({
  onAddressSelected,
  placeholder = "Enter your address...",
}) {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const placesLibRef = useRef(null);
  const sessionTokenRef = useRef(null);
  const debounceRef = useRef(null);
  const blurTimeoutRef = useRef(null);

  useEffect(() => {
    async function init() {
      const placesLib = await loadPlacesLibrary();
      placesLibRef.current = placesLib;
      sessionTokenRef.current = new placesLib.AutocompleteSessionToken();
    }

    init();

    return () => {
      clearTimeout(debounceRef.current);
      clearTimeout(blurTimeoutRef.current);
    };
  }, []);

  async function fetchSuggestions(inputValue) {
    const placesLib = placesLibRef.current;
    if (!placesLib || !inputValue.trim()) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    try {
      const { AutocompleteSuggestion } = placesLib;

      const response = await AutocompleteSuggestion.fetchAutocompleteSuggestions({
        input: inputValue,
        sessionToken: sessionTokenRef.current,
        includedPrimaryTypes: ["street_address"],
      });

      const nextSuggestions = response?.suggestions || [];
      setSuggestions(nextSuggestions);
      setIsOpen(nextSuggestions.length > 0);
    } catch (error) {
      console.error("Autocomplete fetch failed:", error);
      setSuggestions([]);
      setIsOpen(false);
    }
  }

  function handleChange(e) {
    const nextValue = e.target.value;
    setValue(nextValue);

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(nextValue);
    }, 250);
  }

  async function handleSelect(suggestion) {
    try {
      const place = suggestion.placePrediction.toPlace();

      await place.fetchFields({
        fields: ["formattedAddress", "location", "addressComponents", "id"],
      });

      const getComponent = (type) =>
        place.addressComponents?.find((c) => c.types.includes(type))?.longText || "";

      const locationData = {
        formattedAddress: place.formattedAddress || "",
        placeId: place.id || "",
        lat: place.location?.lat?.() ?? null,
        lng: place.location?.lng?.() ?? null,
        zipCode: getComponent("postal_code"),
        neighborhood: getComponent("neighborhood"),
        locality: getComponent("locality"),
        adminAreaLevel1: getComponent("administrative_area_level_1"),
    };

      setValue(locationData.formattedAddress);
      setSuggestions([]);
      setIsOpen(false);

      if (onAddressSelected) {
        onAddressSelected(locationData);
      }

      if (placesLibRef.current) {
        sessionTokenRef.current = new placesLibRef.current.AutocompleteSessionToken();
      }
    } catch (error) {
      console.error("Place selection failed:", error);
    }
  }

  function handleFocus() {
    if (suggestions.length > 0) {
      setIsOpen(true);
    }
  }

  return (
    <div className="addressAutocomplete">
      <input
        type="text"
        className="form__input"
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        autoComplete="off"
        required
      />

      {isOpen && (
        <div className="addressAutocomplete__dropdown">
          {suggestions.map((suggestion, index) => {
            const prediction = suggestion.placePrediction;
            const mainText =
              prediction?.text?.toString?.() ||
              prediction?.mainText?.text ||
              "";
            const secondaryText = prediction?.secondaryText?.text || "";

            return (
              <button
                key={`${prediction?.placeId || mainText}-${index}`}
                type="button"
                className="addressAutocomplete__item"
                onMouseDown={() => handleSelect(suggestion)}
              >
                <span className="addressAutocomplete__main">{mainText}</span>
                {secondaryText && (
                  <span className="addressAutocomplete__secondary">
                    {secondaryText}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AddressAutocomplete;