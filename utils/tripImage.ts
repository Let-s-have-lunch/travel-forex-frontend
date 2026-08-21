import { CurrencyCode } from "@/types/trip";

export const getTripThumbnail = (currency: CurrencyCode) => {
    switch (currency) {
        case "JPY":
            return require("@/assets/images/trips/japan.png");
        case "USD":
            return require("@/assets/images/trips/usa.png");
        case "EUR":
            return require("@/assets/images/trips/europe.png");
        case "GBP":
            return require("@/assets/images/trips/uk.png");
        case "CNY":
            return require("@/assets/images/trips/china.png");
        case "KRW":
            return require("@/assets/images/trips/korea.png");
        default:
            return require("@/assets/images/trips/default.png");
    }
};
