import { AntDesign, Feather } from "@expo/vector-icons";

export const USER_NAV_LIST = [
    {
        name: "홈",
        path: "/",
        iconComponent: AntDesign,
        iconName: "home",
    },
    {
        name: "여행",
        path: "/travel",
        iconComponent: Feather,
        iconName: "map-pin",
    },
    {
        name: "환율",
        path: "/forex",
        iconComponent: Feather,
        iconName: "dollar-sign",
    },
    {
        name: "마이페이지",
        path: "/my-page",
        iconComponent: Feather,
        iconName: "user",
    },
];
