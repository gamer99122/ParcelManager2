// ===== 多語系功能 =====
const translations = {
    'zh-TW': {
        pageTitle: '📦 包裹清單管理',
        pageSubtitle: '追蹤和管理您的包裹',
        addButton: '新增項目',
        refreshButton: '🔄 重新整理',
        editButton: '編輯',
        deleteButton: '刪除',
        saveButton: '儲存',
        cancelButton: '取消',
        tableDate: '收件日期',
        tableSequence: '序號',
        tableImage: '圖片',
        tableBrand: '商家',
        tableShipment: '寄送狀態',
        tableShipDate: '寄送時間',
        tableNotes: '備註',
        tableActions: '操作',
        editTitle: '編輯項目',
        editDate: '收件日期',
        editSequence: '序號',
        editImages: '商品圖片 (最多 6 張，圖片網址)',
        editBrand: '商家',
        editNotes: '備註',
        editShipment: '寄送狀態',
        editShipDate: '寄送時間',
        lockButton: '🔒 鎖住',
        unlockButton: '🔓 解鎖',
        lockedNotice: '🔒 此項目已鎖住，無法編輯',
        shipmentBlank: '',
        shipmentNo: '不寄送',
        shipmentYes: '寄送',
        shipmentPartial: '部分寄送',
        notifySuccess: '✅ 資料已同步',
        notifyLoadError: '❌ 讀取失敗',
        notifySaveSuccess: '✅ 儲存成功',
        notifySaveError: '❌ 儲存失敗',
        notifyDeleteSuccess: '✅ 已刪除',
        notifyDeleteError: '❌ 刪除失敗',
        notifyUpdateSuccess: '✅ 狀態已更新',
        notifyNoteSuccess: '✅ 備註已更新',
        notifyNoteError: '❌ 備註更新失敗',
        deleteConfirm: '確定刪除？',
        loading: '載入中...',
        loadingData: '正在載入資料...',
        loadingHint: '如果清單載入不順利，請按下「重新整理」按鈕',
        noImage: '無圖片',
        noNotes: '無備註',
        itemCount: '項商品',
        totalCount: '總共',
        imagePlaceholder: '圖片'
    },
    ja: {
        pageTitle: '📦 荷物リスト管理',
        pageSubtitle: '荷物を追跡・管理',
        addButton: '新規追加',
        refreshButton: '🔄 更新',
        editButton: '編集',
        deleteButton: '削除',
        saveButton: '保存',
        cancelButton: 'キャンセル',
        tableDate: '受取日',
        tableSequence: '番号',
        tableImage: '画像',
        tableBrand: 'ショップ',
        tableShipment: '配送状況',
        tableShipDate: '配送日',
        tableNotes: '備考',
        tableActions: '操作',
        editTitle: '項目を編集',
        editDate: '受取日',
        editSequence: '番号',
        editImages: '商品画像（最大6枚、画像URL）',
        editBrand: 'ショップ',
        editNotes: '備考',
        editShipment: '配送状況',
        editShipDate: '配送日',
        lockButton: '🔒 ロック',
        unlockButton: '🔓 ロック解除',
        lockedNotice: '🔒 この項目はロックされており、編集できません',
        shipmentBlank: '',
        shipmentNo: '配送なし',
        shipmentYes: '配送',
        shipmentPartial: '一部配送',
        notifySuccess: '✅ データを同期しました',
        notifyLoadError: '❌ 読み込みに失敗しました',
        notifySaveSuccess: '✅ 保存しました',
        notifySaveError: '❌ 保存に失敗しました',
        notifyDeleteSuccess: '✅ 削除しました',
        notifyDeleteError: '❌ 削除に失敗しました',
        notifyUpdateSuccess: '✅ 状態を更新しました',
        notifyNoteSuccess: '✅ 備考を更新しました',
        notifyNoteError: '❌ 備考の更新に失敗しました',
        deleteConfirm: '削除してもよろしいですか？',
        loading: '読み込み中...',
        loadingData: 'データを読み込んでいます...',
        loadingHint: 'リストの読み込みがうまくいかない場合は、「更新」ボタンを押してください',
        noImage: '画像なし',
        noNotes: '備考なし',
        itemCount: '件の商品',
        totalCount: '合計',
        imagePlaceholder: '画像'
    }
};

let currentLang = localStorage.getItem('language');

if (!currentLang) {
    const browserLang = navigator.language || navigator.userLanguage;
    currentLang = browserLang && browserLang.toLowerCase().startsWith('zh') ? 'zh-TW' : 'ja';
}

function t(key) {
    const value = translations[currentLang]?.[key];
    if (value !== undefined) return value;
    const fallback = translations['zh-TW']?.[key];
    return fallback !== undefined ? fallback : key;
}

function switchLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    updatePageLanguage();
    renderTable();
}

function updatePageLanguage() {
    const loginTitle = document.querySelector('.login-title');
    const loginSubtitle = document.querySelector('.login-subtitle');
    const loginInput = document.getElementById('loginCode');
    const loginButton = document.querySelector('.login-button');

    if (loginTitle) loginTitle.textContent = t('loginTitle');
    if (loginSubtitle) loginSubtitle.textContent = t('loginSubtitle');
    if (loginInput) loginInput.placeholder = t('loginPlaceholder');
    if (loginButton) loginButton.textContent = t('loginButton');

    const pageTitle = document.querySelector('.display-4');
    const pageSubtitle = document.querySelector('.lead');
    if (pageTitle) pageTitle.textContent = t('pageTitle');
    if (pageSubtitle) pageSubtitle.textContent = t('pageSubtitle');

    const addBtn = document.getElementById('addBtn');
    const refreshBtn = document.querySelector('.btn-success');
    if (addBtn) addBtn.textContent = t('addButton');
    if (refreshBtn) refreshBtn.textContent = t('refreshButton');

    const headers = document.querySelectorAll('thead th');
    const actionsHeader = document.getElementById('actionsHeader');
    const canEdit = isEditMode();

    if (headers.length >= 9) {
        headers[0].textContent = '#';
        headers[1].textContent = t('tableDate');
        headers[2].textContent = t('tableSequence');
        headers[3].textContent = t('tableImage');
        headers[4].textContent = t('tableBrand');
        headers[5].textContent = t('tableShipment');
        headers[6].textContent = t('tableShipDate');
        headers[7].textContent = t('tableNotes');
        headers[8].textContent = t('tableActions');
    }

    const shoppingTable = document.querySelector('.shopping-table');
    if (canEdit) {
        if (actionsHeader) actionsHeader.style.display = '';
        if (shoppingTable) shoppingTable.classList.remove('view-mode');
    } else {
        if (actionsHeader) actionsHeader.style.display = 'none';
        if (shoppingTable) shoppingTable.classList.add('view-mode');
    }

    const modalTitle = document.querySelector('.modal-title');
    if (modalTitle) modalTitle.textContent = t('editTitle');

    updateFormLabels();

    const loadingHint = document.getElementById('loadingHint');
    if (loadingHint) loadingHint.innerHTML = `<i class="bi bi-info-circle"></i> ${t('loadingHint')}`;

    const totalCountLabel = document.getElementById('totalCountLabel');
    const itemCountSuffix = document.getElementById('itemCountSuffix');
    const loadingText = document.getElementById('loadingText');
    const tableLoadingText = document.getElementById('tableLoadingText');
    const btnCancel = document.getElementById('btnCancel');
    const btnSave = document.getElementById('btnSave');

    if (totalCountLabel) totalCountLabel.textContent = t('totalCount');
    if (itemCountSuffix) itemCountSuffix.textContent = t('itemCount');
    if (loadingText) loadingText.textContent = t('loading');
    if (tableLoadingText) tableLoadingText.textContent = t('loading');
    if (btnCancel) btnCancel.textContent = t('cancelButton');
    if (btnSave) btnSave.textContent = t('saveButton');

    updateLanguageButtons();
}

function updateFormLabels() {
    const labels = document.querySelectorAll('.modal-body label');
    if (labels.length >= 7) {
        labels[0].textContent = t('editDate');
        labels[1].textContent = t('editSequence');
        labels[2].textContent = t('editImages');
        labels[3].textContent = t('editBrand');
        labels[4].textContent = t('editNotes');
        labels[5].textContent = t('editShipment');
        labels[6].textContent = t('editShipDate');
    }

    const shipmentSelect = document.getElementById('editShipment');
    if (!shipmentSelect) return;

    const currentValue = shipmentSelect.value;
    shipmentSelect.innerHTML = `
        <option value="空白" class="status-blank">${t('shipmentBlank')}</option>
        <option value="不寄送" class="status-no">${t('shipmentNo')}</option>
        <option value="寄送" class="status-yes">${t('shipmentYes')}</option>
        <option value="部分寄送" class="status-partial">${t('shipmentPartial')}</option>
    `;
    if (currentValue) shipmentSelect.value = currentValue;
    updateShipmentColor(shipmentSelect);
    shipmentSelect.onchange = function () {
        updateShipmentColor(this);
    };
}

function updateLanguageButtons() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === currentLang);
    });
}

// 自動判斷 API 地址：本機開發用 localhost，線上用 Railway
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : 'https://parcelmanager2-production.up.railway.app';

let shoppingList = [];
let currentEditId = null;
let currentLightboxItemId = null;
let currentImageIndex = 0;

function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    const loadingText = document.getElementById('loadingText');
    if (!overlay) return;

    if (show) {
        overlay.classList.remove('d-none');
        if (loadingText) loadingText.textContent = t('loadingData');
    } else {
        overlay.classList.add('d-none');
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
        return `${str.slice(0, 4)}-${str.slice(4, 6)}-${str.slice(6, 8)}`;
    }
    return str;
}

function isEditMode() {
    const params = new URLSearchParams(window.location.search);
    return params.get('edit') === '1';
}

function isItemLocked(item) {
    // 統一的鎖定判定邏輯：支援多種格式
    return item?.locked === true || item?.locked === 1 || item?.locked === '1' || item?.locked === 'true';
}

function isLockedForGeneralUser(item) {
    return !isEditMode() && isItemLocked(item);
}

async function loadDataFromAPI(retryCount = 0, isInitialLoad = false) {
    try {
        if (retryCount === 0) showToast(t('loadingData'), 2000);

        const response = await fetch(`${API_BASE_URL}/api/items`);
        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
            shoppingList = result.data.map(item => ({
                ...item,
                id: item._id
                // 不需要顯式映射 locked，因為 ...item 會帶過來
            }));
            renderTable();
            showNotification(t('notifySuccess'));
        } else {
            throw new Error(result.message || t('notifyLoadError'));
        }
    } catch (error) {
        console.error('讀取錯誤:', error);
        showNotification(`${t('notifyLoadError')}: ${error.message}`);

        const maxRetries = isInitialLoad ? 3 : 1;
        if (retryCount < maxRetries) {
            const delay = (retryCount + 1) * 3000;
            setTimeout(() => loadDataFromAPI(retryCount + 1, isInitialLoad), delay);
        } else if (isInitialLoad) {
            showToast('⚠️ 自動載入失敗，請點擊「重新整理」按鈕', 5000);
        }
    }
}

async function saveEdit(event) {
    event.preventDefault();

    if (!isEditMode()) {
        showToast(t('lockedNotice'));
        closeEditModal();
        return;
    }

    const currentItem = shoppingList.find(i => i.id === currentEditId);
    if (currentEditId && isLockedForGeneralUser(currentItem)) {
        showToast(t('lockedNotice'));
        closeEditModal();
        return;
    }

    showToast(t('notifySaveSuccess'), 1000);

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
            shipment: document.getElementById('editShipment').value,
            shipDate: document.getElementById('editShipDate').value || null,
            locked: currentItem?.locked || false
        };

        let url = `${API_BASE_URL}/api/items`;
        let method = 'POST';

        if (currentEditId) {
            url += `/${currentEditId}`;
            method = 'PUT';
        }

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(itemData)
        });

        const result = await response.json();
        if (result.success) {
            closeEditModal();
            await loadDataFromAPI();
            showNotification(t('notifySaveSuccess'));
        } else {
            showNotification(`${t('notifySaveError')}: ${result.message}`);
        }
    } catch (error) {
        console.error('儲存錯誤:', error);
        showNotification(`❌ ${error.message}`);
    }
}

async function deleteItem(id) {
    if (!isEditMode()) {
        showToast('❌ 無刪除權限', 2000);
        return;
    }

    if (!confirm(t('deleteConfirm'))) return;

    showToast(t('notifyDeleteSuccess'), 1000);
    try {
        const response = await fetch(`${API_BASE_URL}/api/items/${id}`, {
            method: 'DELETE'
        });
        const result = await response.json();

        if (result.success) {
            await loadDataFromAPI();
            showNotification(t('notifyDeleteSuccess'));
        } else {
            showNotification(`${t('notifyDeleteError')}: ${result.message}`);
        }
    } catch (error) {
        console.error('刪除錯誤:', error);
        showNotification(`❌ 錯誤: ${error.message}`);
    }
}

function renderTable() {
    const tableBody = document.getElementById('tableBody');
    if (!tableBody) return;

    const sortedList = [...shoppingList].sort((a, b) =>
        String(a.date).localeCompare(String(b.date))
    );
    const canEdit = isEditMode();

    tableBody.innerHTML = sortedList.map((item, index) => {
        const validImages = (item.images || []).filter(img => img && img.trim());
        const imageHTML = validImages.length > 0
            ? `<div class="image-gallery" onclick="openLightbox('${item.id}')">
                ${validImages.map((img, idx) =>
                    `<div class="image-placeholder" style="position: relative;">
                        <img src="${img}" alt="${t('imagePlaceholder')}" onerror="this.parentElement.innerHTML='❌'">
                        <span class="image-count">${idx + 1}/${validImages.length}</span>
                    </div>`
                ).join('')}
            </div>`
            : `<div class="image-placeholder">${t('noImage')}</div>`;

        const isLocked = isItemLocked(item);
        const lockedForGeneralUser = !canEdit && isLocked;
        const editButtonHTML = canEdit
            ? `<button class="btn btn-sm btn-primary" onclick="editItem('${item.id}')">${t('editButton')}</button>`
            : '';
        const deleteButtonHTML = canEdit
            ? `<button class="btn btn-sm btn-danger" onclick="deleteItem('${item.id}')">${t('deleteButton')}</button>`
            : '';
        const shipmentDisplay = lockedForGeneralUser
            ? `<span class="shipment-readonly badge ${getShipmentClass(item.shipment)}">🔒 ${getShipmentLabel(item.shipment)}</span>`
            : `<select class="form-select form-select-sm ${getShipmentClass(item.shipment)}"
                onchange="updateShipmentColor(this); updateShipment('${item.id}', this.value)">
                    <option value="空白" class="status-blank" ${item.shipment === '空白' ? 'selected' : ''}>${t('shipmentBlank')}</option>
                    <option value="不寄送" class="status-no" ${item.shipment === '不寄送' ? 'selected' : ''}>${t('shipmentNo')}</option>
                    <option value="寄送" class="status-yes" ${item.shipment === '寄送' ? 'selected' : ''}>${t('shipmentYes')}</option>
                    <option value="部分寄送" class="status-partial" ${item.shipment === '部分寄送' ? 'selected' : ''}>${t('shipmentPartial')}</option>
                </select>`;

        return `
            <tr class="${isLocked ? 'locked-row' : ''}">
                <td class="px-3 py-3 fw-bold text-secondary" data-label="#">
                    ${isLocked ? '<span class="lock-icon-inline" title="' + t('lockedNotice') + '">🔒</span>' : ''}${index + 1}
                </td>
                <td class="date px-4 py-3" data-label="${t('tableDate')}">${formatDate(item.date)}</td>
                <td class="px-4 py-3" data-label="${t('tableSequence')}">
                    <span class="badge bg-light text-dark border sequence-badge">${item.sequence}</span>
                </td>
                <td class="px-4 py-3" data-label="${t('tableImage')}">${imageHTML}</td>
                <td class="px-4 py-3" data-label="${t('tableBrand')}">${item.brand || '-'}</td>
                <td class="px-4 py-3" data-label="${t('tableShipment')}">${shipmentDisplay}</td>
                <td class="px-4 py-3" data-label="${t('tableShipDate')}">${formatDate(item.shipDate) || '-'}</td>
                <td class="px-4 py-3" data-label="${t('tableNotes')}">
                    <div class="notes-container" id="notes-${item.id}">
                        <div class="notes-display" id="notes-display-${item.id}">
                            <span class="notes-text">${item.notes || t('noNotes')}</span>
                            ${lockedForGeneralUser ? '' : `<button class="btn btn-sm btn-outline-secondary notes-edit-btn" onclick="startEditNotes('${item.id}')" title="${t('editTitle')}">
                                ${t('editButton')}
                            </button>`}
                        </div>
                        ${lockedForGeneralUser ? '' : `<div class="notes-edit" id="notes-edit-${item.id}" style="display: none;">
                            <textarea class="form-control notes-textarea" id="notes-input-${item.id}" rows="2" style="min-height: 60px; resize: vertical;">${item.notes || ''}</textarea>
                            <div class="notes-actions mt-2">
                                <button class="btn btn-sm btn-success" onclick="saveNotes('${item.id}')">✔ ${t('saveButton')}</button>
                                <button class="btn btn-sm btn-secondary" onclick="cancelEditNotes('${item.id}')">✖ ${t('cancelButton')}</button>
                            </div>
                        </div>`}
                    </div>
                </td>
                ${canEdit ? `<td class="px-4 py-3" data-label="${t('tableActions')}">
                    <div class="actions">
                        ${editButtonHTML}
                        <button class="btn btn-sm ${isLocked ? 'btn-warning' : 'btn-outline-warning'}" onclick="toggleLock('${item.id}')" title="${isLocked ? t('unlockButton') : t('lockButton')}">
                            ${isLocked ? t('unlockButton') : t('lockButton')}
                        </button>
                        ${deleteButtonHTML}
                    </div>
                </td>` : ''}
            </tr>
        `;
    }).join('');

    document.getElementById('itemCount').textContent = shoppingList.length;
}

function editItem(id) {
    if (!isEditMode()) {
        showToast('❌ 無編輯權限', 2000);
        return;
    }

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
    document.getElementById('editShipDate').value = formatDate(item.shipDate) || '';

    new bootstrap.Modal(document.getElementById('editModal')).show();
}

function toggleAddForm() {
    if (!isEditMode()) {
        showToast('❌ 無新增權限', 2000);
        return;
    }

    currentEditId = null;
    document.getElementById('editForm').reset();
    document.getElementById('editDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('editSequence').value = '1';
    new bootstrap.Modal(document.getElementById('editModal')).show();
}

function closeEditModal() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
    if (modal) modal.hide();
}

async function updateShipment(id, value) {
    const item = shoppingList.find(i => i.id === id);
    if (!item) return;

    if (isLockedForGeneralUser(item)) {
        showToast(t('lockedNotice'));
        renderTable();
        return;
    }

    item.shipment = value;

    try {
        const response = await fetch(`${API_BASE_URL}/api/items/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
        });

        const result = await response.json();
        if (result.success) showToast(t('notifyUpdateSuccess'), 1500);
    } catch (error) {
        console.error('更新錯誤:', error);
    }
}

function startEditNotes(id) {
    const item = shoppingList.find(i => i.id === id);
    if (isLockedForGeneralUser(item)) {
        showToast(t('lockedNotice'));
        return;
    }

    const displayDiv = document.getElementById(`notes-display-${id}`);
    const editDiv = document.getElementById(`notes-edit-${id}`);
    if (displayDiv && editDiv) {
        displayDiv.style.display = 'none';
        editDiv.style.display = 'block';

        const textarea = document.getElementById(`notes-input-${id}`);
        if (textarea) {
            textarea.focus();
            textarea.setSelectionRange(textarea.value.length, textarea.value.length);
        }
    }
}

function cancelEditNotes(id) {
    const displayDiv = document.getElementById(`notes-display-${id}`);
    const editDiv = document.getElementById(`notes-edit-${id}`);
    const item = shoppingList.find(i => i.id === id);

    if (displayDiv && editDiv && item) {
        const textarea = document.getElementById(`notes-input-${id}`);
        if (textarea) textarea.value = item.notes || '';
        displayDiv.style.display = 'flex';
        editDiv.style.display = 'none';
    }
}

async function saveNotes(id) {
    const item = shoppingList.find(i => i.id === id);
    if (isLockedForGeneralUser(item)) {
        showToast(t('lockedNotice'));
        return;
    }

    const textarea = document.getElementById(`notes-input-${id}`);
    if (!textarea || !item) return;

    const newValue = textarea.value.trim();
    if (item.notes === newValue) {
        cancelEditNotes(id);
        return;
    }

    item.notes = newValue;

    try {
        const response = await fetch(`${API_BASE_URL}/api/items/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
        });

        const result = await response.json();
        if (result.success) {
            showToast(t('notifyNoteSuccess'), 1500);
            const displayText = document.querySelector(`#notes-display-${id} .notes-text`);
            if (displayText) displayText.textContent = newValue || t('noNotes');

            const displayDiv = document.getElementById(`notes-display-${id}`);
            const editDiv = document.getElementById(`notes-edit-${id}`);
            if (displayDiv && editDiv) {
                displayDiv.style.display = 'flex';
                editDiv.style.display = 'none';
            }
        }
    } catch (error) {
        console.error('更新備註錯誤:', error);
        showToast(t('notifyNoteError'), 2000);
    }
}

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
    document.getElementById('lightboxCounter').textContent = `${currentImageIndex + 1} / ${validImages.length}`;
    document.getElementById('prevBtn').style.display = currentImageIndex === 0 ? 'none' : 'block';
    document.getElementById('nextBtn').style.display = currentImageIndex === validImages.length - 1 ? 'none' : 'block';
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

let touchStartX = 0;
let touchEndX = 0;

function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
}

function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) <= swipeThreshold) return;

    if (diff > 0) {
        nextImage();
    } else {
        prevImage();
    }
}

function initLightboxTouchEvents() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    lightbox.addEventListener('touchstart', handleTouchStart, { passive: true });
    lightbox.addEventListener('touchend', handleTouchEnd, { passive: true });
}

function getShipmentClass(status) {
    switch (status) {
        case '不寄送':
            return 'status-no';
        case '寄送':
            return 'status-yes';
        case '部分寄送':
            return 'status-partial';
        default:
            return 'status-blank';
    }
}

function getShipmentLabel(status) {
    switch (status) {
        case '不寄送':
            return t('shipmentNo');
        case '寄送':
            return t('shipmentYes');
        case '部分寄送':
            return t('shipmentPartial');
        default:
            return t('shipmentBlank');
    }
}

function updateShipmentColor(selectElement) {
    selectElement.classList.remove('status-blank', 'status-no', 'status-yes', 'status-partial');
    selectElement.classList.add(getShipmentClass(selectElement.value));
}

async function toggleLock(id) {
    if (!isEditMode()) return;

    const item = shoppingList.find(i => i.id === id);
    if (!item) return;

    const newLockedState = !item.locked;
    showLoading(true);

    try {
        const response = await fetch(`${API_BASE_URL}/api/items/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                date: item.date,
                sequence: item.sequence,
                images: item.images,
                brand: item.brand,
                notes: item.notes,
                shipment: item.shipment,
                shipDate: item.shipDate,
                locked: newLockedState
            })
        });

        const result = await response.json();
        if (result.success) {
            item.locked = newLockedState;
            renderTable();
            showToast(newLockedState ? '🔒 已鎖住' : '🔓 已解鎖', 1500);
        } else {
            showToast('❌ 操作失敗', 2000);
        }
    } catch (error) {
        console.error('切換鎖定錯誤:', error);
        showToast(`❌ 操作失敗: ${error.message}`, 2000);
    } finally {
        showLoading(false);
    }
}

window.switchLanguage = switchLanguage;
window.updateShipmentColor = updateShipmentColor;
window.toggleLock = toggleLock;
window.editItem = editItem;
window.deleteItem = deleteItem;
window.toggleAddForm = toggleAddForm;
window.closeEditModal = closeEditModal;
window.startEditNotes = startEditNotes;
window.cancelEditNotes = cancelEditNotes;
window.saveNotes = saveNotes;
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.prevImage = prevImage;
window.nextImage = nextImage;
window.loadDataFromAPI = loadDataFromAPI;


document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const addBtn = document.getElementById('addBtn');
    const shipDateGroup = document.getElementById('shipDateGroup');

    if (params.get('edit') === '1') {
        if (addBtn) addBtn.style.display = 'block';
        if (shipDateGroup) shipDateGroup.style.display = 'block';
    }

    const apiUrl = params.get('api');
    if (apiUrl) {
        localStorage.setItem('apiUrl', apiUrl);
        window.location.href = window.location.pathname;
    }

    document.getElementById('editForm').addEventListener('submit', saveEdit);
    initLightboxTouchEvents();
    updatePageLanguage();
    loadDataFromAPI(0, true);
});
