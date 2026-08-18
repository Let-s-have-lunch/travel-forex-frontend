import { useEffect } from "react";
import { useRouter } from "expo-router";
import LoadingIndicator from "@/components/common/loading/Loading";
import { useAuthStore } from "@/stores/auth/useAuthStore";

function AdminLayout() {
    const { user, isInitialized } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (isInitialized) {
            if (!user || user.role !== "ADMIN") {
                router.replace("/");
            }
        }
    }, [isInitialized, user, router]);

    if (!isInitialized) {
        return <LoadingIndicator fullScreen={true} />;
    }

    if (!user || user.role !== "ADMIN") {
        return null;
    }

    return <></>;
}

export default AdminLayout;
