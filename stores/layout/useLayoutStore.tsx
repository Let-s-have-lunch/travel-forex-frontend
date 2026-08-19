import { create } from "zustand";

interface LayoutState {
    showMainFooter: boolean;
    setLayout: (config: Partial<Omit<LayoutState, "setLayout">>) => void;
}

export const useLayoutStore = create<LayoutState>(set => ({
    showMainFooter: true, // 기본적으로 푸터 노출

    setLayout: config => set(state => ({ ...state, ...config })),
}));
