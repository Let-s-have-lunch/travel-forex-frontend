import { useRouter } from "expo-router";
import { useState } from "react";
import { InquiryUserItemType } from "@/types/inquiry";

function UserInquiryPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [inquiries, setInquiries] = useState<InquiryUserItemType[]>([]);

    return <></>
}