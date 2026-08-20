import React, { useId } from "react";

// 원본 그래프 모양에 은은한 그라데이션 영역을 추가한 컴포넌트
const GradientExchangeChart = ({ pathD, color }: { pathD: string; color: string }) => {
    const gradientId = useId();
    // 선 경로를 하단 모서리(230, 44와 10, 44)로 닫아주어 그라데이션 영역 형성
    const fillPathD = `${pathD} L 230 44 L 10 44 Z`;

    return (
        <div
            style={{
                width: "100%",
                height: "44px",
                marginTop: "6px",
                display: "flex",
                justifyContent: "flex-end",
            }}>
            <svg width="240" height="44" viewBox="0 0 240 44" fill="none">
                <defs>
                    <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.22" />
                        <stop offset="100%" stopColor={color} stopOpacity="0.0" />
                    </linearGradient>
                </defs>

                {/* 아래쪽 은은한 그라데이션 채우기 */}
                <path d={fillPathD} fill={`url(#${gradientId})`} />

                {/* 상단 그래프 선 */}
                <path
                    d={pathD}
                    stroke={color}
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    );
};

export default function ForexPage(): React.JSX.Element {
    const perfectRates = [
        {
            symbol: "USD/KRW",
            price: "1,376.00",
            change: "+0.42%",
            isUp: true,
            color: "#00a36c",
            pathD: "M 10 34 L 22 33 L 32 35 L 44 31 L 54 32 L 66 27 L 76 30 L 88 23 L 98 25 L 110 19 L 120 22 L 132 18 L 142 20 L 154 16 L 164 18 L 176 13 L 186 16 L 198 9 L 208 14 L 220 11 L 230 15",
        },
        {
            symbol: "JPY/KRW",
            price: "9.25",
            change: "-0.18%",
            isUp: false,
            color: "#ff4d4d",
            pathD: "M 10 30 L 22 28 L 32 25 L 44 27 L 54 23 L 66 26 L 76 21 L 88 15 L 98 22 L 110 26 L 120 21 L 132 17 L 142 14 L 154 19 L 164 17 L 176 21 L 186 18 L 198 17 L 208 21 L 220 19 L 230 22",
        },
        {
            symbol: "EUR/KRW",
            price: "1,602.24",
            change: "+0.23%",
            isUp: true,
            color: "#00a36c",
            pathD: "M 10 32 L 22 31 L 32 28 L 44 29 L 54 26 L 66 28 L 76 23 L 88 20 L 98 22 L 110 15 L 120 17 L 132 12 L 142 15 L 154 13 L 164 16 L 176 11 L 186 15 L 198 12 L 208 14 L 220 12 L 230 16",
        },
    ];

    return (
        <div
            style={{
                padding: "24px 16px",
                maxWidth: "360px",
                margin: "0 auto",
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}>
            <div style={{ marginBottom: "16px" }}>
                <span
                    style={{
                        backgroundColor: "#e6f3ed",
                        color: "#028a50",
                        padding: "6px 14px",
                        borderRadius: "20px",
                        fontSize: "15px",
                        fontWeight: "bold",
                        display: "inline-block",
                    }}>
                    8. 환율
                </span>
            </div>

            <div
                style={{
                    background: "#ffffff",
                    borderRadius: "24px",
                    padding: "24px 20px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                }}>
                {perfectRates.map((item, idx) => (
                    <div
                        key={item.symbol}
                        style={{ marginBottom: idx !== perfectRates.length - 1 ? "24px" : "0" }}>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}>
                            <span style={{ fontWeight: "bold", fontSize: "14px", color: "#111" }}>
                                {item.symbol}
                            </span>
                            <span
                                style={{ fontSize: "13px", fontWeight: "bold", color: item.color }}>
                                {item.isUp ? "▲" : "▼"} {item.change}
                            </span>
                        </div>

                        <div
                            style={{
                                fontSize: "16px",
                                fontWeight: "bold",
                                color: "#111",
                                marginTop: "2px",
                            }}>
                            {item.price}
                        </div>

                        <GradientExchangeChart pathD={item.pathD} color={item.color} />
                    </div>
                ))}

                <div
                    style={{
                        textAlign: "center",
                        fontSize: "12px",
                        color: "#999",
                        marginTop: "24px",
                        fontWeight: "500",
                    }}>
                    기준 시간: 2026.08.10 09:30
                </div>
            </div>
        </div>
    );
}
