import api from "@/api/axiosInstance"; // 프로젝트 내 axios 인스턴스 경로
import { CurrencyCode } from "@/types/trip";

// 지갑 응답 인터페이스
export interface WalletItem {
    id: number;
    userId: number;
    currency: CurrencyCode;
    balance: number;
    createdAt?: string;
    updatedAt?: string;
}

interface WalletListResponse {
    message: string;
    data: WalletItem[];
}

const walletApi = {
    getMyWallets: async (): Promise<WalletItem[]> => {
        const response = await api.get<WalletListResponse>("/wallets");
        return response.data.data;
    },
};

export default walletApi;
