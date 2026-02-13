// ===== API 配置 =====
// Railway 後端 URL
const API_BASE_URL = 'https://parcelmanager2-production.up.railway.app';

// 數據存儲
let shoppingList = [];
let currentEditId = null;
let currentLightboxItemId = null;
let currentImageIndex = 0;
let isSaving = false; // 防止重複提交
let allowDelete = false; // 是否允許刪除（基於 ?add=1 參數）

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
            console.log('📊 shoppingList 已更新，共', shoppingList.length, '筆:', shoppingList.map(item => ({ id: item.id, sequence: item.sequence })));
            renderTable();
            showNotification('✅ 資料已同步');
        } else {
            throw new Error(result.message || '讀取失敗');
        }
    } catch (error) {
        console.error('❌ 讀取錯誤:', error);
        showNotification('❌ 讀取失敗: ' + error.message);

        if (retryCount < 1) {
            console.log('⏳ 3 秒後自動重試...');
            setTimeout(() => loadDataFromAPI(retryCount + 1), 3000);
        }
    } finally {
        showLoading(false);
    }
}

async function saveEdit(event) {
    console.log('🚨 saveEdit 被觸發！event:', event);

    event.preventDefault();
    console.log('✅ 已調用 preventDefault()');

    // 防止重複提交 - 使用更強的檢查
    if (isSaving) {
        console.log('⚠️ ⚠️ ⚠️ 正在儲存，請勿重複提交！isSaving 已為 true');
        return;
    }

    isSaving = true;
    console.log('🔐 已設置 isSaving = true');

    showLoading(true);

    // 禁用提交按鈕
    const submitBtn = event.target?.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = '儲存中...';
        console.log('🔒 提交按鈕已禁用');
    }

    const requestId = Math.random().toString(36).substring(7);
    console.log(`📝 [${requestId}] saveEdit 開始執行`);

    try {
        const itemData = {
            date: document.getElementById('editDate').value,
            sequence: document.getElementById('editSequence').value,
            images: [
                document.getElementById('editImage1').value,
                document.getElementById('editImage2').value,
                document.getElementById('editImage3').value
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

        console.log(`📝 [${requestId}] 正在發送 ${method} 請求到:`, url);
        console.log(`📝 [${requestId}] 數據:`, itemData);

        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(itemData)
        });

        console.log(`📝 [${requestId}] 收到回應，狀態: ${response.status}`);
        const result = await response.json();
        console.log(`📝 [${requestId}] 回應數據:`, result);

        if (result.success) {
            console.log(`📝 [${requestId}] ✅ 儲存成功！創建的資料:`, result.data);
            console.log(`📝 [${requestId}] 關閉模態框`);
            closeEditModal();

            console.log(`📝 [${requestId}] 開始重新加載數據...`);
            await loadDataFromAPI();
            console.log(`📝 [${requestId}] 數據重新加載完成。目前 shoppingList 有 ${shoppingList.length} 筆`);

            showNotification('✅ 儲存成功');
        } else {
            showNotification('❌ 儲存失敗: ' + result.message);
        }
    } catch (error) {
        console.error(`❌ [${requestId}] 儲存錯誤:`, error);
        showNotification('❌ 錯誤: ' + error.message);
    } finally {
        isSaving = false;
        console.log('🔓 已設置 isSaving = false');

        showLoading(false);

        // 恢復提交按鈕
        const submitBtn = document.querySelector('#editForm button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = '儲存';
            console.log('🔓 提交按鈕已恢復，可以再次提交');
        } else {
            console.warn('⚠️ 找不到提交按鈕！');
        }

        console.log(`📝 [${requestId}] saveEdit 執行完成`);
    }
}

async function deleteItem(id) {
    // 檢查是否允許刪除
    if (!allowDelete) {
        showNotification('❌ 刪除功能已禁用');
        console.warn('❌ 刪除被拒絕: allowDelete 為 false');
        return;
    }

    if (!confirm('確定刪除？')) return;

    showLoading(true);
    try {
        const response = await fetch(`${API_BASE_URL}/api/items/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
            await loadDataFromAPI();
            showNotification('✅ 已刪除');
        } else {
            showNotification('❌ 刪除失敗: ' + result.message);
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

    console.log('🎨 renderTable: 準備渲染', sortedList.length, '筆項目');
    sortedList.forEach((item, idx) => {
        console.log(`  [${idx + 1}] ID: ${item.id}, 序號: ${item.sequence}`);
    });

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
                        ${allowDelete ? `<button class="btn btn-sm btn-danger" onclick="deleteItem('${item.id}')">刪除</button>` : ''}
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
            showNotification('✅ 狀態已更新');
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
    // 檢查 URL 參數 add=1
    const params = new URLSearchParams(window.location.search);

    // 檢查是否啟用新增和刪除功能
    if (params.get('add') === '1') {
        allowDelete = true;
        const addBtn = document.getElementById('addBtn');
        if (addBtn) {
            addBtn.style.display = 'block';
        }
    }

    // 檢查 API URL 參數
    const apiUrl = params.get('api');
    if (apiUrl) {
        localStorage.setItem('apiUrl', apiUrl);
        // 刷新頁面以使用新的 API URL
        window.location.href = window.location.pathname;
    }

    const editForm = document.getElementById('editForm');
    if (editForm) {
        console.log('✅ editForm 已找到');
    } else {
        console.error('❌ editForm 未找到！');
    }

    console.log('🚀 初始化完成，開始載入資料');
    loadDataFromAPI();
});
