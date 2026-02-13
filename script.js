// ===== 多語系功能 =====
const translations = {
    'zh-TW': {
        // 登入頁面
        loginTitle: '包裹管理系統',
        loginSubtitle: '請輸入驗證碼以繼續',
        loginPlaceholder: '請輸入驗證碼',
        loginButton: '登入',
        loginError: '❌ 驗證碼錯誤，請重試',

        // 主頁面標題
        pageTitle: '📦 包裹清單管理',
        pageSubtitle: '追蹤和管理您的包裹',

        // 按鈕
        addButton: '新增項目',
        refreshButton: '🔄 重新整理',
        editButton: '編輯',
        deleteButton: '刪除',
        saveButton: '儲存',
        cancelButton: '取消',

        // 表格標題
        tableDate: '收件日期',
        tableSequence: '序號',
        tableImage: '圖片',
        tableBrand: '商家',
        tableShipment: '寄送狀態',
        tableNotes: '備註',
        tableActions: '操作',

        // 編輯表單
        editTitle: '編輯項目',
        editDate: '收件日期',
        editSequence: '序號',
        editImages: '商品圖片 (最多 6 張，圖片網址)',
        editBrand: '商家',
        editNotes: '備註',
        editShipment: '寄送狀態',

        // 寄送狀態選項
        shipmentBlank: '空白',
        shipmentNo: '不寄送',
        shipmentYes: '寄送',
        shipmentPartial: '部分寄送',

        // 通知訊息
        notifySuccess: '✅ 資料已同步',
        notifyLoadError: '❌ 讀取失敗',
        notifySaveSuccess: '✅ 儲存成功',
        notifySaveError: '❌ 儲存失敗',
        notifyDeleteSuccess: '✅ 已刪除',
        notifyDeleteError: '❌ 刪除失敗',
        notifyUpdateSuccess: '✅ 狀態已更新',

        // 其他
        deleteConfirm: '確定刪除？',
        loading: '載入中...',
        noImage: '無圖片',
        itemCount: '項商品',
        totalCount: '總共',
        imagePlaceholder: '圖片'
    },
    'ja': {
        // ログインページ
        loginTitle: '荷物管理システム',
        loginSubtitle: '認証コードを入力してください',
        loginPlaceholder: '認証コードを入力',
        loginButton: 'ログイン',
        loginError: '❌ 認証コードが間違っています',

        // メインページタイトル
        pageTitle: '📦 荷物リスト管理',
        pageSubtitle: '荷物を追跡・管理',

        // ボタン
        addButton: '新規追加',
        refreshButton: '🔄 更新',
        editButton: '編集',
        deleteButton: '削除',
        saveButton: '保存',
        cancelButton: 'キャンセル',

        // テーブルヘッダー
        tableDate: '受取日',
        tableSequence: '番号',
        tableImage: '画像',
        tableBrand: 'ショップ',
        tableShipment: '配送状況',
        tableNotes: '備考',
        tableActions: '操作',

        // 編集フォーム
        editTitle: '項目を編集',
        editDate: '受取日',
        editSequence: '番号',
        editImages: '商品画像（最大6枚、画像URL）',
        editBrand: 'ショップ',
        editNotes: '備考',
        editShipment: '配送状況',

        // 配送状況オプション
        shipmentBlank: '空白',
        shipmentNo: '配送なし',
        shipmentYes: '配送',
        shipmentPartial: '一部配送',

        // 通知メッセージ
        notifySuccess: '✅ データを同期しました',
        notifyLoadError: '❌ 読み込みに失敗しました',
        notifySaveSuccess: '✅ 保存しました',
        notifySaveError: '❌ 保存に失敗しました',
        notifyDeleteSuccess: '✅ 削除しました',
        notifyDeleteError: '❌ 削除に失敗しました',
        notifyUpdateSuccess: '✅ 状態を更新しました',

        // その他
        deleteConfirm: '削除してもよろしいですか？',
        loading: '読み込み中...',
        noImage: '画像なし',
        itemCount: '件の商品',
        totalCount: '合計',
        imagePlaceholder: '画像'
    }
};

// 當前語言
let currentLang = localStorage.getItem('language') || 'zh-TW';

// 取得翻譯文字
function t(key) {
    return translations[currentLang][key] || translations['zh-TW'][key] || key;
}

// 切換語言
function switchLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    updatePageLanguage();
    renderTable(); // 重新渲染表格以更新語言
}

// 更新頁面語言
function updatePageLanguage() {
    // 更新登入頁面
    const loginTitle = document.querySelector('.login-title');
    const loginSubtitle = document.querySelector('.login-subtitle');
    const loginInput = document.getElementById('loginCode');
    const loginButton = document.querySelector('.login-button');

    if (loginTitle) loginTitle.textContent = t('loginTitle');
    if (loginSubtitle) loginSubtitle.textContent = t('loginSubtitle');
    if (loginInput) loginInput.placeholder = t('loginPlaceholder');
    if (loginButton) loginButton.textContent = t('loginButton');

    // 更新主頁面標題
    const pageTitle = document.querySelector('.display-4');
    const pageSubtitle = document.querySelector('.lead');

    if (pageTitle) pageTitle.textContent = t('pageTitle');
    if (pageSubtitle) pageSubtitle.textContent = t('pageSubtitle');

    // 更新按鈕
    const addBtn = document.getElementById('addBtn');
    const refreshBtn = document.querySelector('.btn-success');

    if (addBtn) addBtn.textContent = t('addButton');
    if (refreshBtn) refreshBtn.textContent = t('refreshButton');

    // 更新表格標題
    const headers = document.querySelectorAll('thead th');
    if (headers.length >= 7) {
        headers[0].textContent = t('tableDate');
        headers[1].textContent = t('tableSequence');
        headers[2].textContent = t('tableImage');
        headers[3].textContent = t('tableBrand');
        headers[4].textContent = t('tableShipment');
        headers[5].textContent = t('tableNotes');
        headers[6].textContent = t('tableActions');
    }

    // 更新編輯表單
    const modalTitle = document.querySelector('.modal-title');
    if (modalTitle) modalTitle.textContent = t('editTitle');

    // 更新表單標籤
    updateFormLabels();

    // 更新語言選擇器按鈕狀態
    updateLanguageButtons();
}

// 更新表單標籤
function updateFormLabels() {
    const labels = document.querySelectorAll('.modal-body label');
    if (labels.length >= 6) {
        labels[0].textContent = t('editDate');
        labels[1].textContent = t('editSequence');
        labels[2].textContent = t('editImages');
        labels[3].textContent = t('editBrand');
        labels[4].textContent = t('editNotes');
        labels[5].textContent = t('editShipment');
    }
}

// 更新語言選擇器按鈕狀態
function updateLanguageButtons() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        if (btn.dataset.lang === currentLang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// ===== 驗證碼登入功能 =====
const CORRECT_CODE = '20260225'; // 預設驗證碼
const AUTH_KEY = 'parcelManagerAuth';

// 檢查是否已登入
function checkAuth() {
    const isAuthenticated = sessionStorage.getItem(AUTH_KEY);
    if (isAuthenticated === 'true') {
        showMainContent();
    } else {
        showLoginPage();
    }
}

// 顯示登入頁面
function showLoginPage() {
    document.getElementById('loginPage').style.display = 'flex';
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('loginCode').focus();
}

// 顯示主要內容
function showMainContent() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('mainContent').style.display = 'block';
}

// 處理登入
function handleLogin(event) {
    event.preventDefault();
    const code = document.getElementById('loginCode').value;
    const errorDiv = document.getElementById('loginError');

    if (code === CORRECT_CODE) {
        // 驗證成功
        sessionStorage.setItem(AUTH_KEY, 'true');
        errorDiv.textContent = '';

        // 顯示成功動畫
        const loginBox = document.querySelector('.login-box');
        loginBox.style.animation = 'slideOut 0.3s ease';

        setTimeout(() => {
            showMainContent();
            loadDataFromAPI(); // 載入資料
        }, 300);
    } else {
        // 驗證失敗
        errorDiv.textContent = t('loginError');
        document.getElementById('loginCode').value = '';
        document.getElementById('loginCode').focus();

        // 震動效果
        const loginBox = document.querySelector('.login-box');
        loginBox.style.animation = 'shake 0.5s ease';
        setTimeout(() => {
            loginBox.style.animation = 'slideIn 0.5s ease';
        }, 500);
    }
}

// ===== API 配置 =====
// Railway 後端 URL
const API_BASE_URL = 'https://parcelmanager2-production.up.railway.app';

// 數據存儲
let shoppingList = [];
let currentEditId = null;
let currentLightboxItemId = null;
let currentImageIndex = 0;

// ===== 工具函數 =====

function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        if (show) overlay.classList.remove('d-none');
        else overlay.classList.add('d-none');
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function formatDate(dateString) {
    if (!dateString) return '';
    const str = String(dateString);
    if (str.includes('-')) return str;
    if (str.length === 8 && /^\d{8}$/.test(str)) {
        return str.slice(0, 4) + '-' + str.slice(4, 6) + '-' + str.slice(6, 8);
    }
    return str;
}

// ===== API 操作 =====

async function loadDataFromAPI(retryCount = 0) {
    try {
        showLoading(true);
        console.log('📖 正在從 API 讀取資料...');

        const response = await fetch(`${API_BASE_URL}/api/items`);
        const result = await response.json();

        console.log('📊 API 回應:', result);

        if (result.success && Array.isArray(result.data)) {
            shoppingList = result.data.map(item => ({
                ...item,
                id: item._id // MongoDB 使用 _id
            }));
            renderTable();
            showNotification(t('notifySuccess'));
        } else {
            throw new Error(result.message || '讀取失敗');
        }
    } catch (error) {
        console.error('❌ 讀取錯誤:', error);
        showNotification(t('notifyLoadError') + ': ' + error.message);

        if (retryCount < 1) {
            console.log('⏳ 3 秒後自動重試...');
            setTimeout(() => loadDataFromAPI(retryCount + 1), 3000);
        }
    } finally {
        showLoading(false);
    }
}

async function saveEdit(event) {
    event.preventDefault();
    showLoading(true);

    try {
        const itemData = {
            date: document.getElementById('editDate').value,
            sequence: document.getElementById('editSequence').value,
            images: [
                document.getElementById('editImage1').value,
                document.getElementById('editImage2').value,
                document.getElementById('editImage3').value,
                document.getElementById('editImage4').value,
                document.getElementById('editImage5').value,
                document.getElementById('editImage6').value
            ],
            brand: document.getElementById('editBrand').value,
            notes: document.getElementById('editNotes').value,
            shipment: document.getElementById('editShipment').value
        };

        let url = `${API_BASE_URL}/api/items`;
        let method = 'POST';

        if (currentEditId) {
            url += `/${currentEditId}`;
            method = 'PUT';
        }

        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(itemData)
        });

        const result = await response.json();

        if (result.success) {
            closeEditModal();
            await loadDataFromAPI();
            showNotification(t('notifySaveSuccess'));
        } else {
            showNotification(t('notifySaveError') + ': ' + result.message);
        }
    } catch (error) {
        console.error('❌ 儲存錯誤:', error);
        showNotification('❌ ' + error.message);
    } finally {
        showLoading(false);
    }
}

async function deleteItem(id) {
    if (!confirm(t('deleteConfirm'))) return;

    showLoading(true);
    try {
        const response = await fetch(`${API_BASE_URL}/api/items/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
            await loadDataFromAPI();
            showNotification(t('notifyDeleteSuccess'));
        } else {
            showNotification(t('notifyDeleteError') + ': ' + result.message);
        }
    } catch (error) {
        console.error('❌ 刪除錯誤:', error);
        showNotification('❌ 錯誤: ' + error.message);
    } finally {
        showLoading(false);
    }
}

// ===== UI 控制 =====

function renderTable() {
    const tableBody = document.getElementById('tableBody');
    if (!tableBody) return;

    const sortedList = [...shoppingList].sort((a, b) =>
        String(a.date).localeCompare(String(b.date))
    );

    tableBody.innerHTML = sortedList.map(item => {
        const validImages = (item.images || []).filter(img => img && img.trim());
        const imageHTML = validImages.length > 0 ?
            `<div class="image-gallery" onclick="openLightbox('${item.id}')">
                ${validImages.map((img, idx) =>
                `<div class="image-placeholder" style="position: relative;">
                        <img src="${img}" alt="圖片" onerror="this.parentElement.innerHTML='❌'">
                        <span class="image-count">${idx + 1}/${validImages.length}</span>
                    </div>`
            ).join('')}
            </div>` : `<div class="image-placeholder">無圖片</div>`;

        return `
            <tr>
                <td class="date px-4 py-3">${formatDate(item.date)}</td>
                <td class="px-4 py-3"><span class="sequence">${item.sequence}</span></td>
                <td class="px-4 py-3">${imageHTML}</td>
                <td class="px-4 py-3">${item.brand || '-'}</td>
                <td class="px-4 py-3">
                    <select class="form-select form-select-sm" onchange="updateShipment('${item.id}', this.value)">
                        <option value="空白" ${item.shipment === '空白' ? 'selected' : ''}>空白</option>
                        <option value="不寄送" ${item.shipment === '不寄送' ? 'selected' : ''}>不寄送</option>
                        <option value="寄送" ${item.shipment === '寄送' ? 'selected' : ''}>寄送</option>
                        <option value="部分寄送" ${item.shipment === '部分寄送' ? 'selected' : ''}>部分寄送</option>
                    </select>
                </td>
                <td class="px-4 py-3" style="white-space: pre-wrap;">${item.notes || '-'}</td>
                <td class="px-4 py-3">
                    <div class="actions">
                        <button class="btn btn-sm btn-primary" onclick="editItem('${item.id}')">編輯</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteItem('${item.id}')">刪除</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    document.getElementById('itemCount').textContent = shoppingList.length;
}

function editItem(id) {
    currentEditId = id;
    const item = shoppingList.find(i => i.id === id);

    if (!item) return;

    document.getElementById('editDate').value = formatDate(item.date);
    document.getElementById('editSequence').value = item.sequence;
    document.getElementById('editImage1').value = item.images?.[0] || '';
    document.getElementById('editImage2').value = item.images?.[1] || '';
    document.getElementById('editImage3').value = item.images?.[2] || '';
    document.getElementById('editImage4').value = item.images?.[3] || '';
    document.getElementById('editImage5').value = item.images?.[4] || '';
    document.getElementById('editImage6').value = item.images?.[5] || '';
    document.getElementById('editBrand').value = item.brand || '';
    document.getElementById('editNotes').value = item.notes || '';
    document.getElementById('editShipment').value = item.shipment || '空白';

    new bootstrap.Modal(document.getElementById('editModal')).show();
}

function toggleAddForm() {
    currentEditId = null;
    document.getElementById('editForm').reset();
    document.getElementById('editDate').value = new Date().toISOString().split('T')[0];
    new bootstrap.Modal(document.getElementById('editModal')).show();
}

function closeEditModal() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
    if (modal) modal.hide();
}

async function updateShipment(id, value) {
    const item = shoppingList.find(i => i.id === id);
    if (!item) return;

    item.shipment = value;

    showLoading(true);
    try {
        const response = await fetch(`${API_BASE_URL}/api/items/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
        });

        const result = await response.json();
        if (result.success) {
            showNotification(t('notifyUpdateSuccess'));
        }
    } finally {
        showLoading(false);
    }
}

// ===== 燈箱 =====

function openLightbox(itemId) {
    currentLightboxItemId = itemId;
    const item = shoppingList.find(i => i.id === itemId);
    if (!item) return;

    const validImages = (item.images || []).filter(img => img && img.trim());
    if (validImages.length === 0) return;

    currentImageIndex = 0;
    showLightboxImage();
    document.getElementById('lightbox').classList.add('show');
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('show');
}

function showLightboxImage() {
    const item = shoppingList.find(i => i.id === currentLightboxItemId);
    if (!item) return;

    const validImages = (item.images || []).filter(img => img && img.trim());
    if (validImages.length === 0) return;

    document.getElementById('lightboxImage').src = validImages[currentImageIndex];
    document.getElementById('lightboxCounter').textContent =
        `${currentImageIndex + 1} / ${validImages.length}`;

    document.getElementById('prevBtn').style.display = currentImageIndex === 0 ? 'none' : 'block';
    document.getElementById('nextBtn').style.display =
        currentImageIndex === validImages.length - 1 ? 'none' : 'block';
}

function prevImage() {
    if (currentImageIndex > 0) {
        currentImageIndex--;
        showLightboxImage();
    }
}

function nextImage() {
    const item = shoppingList.find(i => i.id === currentLightboxItemId);
    const validImages = (item?.images || []).filter(img => img && img.trim());
    if (currentImageIndex < validImages.length - 1) {
        currentImageIndex++;
        showLightboxImage();
    }
}

// ===== 初始化 =====

document.addEventListener('DOMContentLoaded', () => {
    // 先檢查驗證狀態
    checkAuth();

    // 檢查 URL 參數 add=1
    const params = new URLSearchParams(window.location.search);
    const addBtn = document.getElementById('addBtn');
    if (params.get('add') === '1' && addBtn) {
        addBtn.style.display = 'block';
    }

    // 檢查 API URL 參數
    const apiUrl = params.get('api');
    if (apiUrl) {
        localStorage.setItem('apiUrl', apiUrl);
        // 刷新頁面以使用新的 API URL
        window.location.href = window.location.pathname;
    }

    document.getElementById('editForm').addEventListener('submit', saveEdit);
    // loadDataFromAPI(); // 移除這裡的調用，改在登入成功後調用
});
