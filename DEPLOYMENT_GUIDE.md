# 🚀 ParcelManager2 部署指南

## 📋 前置準備

確保你已經有：
- ✅ **GitHub 帳號**：gamer99122
- ✅ **Railway 帳號**：https://railway.app (用 GitHub 登入)
- ✅ **MongoDB Atlas 帳號**：https://www.mongodb.com/cloud/atlas

---

## 第 1 步：MongoDB Atlas 設置（5 分鐘）

### 1.1 建立新叢集

1. 登入 MongoDB Atlas
2. 點擊 **Create a New Cluster**
3. 選擇 **Shared** (免費)
4. 選擇區域（選離你最近的）
5. 點擊 **Create Cluster**

### 1.2 建立資料庫用戶

1. 在左側點擊 **Database Access**
2. 點擊 **Add New Database User**
3. 輸入用戶名（如：admin）
4. 輸入密碼（複雜密碼，建議用密碼生成器）
5. 點擊 **Add User**

### 1.3 設置網路存取

1. 在左側點擊 **Network Access**
2. 點擊 **Add IP Address**
3. 選擇 **Allow access from anywhere** (或輸入 0.0.0.0/0)
4. 點擊 **Confirm**

### 1.4 獲取連接字符串

1. 回到 **Databases** 頁面
2. 點擊你的叢集右邊的 **Connect**
3. 選擇 **Drivers**
4. 複製連接字符串（格式如下）：

```
mongodb+srv://admin:password@cluster.mongodb.net/?retryWrites=true&w=majority
```

**替換為你的實際用戶名和密碼！**

保存這個字符串，待會用到。

---

## 第 2 步：上傳到 GitHub

### 2.1 建立 GitHub 倉庫

1. 打開 https://github.com/new
2. Repository name：`ParcelManager2`
3. 描述：`包裹清單管理系統`
4. Public（公開）
5. 點擊 **Create repository**

### 2.2 推送本地代碼

在 `ParcelManager2` 目錄執行：

```bash
git remote add origin https://github.com/gamer99122/ParcelManager2.git
git branch -M main
git push -u origin main
```

驗證：https://github.com/gamer99122/ParcelManager2 應該能看到你的代碼

---

## 第 3 步：Railway 部署（10 分鐘）

### 3.1 連接 GitHub

1. 打開 https://railway.app
2. 點擊 **Dashboard**
3. 點擊 **New Project**
4. 選擇 **Deploy from GitHub repo**
5. 授權 GitHub（如果需要）
6. 選擇 **ParcelManager2** 倉庫
7. 點擊 **Deploy**

### 3.2 配置環境變數

Railway 會自動偵測 `Procfile` 並創建服務。

現在配置 **MONGODB_URI** 變數：

1. 在 Railway Dashboard 找到你的服務
2. 點擊 **Variables**
3. 點擊 **New Variable**
4. 輸入：
   - **KEY**：`MONGODB_URI`
   - **VALUE**：你從 MongoDB Atlas 複製的連接字符串
5. 點擊 **Save**

### 3.3 檢查部署狀態

1. 點擊 **Deployments** 標籤
2. 應該看到「Success ✓」的綠色標記
3. 點擊 **View logs** 確認：
   ```
   ✅ MongoDB 已連接
   🚀 服務器運行於 http://localhost:3000
   ```

### 3.4 獲取公開 URL

1. 點擊 **Settings**
2. 在 **Domains** 部分，複製你的 Railway URL
   - 格式：`https://parcelmanager2-production.up.railway.app`

記下這個 URL，下一步會用到。

---

## 第 4 步：配置前端

### 4.1 更新 API URL

編輯 `frontend/script.js`，修改第 1 行：

```javascript
// 修改為您的 Railway 後端 URL
const API_BASE_URL = 'https://parcelmanager2-production.up.railway.app';
```

### 4.2 推送更新

```bash
git add frontend/script.js
git commit -m "配置 Railway API URL"
git push
```

---

## 第 5 步：GitHub Pages 部署（2 分鐘）

### 5.1 啟用 GitHub Pages

1. 打開 GitHub 倉庫設置：https://github.com/gamer99122/ParcelManager2/settings
2. 左側點擊 **Pages**
3. **Source** 選擇 **Deploy from a branch**
4. **Branch** 選擇 **main** 和 **/ (root)**
5. 點擊 **Save**

等待 1-2 分鐘...

### 5.2 訪問網站

你的網站已發布在：
```
https://gamer99122.github.io/ParcelManager2/
```

打開看看！ 🎉

---

## 🧪 測試

1. **打開前端網站**：https://gamer99122.github.io/ParcelManager2/
2. **查看 Console**（F12）檢查是否連接到後端
3. **點擊「重新整理」**按鈕，應該看到 ✅ 資料已同步
4. **新增項目**（如果 URL 有 `?add=1` 參數才能看到按鈕）
5. **檢查 MongoDB**：打開 MongoDB Atlas，應該看到新增的數據

---

## 🔧 故障排除

### 問題：前端無法連接到後端

**解決：**
1. 檢查 Railway URL 是否正確
2. 檢查 MONGODB_URI 環境變數是否設置
3. 查看 Railway 的 Logs 看是否有錯誤

### 問題：MongoDB 連接失敗

**解決：**
1. 檢查連接字符串是否正確複製
2. 檢查密碼中是否有特殊字符（需要 URL 編碼）
3. 確認 MongoDB Atlas 的網路存取已開啟

### 問題：GitHub Pages 無法載入

**解決：**
1. 等待 5 分鐘讓 GitHub Pages 完全發布
2. 清除瀏覽器快取（Ctrl+Shift+Del）
3. 嘗試無痕模式

---

## 🔐 安全建議

1. **不要在代碼中放 MongoDB 密碼**，改用環境變數
2. **使用複雜密碼** - MongoDB Atlas 密碼
3. **定期檢查 Railway 的日誌** 看是否有異常

---

## 📚 後續優化

- [ ] 添加用戶認證（如需要）
- [ ] 添加數據驗證
- [ ] 優化性能
- [ ] 添加測試

祝你部署順利！ 🚀
