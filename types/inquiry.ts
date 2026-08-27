import { User } from "@/types/user";

export type InquiryStatus = "PENDING" | "ANSWERED";

export interface Inquiry {
    id: number;
    createdAt: string;
    updatedAt: string;

    title: string;
    content: string;
    answer: string | null;

    status: InquiryStatus;
    answeredAt: string | null;

    userId: number;
}

export type InquiryUser = Pick<User, "id" | "nickname" | "email">;

export interface InquiryUserItemType extends Inquiry {
    user: InquiryUser;
}

