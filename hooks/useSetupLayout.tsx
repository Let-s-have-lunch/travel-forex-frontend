import { useLayoutStore } from "@/stores/layout/useLayoutStore";
import { useCallback } from "react";
import { useFocusEffect } from "expo-router";

export const useSetupLayout = ({
    showMainFooter,
}: {
    showMainFooter?: boolean;
}) => {
    const setLayout = useLayoutStore(state => state.setLayout);

    useFocusEffect(
        useCallback(() => {
            setLayout({
                ...(showMainFooter !== undefined && { showMainFooter }),
            });

            // 💡 화면에서 나갈 때(Clean-up): 앱의 원래 기본값으로 원상복구!
            return () => {
                setLayout({
                    showMainFooter: true,
                });
            };
        }, [setLayout, showMainFooter]),
    );
};
