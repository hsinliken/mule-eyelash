
export const DEV_SPEC_MD = `# Mule Eyelash App - 開發設計規格書 (Development Specification)

## 1. 專案概述 (Project Overview)
本專案為 Mule Eyelash 美睫/美學服務應用程式，旨在提供顧客預約、商品購買及會員管理功能，並提供商家後台進行營運管理。

- **版本**: v1.1 (Enhanced Admin & Logic)
- **平台**: Web / Mobile Web (PWA ready)
- **風格**: 極簡、清新、高品質 (Mule Eyelash Brand Identity)

## 2. 技術堆疊 (Tech Stack)
- **核心框架**: React 19
- **語言**: TypeScript
- **建置工具**: Vite (推測)
- **樣式庫**: Tailwind CSS (Brand Colors Configured)
- **路由管理**: React Router DOM (HashRouter)
- **圖標庫**: Lucide React
- **外部整合**: LINE LIFF SDK (整合 LINE 登入與訊息發送)

## 3. 系統架構 (System Architecture)

### 3.1 目錄結構
- \`/pages\`: 頁面組件 (Home, Booking, Shop, Cart, Profile, Admin)
- \`/components\`: 共用組件 (BottomNav, GridMenu)
- \`/contexts\`: 全域狀態管理 (React Context API)
- \`/types.ts\`: TypeScript 型別定義
- \`/constants.ts\`: 靜態資料與設定

### 3.2 狀態管理 (Contexts)
| Context Name | 功能描述 | 主要方法 |
|--------------|----------|----------|
| **LiffContext** | LINE Login 整合 (含 Iframe 自動 Mock 偵測) | login, logout, getProfile |
| **ProductContext** | 商品資料 CRUD | addProduct, updateProduct, deleteProduct |
| **StylistContext** | 美容師與排班管理 | addStylist, updateStylist (含排班邏輯) |
| **BookingContext** | 預約狀態管理 | addAppointment, updateStatus |
| **CartContext** | 購物車邏輯 | addToCart, updateQuantity, clearCart |
| **OrderContext** | 訂單生命週期與編輯 | createOrder, updateOrderStatus, updateOrder |
| **PromotionContext**| 行銷活動看板 | addPromotion, toggleActive |

## 4. 資料模型 (Data Models)

### Service (服務項目)
- id, title, price, duration, category (Lash/Brow/Lip/Care)

### Stylist (美容師)
- id, name, role, image, specialties (技能標籤)
- workDays (Array<number>), workHours ({start, end})

### Appointment (預約)
- id, serviceId, stylistId, date, time, status (confirmed/completed/cancelled)

### Order (訂單)
- id, items, totalAmount, customerInfo, delivery, payment, status
- 支援編輯配送資訊、物流單號與付款狀態

### Promotion (行銷活動)
- id, title, description, image, label, active (boolean)

## 5. 核心邏輯說明

### 5.1 預約邏輯 (Booking Flow)
1. **選擇服務**: 過濾出具備該服務類別專長的美容師。
2. **選擇美容師**: 讀取 Stylist 資料。
3. **選擇時間**:
   - 檢查美容師 \`workDays\` (週一至週六)。
   - 根據 \`workHours\` 動態生成 30 分鐘間隔的時段。
   - 排除不可用日期。
4. **確認與送出**: 寫入 BookingContext 並透過 LIFF 發送 LINE 訊息通知。

### 5.2 購物車與訂單
- 支援「宅配」與「超商取貨」。
- 支援多種付款方式模擬 (信用卡, LINE Pay)。
- 訂單狀態流轉: Pending -> Paid -> Shipped -> Completed -> Cancelled。
- 後台支援**進階篩選** (日期區間、訂單狀態) 與**詳細編輯**功能。

## 6. UI/UX 規範
- **主色調**: Brand Brown (#A1887F, #5D4037) & Off-white (#FAF9F6)。
- **字體**: 無襯線字體 (Helvetica Neue, Arial)。
- **響應式**: Mobile-First 設計，桌面版限制最大寬度以模擬 App 體驗。
`;

export const USER_MANUAL_MD = `# Mule Eyelash App - 商家後台操作手冊

歡迎使用 Mule Eyelash 管理系統。本手冊將引導您如何管理預約、商品、人員與行銷活動。

## 1. 進入後台
- 點擊首頁右下角的「商家後台」或底部選單進入管理介面。
- 上方導覽列可切換不同管理模組。

## 2. 預約管理 (Bookings)
此頁面顯示所有顧客的預約申請。
- **查看預約**: 顯示預約項目、時間、指定美容師與顧客資訊。
- **完成服務**: 當服務結束後，點擊「完成服務」將狀態歸檔。
- **取消預約**: 若顧客取消，點擊「取消」釋放時段。
- *狀態標籤*: 綠色(已確認)、灰色(已完成)、紅色(已取消)。

## 3. 訂單管理 (Orders)
管理線上商城的銷售訂單，提供完整的處理流程。

### 3.1 訂單篩選
- **日期篩選**: 可設定「開始日期」與「結束日期」，快速查找特定期間的訂單。
- **狀態篩選**: 點擊上方的狀態標籤 (如：待處理、已付款、已出貨)，過濾出需要處理的訂單。
- **清除條件**: 若有設定篩選條件，可點擊「清除篩選條件」回復顯示所有訂單。

### 3.2 訂單處理與編輯
點擊訂單卡片上的「編輯詳情/出貨」按鈕，即可開啟編輯視窗：
- **顧客資訊**: 可修改顧客姓名與聯絡電話 (若顧客填錯時使用)。
- **付款狀態**: 可手動勾選「已付款」，適用於確認收到轉帳款項後的操作。
- **配送資訊**:
    - **狀態變更**: 可自由切換訂單狀態 (待處理 -> 已出貨 -> 已完成)。
    - **物流單號**: 輸入宅配或超商的寄件單號，方便顧客查詢。
    - **地址修正**: 若顧客地址有誤，可直接在此欄位修正。
- **儲存**: 完成編輯後，請務必點擊底部的「儲存訂單變更」。

## 4. 美容師管理 (Stylists)
設定店內美容師的資訊與排班。
- **新增美容師**: 點擊上方虛線框按鈕。
- **編輯資訊**:
    - **基本資料**: 姓名、職稱、照片連結。
    - **專長項目**: 勾選該美容師可執行的服務 (美睫/美眉/美唇/保養)。
    - **排班設定**:
        - **工作日**: 點擊圓圈設定每週上班日 (日~六)。
        - **工時**: 設定每日可預約的開始與結束時間 (如 10:00 - 19:00)。
- **維護照片**: 直接貼上圖片 URL 即可更新頭像。

## 5. 商品管理 (Products)
上架與維護商城商品。
- **新增/編輯**: 輸入名稱、價格、描述與圖片連結。
- **庫存控制**: 勾選「庫存中」商品才會顯示在商城前台；若缺貨請取消勾選，前台將顯示「補貨中」。

## 6. 行銷活動管理 (Promotions)
管理首頁上方的輪播優惠看板。
- **新增活動**: 設定標題、副標題、圖片與標籤 (如: 當季特惠)。
- **啟用/停用**: 透過「啟用中」核取方塊控制活動是否顯示於首頁。
- **用途**: 適合用於發布季節性優惠、店休公告或新服務推廣。

## 7. 常見問題
- **Q: 照片無法顯示?**
  - A: 請確保圖片連結 (URL) 是公開可存取的 (如 https 結尾為 .jpg 或 .png 的連結)。
- **Q: 如何修改服務項目 (Services)?**
  - A: 目前核心服務項目需透過工程師調整程式碼 (constants.ts)，後台僅能管理美容師是否具備該技能。
`;