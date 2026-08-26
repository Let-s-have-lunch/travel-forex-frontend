import React, { useEffect, useId, useState } from "react";

// ========================================
// 환율 그래프
// ========================================
const GradientExchangeChart = ({ pathD, color }: { pathD: string; color: string }) => {
    const gradientId = useId();

    const fillPathD = `${pathD} L 230 44 L 10 44 Z`;

    return (
        <div
            style={{
                width: "100%",
                height: "52px",
                marginTop: "4px",
            }}>
            <svg
                width="100%"
                height="52"
                viewBox="0 0 240 44"
                preserveAspectRatio="none"
                fill="none">
                <defs>
                    <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.28" />

                        <stop offset="60%" stopColor={color} stopOpacity="0.08" />

                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* 그래프 아래 영역 */}
                <path d={fillPathD} fill={`url(#${gradientId})`} />

                {/* 그래프 선 */}
                <path
                    d={pathD}
                    stroke={color}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    );
};

// ========================================
// 환율 페이지
// ========================================
export default function ForexPage(): React.JSX.Element {
    const [activeTab, setActiveTab] = useState<string>("환율");

    const [apiRates, setApiRates] = useState<{
        [key: string]: number;
    } | null>(null);

    const [lastUpdate, setLastUpdate] = useState<string>("");

    // ========================================
    // 현재 시간
    // ========================================
    const getCurrentFormattedTime = () => {
        const now = new Date();

        const year = now.getFullYear();

        const month = String(now.getMonth() + 1).padStart(2, "0");

        const date = String(now.getDate()).padStart(2, "0");

        const hours = String(now.getHours()).padStart(2, "0");

        const minutes = String(now.getMinutes()).padStart(2, "0");

        return `${year}.${month}.${date} ${hours}:${minutes}`;
    };

    // ========================================
    // 환율 API
    // ========================================
    useEffect(() => {
        const updateTimeAndData = () => {
            setLastUpdate(getCurrentFormattedTime());
        };

        // 최초 실행
        updateTimeAndData();

        const apiKey = process.env.REACT_APP_EXCHANGE_RATE_API_KEY;

        if (apiKey) {
            fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`)
                .then(res => res.json())
                .then(data => {
                    if (data.result === "success") {
                        setApiRates(data.conversion_rates);
                    }
                })
                .catch(err => console.error("API 호출 실패:", err));
        }

        // 1분마다 시간 갱신
        const timer = setInterval(() => {
            updateTimeAndData();
        }, 60000);

        return () => clearInterval(timer);
    }, []);

    // ========================================
    // 환율 계산
    // ========================================

    const usdKrw = apiRates?.KRW
        ? apiRates.KRW.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
          })
        : "1,376.00";

    const jpyKrw =
        apiRates?.KRW && apiRates?.JPY ? ((apiRates.KRW / apiRates.JPY) * 100).toFixed(2) : "9.25";

    const eurKrw =
        apiRates?.KRW && apiRates?.EUR
            ? (apiRates.KRW / apiRates.EUR).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
              })
            : "1,602.24";

    // ========================================
    // 환율 데이터
    // ========================================

    const ratesData = [
        {
            symbol: "USD/KRW",
            price: usdKrw,
            change: "+0.42%",
            isUp: true,
            color: "#00a36c",

            pathD: "M 10 36 L 16 34 L 22 36 L 28 34 L 34 35 L 40 31 L 46 33 L 52 28 L 58 31 L 64 26 L 70 29 L 76 24 L 82 20 L 88 23 L 94 25 L 100 27 L 106 24 L 112 21 L 118 23 L 124 19 L 130 20 L 136 17 L 142 21 L 148 19 L 154 20 L 160 18 L 166 14 L 172 17 L 178 17 L 184 15 L 190 10 L 196 13 L 202 12 L 208 15 L 214 17 L 220 18 L 226 21 L 230 20",
        },

        {
            symbol: "JPY/KRW",
            price: jpyKrw,
            change: "-0.18%",
            isUp: false,
            color: "#ff4d4d",

            pathD: "M 10 35 L 16 34 L 22 32 L 28 34 L 34 31 L 40 33 L 46 29 L 52 35 L 58 28 L 64 24 L 70 20 L 76 23 L 82 26 L 88 24 L 94 29 L 100 32 L 106 28 L 112 25 L 118 21 L 124 19 L 130 22 L 136 21 L 142 24 L 148 22 L 154 26 L 160 21 L 166 22 L 172 26 L 178 22 L 184 21 L 190 20 L 196 23 L 202 21 L 208 26 L 214 27 L 220 28 L 226 31 L 230 30",
        },

        {
            symbol: "EUR/KRW",
            price: eurKrw,
            change: "+0.23%",
            isUp: true,
            color: "#00a36c",

            pathD: "M 10 36 L 16 35 L 22 33 L 28 34 L 34 32 L 40 33 L 46 29 L 52 26 L 58 23 L 64 26 L 70 28 L 76 29 L 82 25 L 88 31 L 94 28 L 100 24 L 106 20 L 112 21 L 118 19 L 124 23 L 130 21 L 136 21 L 142 24 L 148 19 L 154 21 L 160 20 L 166 23 L 172 21 L 178 20 L 184 23 L 190 21 L 196 22 L 202 25 L 208 24 L 214 27 L 220 26 L 226 28 L 230 27",
        },
    ];

    return (
        <div
            style={{
                position: "relative",

                // ★ 화면 전체 사용
                width: "100%",

                minHeight: "100vh",

                // ★ 모바일 좌우 여백
                padding: "28px 16px 84px",

                boxSizing: "border-box",

                backgroundColor: "#f7f9f8",

                fontFamily:
                    '-apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Pretendard", Roboto, sans-serif',
            }}>

            {/* ====================================
                메인 환율 카드
            ==================================== */}

            <div
                style={{
                    width: "100%",

                    boxSizing: "border-box",

                    background: "#ffffff",

                    borderRadius: "28px",

                    // ★ 기존보다 좌우 공간 확보
                    padding: "26px 20px 20px",

                    boxShadow: "0 8px 24px rgba(0,0,0,0.03)",
                }}>
                {ratesData.map((item, idx) => (
                    <div
                        key={item.symbol}
                        style={{
                            // ★ 각 통화 사이 간격
                            marginBottom: idx !== ratesData.length - 1 ? "24px" : "0",
                        }}>
                        {/* ====================
                                통화명 + 등락률
                            ==================== */}

                        <div
                            style={{
                                display: "flex",

                                justifyContent: "space-between",

                                alignItems: "center",

                                width: "100%",
                            }}>
                            <span
                                style={{
                                    fontWeight: "700",

                                    fontSize: "13px",

                                    color: "#222",
                                }}>
                                {item.symbol}
                            </span>

                            <span
                                style={{
                                    fontSize: "12px",

                                    fontWeight: "700",

                                    color: item.color,

                                    whiteSpace: "nowrap",
                                }}>
                                {item.isUp ? "▲" : "▼"} {item.change}
                            </span>
                        </div>

                        {/* ====================
                                환율 가격
                            ==================== */}

                        <div
                            style={{
                                fontSize: "15px",

                                fontWeight: "800",

                                color: "#111",

                                marginTop: "4px",
                            }}>
                            {item.price}
                        </div>

                        {/* ====================
                                그래프
                            ==================== */}

                        <GradientExchangeChart pathD={item.pathD} color={item.color} />
                    </div>
                ))}

                {/* ====================================
                    기준 시간
                ==================================== */}

                <div
                    style={{
                        textAlign: "center",

                        fontSize: "11px",

                        color: "#aaaaaa",

                        fontWeight: "500",

                        marginTop: "18px",
                    }}>
                    기준 시간: {lastUpdate}
                </div>
            </div>

            {/* ====================================
                하단 탭바
            ==================================== */}

            <div
                style={{
                    position: "fixed",

                    bottom: 0,

                    left: 0,

                    // ★ 화면 전체 너비
                    width: "100%",

                    height: "64px",

                    backgroundColor: "#ffffff",

                    borderTop: "1px solid #f0f0f0",

                    display: "flex",

                    justifyContent: "space-around",

                    alignItems: "center",

                    zIndex: 100,
                }}>
                {[
                    {
                        id: "홈",
                        label: "홈",

                        path: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z",
                    },

                    {
                        id: "여행",
                        label: "여행",

                        path: "M20 6h-3V4c0-1.11-.89-2-2-2h-6c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z",
                    },

                    {
                        id: "환율",
                        label: "환율",

                        path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 16h-2v-1c-1.29-.28-2.26-1.19-2.42-2.5h1.9c.14.54.67.9 1.52.9 1.1 0 1.5-.54 1.5-1.1 0-1.63-2.9-1.06-2.9-3.3 0-1.16.81-2.02 2.4-2.3V8h2v1c1.03.22 1.87.89 2.12 2h-1.87c-.17-.46-.58-.8-1.25-.8-.82 0-1.4.38-1.4.9 0 1.48 2.9 1.02 2.9 3.28 0 1.28-.9 2.19-2.5 2.42v1.2z",
                    },

                    {
                        id: "마이",
                        label: "마이",

                        path: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
                    },
                ].map(item => {
                    const isActive = activeTab === item.id;

                    const activeColor = "#028a50";

                    const inactiveColor = "#b0b0b0";

                    return (
                        <div
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            style={{
                                display: "flex",

                                flexDirection: "column",

                                alignItems: "center",

                                justifyContent: "center",

                                cursor: "pointer",

                                gap: "3px",

                                flex: 1,
                            }}>
                            <svg
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                                fill={isActive ? activeColor : inactiveColor}>
                                <path d={item.path} />
                            </svg>

                            <span
                                style={{
                                    fontSize: "10px",

                                    fontWeight: isActive ? "700" : "500",

                                    color: isActive ? activeColor : inactiveColor,
                                }}>
                                {item.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
