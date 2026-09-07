export const queryKeys = {
  apartments: {
    all: ["apartments"],
    detail: (id) => ["apartments", id],
  },
  priceLists: {
    all: ["priceLists"],
    detail: (id) => ["priceLists", id],
  },
  reservations: ["reservations"],
  messages: ["messages"],
};
