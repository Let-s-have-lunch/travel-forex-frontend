import React, { useEffect, useId, useState } from "react";

// ========================================
// 국기 아이콘
// 이모지를 사용하지 않고 CSS로 직접 표현
// ========================================

const CountryFlag = ({ country }: { country: "US" | "JP" | "EU" }) => {
    // 🇺🇸 미국
    if (country === "US") {
        return (
            <div
                style={{
                    width: "28px",
                    height: "20px",
                    borderRadius: "5px",
                    overflow: "hidden",
                    position: "relative",
                    background:
                        "repeating-linear-gradient(to bottom, #d94b5b 0px, #d94b5b 2px, #ffffff 2px, #ffffff 4px)",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                }}>
                <div
                    style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        width: "12px",
                        height: "11px",
                        background: "#315A9D",
                    }}>
                    <div
                        style={{
                            position: "absolute",
                            inset: "2px",
                            background: "radial-gradient(circle, #fff 0.7px, transparent 0.9px)",
                            backgroundSize: "4px 4px",
                        }}
                    />
                </div>
            </div>
        );
    }

    // 🇯🇵 일본
    if (country === "JP") {
        return (
            <div
                style={{
                    width: "28px",
                    height: "20px",
                    borderRadius: "5px",
                    background: "#ffffff",
                    position: "relative",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                }}>
                <div
                    style={{
                        position: "absolute",
                        width: "9px",
                        height: "9px",
                        borderRadius: "50%",
                        background: "#D94B5B",
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                    }}
                />
            </div>
        );
    }

    // 🇪🇺 유럽
    return (
        <div
            style={{
                width: "28px",
                height: "20px",
                borderRadius: "5px",
                background: "#315A9D",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            }}>
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#FFD34E",
                    fontSize: "9px",
                    letterSpacing: "1px",
                }}>
                ✦
            </div>
        </div>
    );
};

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
                height: "64px",
                marginTop: "8px",
            }}>
            <svg
                width="100%"
                height="64"
                viewBox="0 0 240 44"
                preserveAspectRatio="none"
                fill="none">
                <defs>
                    <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.20" />

                        <stop offset="60%" stopColor={color} stopOpacity="0.06" />

                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>

                <path d={fillPathD} fill={`url(#${gradientId})`} />

                <path
                    d={pathD}
                    stroke={color}
                    strokeWidth="1.7"
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
                .catch(err => {
                    console.error("API 호출 실패:", err);
                });
        }

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
            country: "US" as const,
            name: "미국 달러",
            price: usdKrw,
            change: "+0.42%",
            isUp: true,

            color: "var(--primary-main)",

            iconBackground: "rgba(107, 193, 182, 0.12)",

            pathD: "M 10 36 L 16 34 L 22 36 L 28 34 L 34 35 L 40 31 L 46 33 L 52 28 L 58 31 L 64 26 L 70 29 L 76 24 L 82 20 L 88 23 L 94 25 L 100 27 L 106 24 L 112 21 L 118 23 L 124 19 L 130 20 L 136 17 L 142 21 L 148 19 L 154 20 L 160 18 L 166 14 L 172 17 L 178 17 L 184 15 L 190 10 L 196 13 L 202 12 L 208 15 L 214 17 L 220 18 L 226 21 L 230 20",
        },

        {
            symbol: "JPY/KRW",
            country: "JP" as const,
            name: "일본 엔",
            price: jpyKrw,
            change: "-0.18%",
            isUp: false,

            color: "var(--error)",

            iconBackground: "rgba(255, 107, 107, 0.10)",

            pathD: "M 10 35 L 16 34 L 22 32 L 28 34 L 34 31 L 40 33 L 46 29 L 52 35 L 58 28 L 64 24 L 70 20 L 76 23 L 82 26 L 88 24 L 94 29 L 100 32 L 106 28 L 112 25 L 118 21 L 124 19 L 130 22 L 136 21 L 142 24 L 148 22 L 154 26 L 160 21 L 166 22 L 172 26 L 178 22 L 184 21 L 190 20 L 196 23 L 202 21 L 208 26 L 214 27 L 220 28 L 226 31 L 230 30",
        },

        {
            symbol: "EUR/KRW",
            country: "EU" as const,
            name: "유로",
            price: eurKrw,
            change: "+0.23%",
            isUp: true,

            color: "var(--accent-lavender)",

            iconBackground: "rgba(199, 195, 243, 0.18)",

            pathD: "M 10 36 L 16 35 L 22 33 L 28 34 L 34 32 L 40 33 L 46 29 L 52 26 L 58 23 L 64 26 L 70 28 L 76 29 L 82 25 L 88 31 L 94 28 L 100 24 L 106 20 L 112 21 L 118 19 L 124 23 L 130 21 L 136 21 L 142 24 L 148 19 L 154 21 L 160 20 L 166 23 L 172 21 L 178 20 L 184 23 L 190 21 L 196 22 L 202 25 L 208 24 L 214 27 L 220 26 L 226 28 L 230 27",
        },
    ];

    // ========================================
    // 하단 네비게이션
    // ========================================

    const navigationItems = [
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
            path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 16h-2v-1c-1.29-.28-2.26-1.19-2.42-2.5h1.9c.14.54.67.9 1.52.9 1.1 0 1.5-.54 1.5-1.1 0-1.63-2.9-1.06-2.9-3.3 0-1.16.81-2.02 2.4-2.3V8h2v1c1.03.22 1.87.89 2.12 2h-1.87c-.17-.46-.58-.8-1.25-.8-1.4 0-1.4.38-1.4.9 0 1.48 2.9 1.02 2.9 3.28 0 1.28-.9 2.19-2.5 2.42v1.2z",
        },

        {
            id: "마이페이지",
            label: "마이페이지",
            path: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
        },
    ];

    // ========================================
    // 화면
    // ========================================

    return (
        <div
            style={{
                width: "100%",
                minHeight: "100vh",

                boxSizing: "border-box",

                backgroundColor: "var(--background)",

                padding: "32px 16px 96px",

                fontFamily:
                    '-apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Pretendard", Roboto, sans-serif',

                color: "var(--text-primary)",
            }}>
            {/* ====================================
                상단 제목
            ==================================== */}

            <section
                style={{
                    marginBottom: "28px",

                    padding: "0 2px",
                }}>
                <div
                    style={{
                        fontSize: "12px",

                        lineHeight: 1,

                        fontWeight: "800",

                        color: "var(--primary-main)",

                        letterSpacing: "0.8px",

                        marginBottom: "10px",

                        margin: "10px 10px",
                    }}>
                    TRAVEL MONEY
                </div>

                <p
                    style={{
                        margin: "10px 10px",

                        fontSize: "12px",

                        lineHeight: "1.55",

                        color: "var(--text-secondary)",

                        letterSpacing: "-0.2px",
                    }}>
                    여행 전 필요한 환율을
                    <br />
                    한눈에 확인해보세요.
                </p>
            </section>

            {/* ====================================
                환율 메인 카드
            ==================================== */}

            <section
                style={{
                    width: "100%",

                    boxSizing: "border-box",

                    backgroundColor: "var(--surface)",

                    borderRadius: "30px",

                    padding: "24px 18px 18px",

                    border: "1px solid rgba(230, 233, 231, 0.8)",

                    boxShadow: "0 10px 30px rgba(30, 42, 39, 0.055)",
                }}>
                {ratesData.map((item, index) => (
                    <React.Fragment key={item.symbol}>
                        {/* 통화 */}

                        <div
                            style={{
                                padding: "0 2px",
                            }}>
                            {/* 통화명 + 변동률 */}

                            <div
                                style={{
                                    display: "flex",

                                    justifyContent: "space-between",

                                    alignItems: "flex-start",
                                }}>
                                {/* 왼쪽 통화 정보 */}

                                <div
                                    style={{
                                        display: "flex",

                                        alignItems: "center",

                                        gap: "10px",
                                    }}>
                                    {/* 국기 */}

                                    <div
                                        style={{
                                            width: "42px",

                                            height: "42px",

                                            flexShrink: 0,

                                            borderRadius: "13px",

                                            backgroundColor: item.iconBackground,

                                            display: "flex",

                                            alignItems: "center",

                                            justifyContent: "center",
                                        }}>
                                        <CountryFlag country={item.country} />
                                    </div>

                                    {/* 통화 이름 */}

                                    <div>
                                        <div
                                            style={{
                                                fontSize: "15px",

                                                lineHeight: "1.2",

                                                fontWeight: "800",

                                                color: "var(--text-primary)",

                                                letterSpacing: "-0.2px",
                                            }}>
                                            {item.symbol}
                                        </div>

                                        <div
                                            style={{
                                                marginTop: "4px",

                                                fontSize: "12px",

                                                lineHeight: "1.2",

                                                color: "var(--text-secondary)",
                                            }}>
                                            {item.name}
                                        </div>
                                    </div>
                                </div>

                                {/* 변동률 */}

                                <div
                                    style={{
                                        display: "flex",

                                        alignItems: "center",

                                        gap: "4px",

                                        paddingTop: "7px",

                                        fontSize: "13px",

                                        fontWeight: "750",

                                        color: item.isUp ? "var(--success)" : "var(--error)",

                                        whiteSpace: "nowrap",
                                    }}>
                                    <span>{item.isUp ? "▲" : "▼"}</span>

                                    <span>{item.change}</span>
                                </div>
                            </div>

                            {/* 환율 */}

                            <div
                                style={{
                                    display: "flex",

                                    alignItems: "baseline",

                                    gap: "7px",

                                    marginTop: "14px",
                                }}>
                                <span
                                    style={{
                                        fontSize: "25px",

                                        lineHeight: "1",

                                        fontWeight: "800",

                                        letterSpacing: "-1px",

                                        color: "var(--text-primary)",
                                    }}>
                                    {item.price}
                                </span>

                                <span
                                    style={{
                                        fontSize: "12px",

                                        color: "var(--text-tertiary)",
                                    }}>
                                    KRW
                                </span>
                            </div>

                            {/* 그래프 */}

                            <GradientExchangeChart pathD={item.pathD} color={item.color} />
                        </div>

                        {/* 통화 사이 구분선 */}

                        {index < ratesData.length - 1 && (
                            <div
                                style={{
                                    height: "1px",

                                    backgroundColor: "var(--divider)",

                                    margin: "2px 0 22px",
                                }}
                            />
                        )}
                    </React.Fragment>
                ))}

                {/* ====================================
                    업데이트 시간
                ==================================== */}

                <div
                    style={{
                        marginTop: "4px",

                        paddingTop: "16px",

                        borderTop: "1px solid var(--divider)",

                        display: "flex",

                        justifyContent: "center",

                        alignItems: "center",

                        gap: "8px",

                        color: "var(--text-tertiary)",

                        fontSize: "11px",

                        fontWeight: "500",
                    }}>
                    <span>기준 시간: {lastUpdate}</span>

                    <span
                        style={{
                            display: "inline-flex",

                            alignItems: "center",

                            justifyContent: "center",

                            width: "24px",

                            height: "24px",

                            borderRadius: "50%",

                            backgroundColor: "var(--primary-sub)",

                            color: "var(--primary-main)",

                            fontSize: "17px",

                            fontWeight: "700",
                        }}>
                        ↻
                    </span>
                </div>
            </section>

            {/* ====================================
                하단 네비게이션
            ==================================== */}

            <nav
                style={{
                    position: "fixed",

                    left: 0,
                    bottom: 0,

                    width: "100%",

                    height: "72px",

                    boxSizing: "border-box",

                    backgroundColor: "rgba(255, 255, 255, 0.96)",

                    borderTop: "1px solid var(--divider)",

                    display: "flex",

                    alignItems: "center",

                    justifyContent: "space-around",

                    zIndex: 100,

                    backdropFilter: "blur(10px)",

                    WebkitBackdropFilter: "blur(10px)",
                }}>
                {navigationItems.map(item => {
                    const isActive = activeTab === item.id;

                    return (
                        <div
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            style={{
                                flex: 1,

                                height: "100%",

                                display: "flex",

                                flexDirection: "column",

                                alignItems: "center",

                                justifyContent: "center",

                                gap: "4px",

                                cursor: "pointer",
                            }}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                                <path
                                    d={item.path}
                                    fill={isActive ? "var(--primary-main)" : "var(--text-tertiary)"}
                                />
                            </svg>

                            <span
                                style={{
                                    fontSize: "10px",

                                    lineHeight: "1",

                                    fontWeight: isActive ? "700" : "500",

                                    color: isActive
                                        ? "var(--primary-main)"
                                        : "var(--text-tertiary)",
                                }}>
                                {item.label}
                            </span>
                        </div>
                    );
                })}
            </nav>
        </div>
    );
}
