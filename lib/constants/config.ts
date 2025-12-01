export const APP_CONFIG = {
  NAME: "TabooTalks",
  DESCRIPTION: "Connect through meaningful conversations",
  INITIAL_CREDITS: 10,
  COLORS: {
    PRIMARY: "#ff2e2e",
    SECONDARY: "#5e17eb",
  },
  CREDIT_PACKAGES: [
    { id: 1, credits: 30, price: 9.99, label: "Starter" },
    { id: 2, credits: 100, price: 19.99, label: "Popular", badge: "Best Value" },
    { id: 3, credits: 350, price: 39.99, label: "Premium" },
  ],
  COSTS: {
    MESSAGE: 1,
    SEND_PHOTO: 15,
    REQUEST_PHOTO: 25,
  },
} as const;
