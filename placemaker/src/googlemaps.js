import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

setOptions({
  key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  v: "weekly",
});

export async function loadPlacesLibrary() {
  return await importLibrary("places");
}

/*console.log("Google Maps ENV CHECK", {
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
});*/