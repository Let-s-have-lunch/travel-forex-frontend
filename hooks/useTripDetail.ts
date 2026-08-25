import { useState, useEffect, useCallback, useMemo } from "react";
import { Alert } from "react-native";
import tripApi from "@/api/user/tripApi";
import tripExpenseApi from "@/api/user/tripExpenseApi";
import walletApi from "@/api/user/walletApi";
import { Trip } from "@/types/trip";
import { TripExpense, TripExpenseSummary, ExpenseCategory } from "@/types/tripExpense";
import { CATEGORY_INFO } from "@/constants/expenseConstants";

export function useTripDetail(tripId: string | undefined) {
    const [trip, setTrip] = useState<Trip | null>(null);
    const [expenses, setExpenses] = useState<TripExpense[]>([]);
    const [wallets, setWallets] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadData = useCallback(async () => {
        if (!tripId) return;
        setIsLoading(true);
        try {
            const numericId = Number(tripId);
            const [tripData, expensesData, walletList] = await Promise.all([
                tripApi.getTripById(numericId),
                tripExpenseApi.fetchTripExpenseList(numericId, 1, 100),
                walletApi.getMyWallets(),
            ]);

            setTrip(tripData);
            setExpenses(expensesData.list || []);
            setWallets(walletList || []);
        } catch (error) {
            console.error("데이터 로드 실패:", error);
            Alert.alert("오류", "데이터를 불러오는데 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    }, [tripId]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const currentWalletId = useMemo(() => {
        return wallets.find(w => w.currency === trip?.currency)?.id ?? null;
    }, [trip, wallets]);

    const totalExpenseKrw = useMemo(() => {
        return expenses.reduce((sum, exp) => sum + (exp.convertedKrwAmount || 0), 0);
    }, [expenses]);

    const expenseSummary = useMemo<TripExpenseSummary[]>(() => {
        const summaryMap = { FOOD: 0, TRANSPORT: 0, SHOPPING: 0, OTHER: 0 };
        expenses.forEach(exp => {
            if (exp.category)
                summaryMap[exp.category as ExpenseCategory] += exp.convertedKrwAmount || 0;
        });

        return (Object.keys(summaryMap) as ExpenseCategory[])
            .map(category => {
                const amount = summaryMap[category];
                const percentage = totalExpenseKrw > 0 ? (amount / totalExpenseKrw) * 100 : 0;
                return {
                    category,
                    ...CATEGORY_INFO[category],
                    amount,
                    percentage: Math.round(percentage),
                };
            })
            .sort((a, b) => b.amount - a.amount);
    }, [expenses, totalExpenseKrw]);

    return {
        trip,
        isLoading,
        currentWalletId,
        totalExpenseKrw,
        expenseSummary,
        reloadData: loadData,
    };
}
