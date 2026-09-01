# ✈️ Travel Forex Service (Frontend)

해외여행자를 위한 실시간 환율 연동 외화 지갑 및 여행 경비 관리 서비스의 프론트엔드(React Native/Expo) 프로젝트입니다.

---

## 🛠 Tech Stack

*   **Core:** React Native (v0.81.5), Expo (v54.0.37), Expo Router (v6)
*   **Language:** TypeScript
*   **Styling:** NativeWind (Tailwind CSS for React Native)
*   **State Management:** Zustand (`useAuthStore`, `useThemeStore`, `useLayoutStore`)
*   **Form & Validation:** React Hook Form, Zod
*   **Network:** Axios (Custom Interceptors 처리)
*   **Local Storage:** AsyncStorage (웹 환경은 localStorage 대응)
*   **UI Components:** React Native SVG (환율 차트), @react-native-community/datetimepicker

---

## ✨ Key Features

1.  **외화 지갑 및 자산 대시보드 (Home/Wallet)**
   *   현재 보유 중인 다국어 통화(USD, JPY, EUR, GBP, CNY 등) 잔액 및 원화(KRW) 환산 가치 실시간 제공.
   *   어제 대비 총 자산 등락률(%) 실시간 계산 및 시각화.
   *   입금/출금(DEPOSIT/WITHDRAW) 내역 등록 시 실시간 적용 환율 바탕으로 원화 자동 계산.

2.  **실시간 환율 차트 (Forex)**
   *   `react-native-svg`를 활용한 커스텀 그라데이션 라인 차트 구현.
   *   1D, 1W, 1M, 3M, 1Y 단위의 기간별 환율 변동 추이 제공.
   *   1분 단위 백그라운드 자동 갱신(Interval) 처리로 최신 데이터 유지.

3.  **여행 및 경비 관리 (Trips & Expenses)**
   *   진행 중인 여행과 지난 여행 분리 탭 제공.
   *   여행별 총 예산 대비 지출 요약 리스트 제공.
   *   지출 내역 등록 시 **보유 지갑 연동(isWalletLinked)** 옵션을 통해 지갑 잔액 자동 차감 처리.

4.  **사용자 인증 및 설정 (Auth & Profile)**
   *   Zustand와 AsyncStorage를 결합한 토큰 기반(Stateless) 로그인/로그아웃 세션 유지.
   *   Axios Interceptor를 통한 401 Unauthorized(세션 만료) 예외 자동 감지 및 리다이렉트 처리.
   *   기기 시스템 테마(Light/Dark) 감지 및 수동 토글 지원 (`useThemeStore`).
   *   비밀번호 변경 및 계정 탈퇴 기능.

---

## 📂 Project Structure

```text
├── api/             # Axios 인스턴스 및 도메인별 API 함수 (userApi, tripApi 등)
├── app/             # Expo Router 기반 파일 라우팅 폴더 (public, main, auth 등)
├── assets/          # 폰트, 아이콘, 스플래시 이미지
├── components/      # 재사용 가능한 UI 컴포넌트
│   ├── common/      # 버튼, 인풋, 카드, 모달 등 공통 요소
│   └── domain/      # 특정 도메인(Auth, Trip, Expense)에 종속된 컴포넌트
├── hooks/           # 비즈니스 로직 분리를 위한 커스텀 훅 (useTripList 등)
├── schemas/         # Zod를 활용한 폼 유효성 검사 스키마
├── stores/          # Zustand 전역 상태 관리 (Auth, Theme, Layout)
└── types/           # TypeScript 인터페이스 및 타입 정의
```

---

## 🚀 Getting Started

### 1. Prerequisite
- Node.js (v18 이상 권장)
- npm, yarn 또는 pnpm
- Expo Go 앱 (모바일 테스트용)

### 2. Installation
프로젝트 디렉토리로 이동하여 의존성 패키지를 설치합니다.

```bash
pnpm install
```

### 3. Environment Variables
프로젝트 루트에 `.env` 파일을 생성하고 백엔드 API 주소를 설정합니다.

```dotenv
EXPO_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

### 4. Run Development Server
엑스포 로컬 개발 서버를 실행합니다.

```bash
# 기본 실행 (Expo Go QR 코드 제공)
pnpm start

# 플랫폼별 개별 실행
pnpm run android
pnpm run ios
pnpm run web
```