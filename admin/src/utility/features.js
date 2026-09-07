// The leading space in " Pet friendly" is preserved deliberately: existing
// documents store it that way, and the checkbox value must match exactly for
// `features.includes(...)` to mark it checked.
export const APARTMENT_FEATURES = [
  "Wifi",
  "Free parking",
  "Bazen",
  " Pet friendly",
  "Pogled na more",
  "Pogled na prirodu",
];
