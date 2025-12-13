export const DEV_SPEC_MD = `# Mule Eyelash App - 開發設計規格書 (Development Specification)

## 1. 專案概述 (Project Overview)
本專案為 Mule Eyelash 美睫/美學服務應用程式，旨在提供顧客預約、商品購買及會員管理功能，並提供商家後台進行營運管理。

- **版本**: v1.2 (Vercel Backend & LINE Integration)
- **平台**: Web / Mobile Web (PWA ready)
- **風格**: 極簡、清新、高品質 (Mule Eyelash Brand Identity)

## 2. 技術堆疊 (Tech Stack)
- **核心框架**: React 19, Vite
- **語言**: TypeScript
- **樣式庫**: Tailwind CSS
- **路由管理**: React Router DOM
- **圖標庫**: Lucide React
- **後端**: Vercel Serverless Functions (/api)
- **外部整合**: 
    - **Firebase**: Firestore (資料庫), Storage (圖片儲存)
    - **LINE**: LIFF SDK (前端登入), Messaging API (後端推播通知)

## 3. 系統架構 (System Architecture)

### 3.1 目錄結構
- \`/pages\`: 頁面組件 (Home, Booking, Shop, Cart, Profile, Admin)
- \`/api\`: Vercel Serverless Functions
    - \`webhook.ts\`: 處理 LINE Webhook 驗證與事件接收。
    - \`send-line-push.ts\`: 處理發送 LINE 推播訊息。
- \`/contexts\`: 全域狀態管理 (Product, Stylist, Booking, Cart, Order, Shop, Gallery, Liff)
- \`/types.ts\`: TypeScript 型別定義

### 3.2 後端 API (Vercel)
本系統使用 Vercel 作為輕量級後端，處理需隱藏金鑰或跨網域的操作：
- **POST /api/webhook**: 
    - 用途：填入 LINE Developers Console 的 Webhook URL。
    - 功能：回應 LINE 的 Webhook Verify 請求 (Challenge)。
- **POST /api/send-line-push**:
    - 用途：供前端(後台)呼叫以發送通知。
    - 參數：\`{ to: "USER_ID", message: "TEXT" }\`
    - 安全性：依賴 Vercel 環境變數 \`LINE_CHANNEL_ACCESS_TOKEN\`。

## 4. 資料模型 (Data Models)

### Appointment (預約)
- **核心欄位**: id, serviceId, stylistId, date, time, status
- **LINE 整合**: \`userInfo.userId\` (用於發送 LINE 通知)

### ShopSettings (商家設定)
- **LINE 設定**: 儲存 LIFF ID, LINE ID (for Link)。
- **Webhook**: 顯示系統生成的 Webhook URL 供用戶複製。

## 5. 部署指南 (Deployment)
1. **GitHub**: Push 程式碼至 GitHub 倉庫。
2. **Vercel**: Import 倉庫進行部署。
3. **Environment Variables**:
   - \`LINE_CHANNEL_ACCESS_TOKEN\`: 從 LINE Developers 取得。
   - \`LINE_CHANNEL_SECRET\`: 從 LINE Developers 取得。
4. **LINE Console**: 設定 Webhook URL 為 \`https://YOUR-APP.vercel.app/api/webhook\` 並啟用。
`;

export const USER_MANUAL_MD = `# Mule Eyelash App - 商家後台操作手冊

歡迎使用 Mule Eyelash 管理系統。本手冊將引導您如何管理預約、商品、人員與行銷活動。

## 1. 進入後台
- 點擊首頁右下角的「商家後台」或底部選單進入管理介面。
- 上方導覽列可切換不同管理模組。

## 2. 預約管理 (Bookings)
此頁面顯示所有顧客的預約申請。
- **預約通知 (Line Push)**: 
    - 當顧客透過 LIFF 預約時，系統會記錄其 LINE User ID。
    - **確認預約**: 點擊「確認」後，系統會**自動發送 LINE 訊息**通知顧客預約成功。
    - **婉拒預約**: 點擊「婉拒」後，系統會**自動發送 LINE 訊息**告知顧客取消原因。
    - *注意*: 若發送失敗，系統會提示錯誤原因 (如環境變數未設定)，並自動複製訊息讓您手動回覆。
- **完成服務**: 當服務結束後，點擊「完成服務」將狀態歸檔。

## 3. 設定管理 (Settings)
- **品牌設定**: 修改 Logo、商店名稱、副標題。
- **LINE 整合設定**:
    - **LIFF ID**: 用於顧客登入與取得 User ID。
    - **LINE ID**: 用於「線上諮詢」按鈕連結。
    - **Webhook 設定**: 
        - 系統會顯示專屬的 **Webhook URL**。
        - 請複製此 URL 到 **LINE Developers Console** 的 Webhook Settings 中填貼上。
        - 點擊「測試後端連線」可檢查 Vercel 環境變數是否設定正確。

## 4. 訂單管理 (Orders)
管理線上商城的銷售訂單，提供完整的處理流程。
- **篩選**: 可依照日期區間、訂單狀態(待處理/已出貨等)進行篩選。
- **編輯**: 可修改顧客資料、更新付款狀態、輸入物流單號。

## 5. 美容師管理 (Stylists)
設定店內美容師的資訊與排班。
- **排班設定**: 點擊圓圈設定每週上班日 (日~六) 及每日工時。
- **專長**: 勾選該美容師可執行的服務項目，這會影響顧客預約時的篩選結果。

## 6. 圖庫管理 (Gallery)
- 上傳作品集圖片，供前台展示。

## 7. 常見問題
- **Q: 預約時沒有收到 LINE 通知?**
  - A: 1. 請確認 Vercel 環境變數 \`LINE_CHANNEL_ACCESS_TOKEN\` 是否正確。 2. 請確認 Vercel 已重新部署 (Redeploy)。 3. 顧客必須是在 LINE App 內開啟預約頁面才能抓取到 User ID。
- **Q: 照片無法顯示?**
  - A: 請確保圖片連結是公開可存取的，建議使用系統內建的圖庫上傳功能。
`;