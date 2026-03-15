require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

// 中間件
app.use(cors());
app.use(express.json());

// MongoDB 連接
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'parcelmanager';
const COLLECTION_NAME = 'items';

let db;
let itemsCollection;

// 連接 MongoDB
async function connectDB() {
    try {
        console.log('🔌 正在連接 MongoDB...');
        console.log('📍 MongoDB URI:', MONGO_URI.substring(0, 50) + '...');

        const client = new MongoClient(MONGO_URI, {
            maxPoolSize: 10,
            retryWrites: true,
            w: 'majority'
        });

        await client.connect();
        console.log('✅ MongoDB 已連接成功');

        db = client.db(DB_NAME);
        itemsCollection = db.collection(COLLECTION_NAME);

        // 建立索引
        await itemsCollection.createIndex({ date: 1 });
        await itemsCollection.createIndex({ createdAt: 1 });
        console.log('✅ 索引已建立');

        return true;
    } catch (error) {
        console.error('❌ MongoDB 連接失敗:', error.message);
        console.error('完整錯誤:', error);
        return false;
    }
}

// ===== API 路由 =====

// 獲取所有項目
app.get('/api/items', async (req, res) => {
    try {
        const items = await itemsCollection
            .find({})
            .sort({ date: 1 })
            .toArray();

        res.json({
            success: true,
            data: items,
            message: '讀取成功'
        });
    } catch (error) {
        console.error('讀取錯誤:', error);
        res.status(500).json({
            success: false,
            message: '讀取失敗: ' + error.message
        });
    }
});

// 新增項目
app.post('/api/items', async (req, res) => {
    const requestId = Math.random().toString(36).substring(7);
    console.log(`📝 [${requestId}] POST /api/items 收到請求`);
    console.log(`📝 [${requestId}] 數據:`, { sequence: req.body.sequence, date: req.body.date });

    try {
        const item = {
            date: req.body.date,
            sequence: req.body.sequence,
            images: req.body.images || ['', '', '', '', '', ''],
            brand: req.body.brand,
            notes: req.body.notes,
            shipment: req.body.shipment || '空白',
            shipDate: req.body.shipDate || null,
            locked: req.body.locked === true || req.body.locked === 'true' || req.body.locked === 1,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        console.log(`📝 [${requestId}] 準備插入 MongoDB:`, item);
        const result = await itemsCollection.insertOne(item);
        console.log(`📝 [${requestId}] ✅ 插入成功，ID: ${result.insertedId}`);

        res.status(201).json({
            success: true,
            data: { ...item, _id: result.insertedId },
            message: '新增成功'
        });
    } catch (error) {
        console.error(`❌ [${requestId}] 新增錯誤:`, error);
        res.status(500).json({
            success: false,
            message: '新增失敗: ' + error.message
        });
    }
});

// 更新項目
app.put('/api/items/:id', async (req, res) => {
    try {
        const { ObjectId } = require('mongodb');
        const itemId = new ObjectId(req.params.id);

        const currentItem = await itemsCollection.findOne({ _id: itemId });
        if (!currentItem) {
            return res.status(404).json({ success: false, message: '項目不存在' });
        }

        // 寬鬆判定鎖定狀態：支援布林、字串、數字
        let newLocked = currentItem.locked || false;
        if (req.body.locked !== undefined) {
            newLocked = req.body.locked === true || req.body.locked === 'true' || req.body.locked === 1 || req.body.locked === '1';
        }

        console.log(`🔄 更新項目 ${req.params.id}:`, {
            before: currentItem.locked,
            received: req.body.locked,
            after: newLocked
        });

        const updatedItem = {
            date: req.body.date || currentItem.date,
            sequence: req.body.sequence || currentItem.sequence,
            images: req.body.images || currentItem.images || ['', '', '', '', '', ''],
            brand: req.body.brand !== undefined ? req.body.brand : currentItem.brand,
            notes: req.body.notes !== undefined ? req.body.notes : currentItem.notes,
            shipment: req.body.shipment || currentItem.shipment || '空白',
            shipDate: req.body.shipDate !== undefined ? req.body.shipDate : currentItem.shipDate,
            locked: newLocked,
            updatedAt: new Date()
        };

        console.log('📝 要保存的 updatedItem:', JSON.stringify(updatedItem, null, 2));

        const result = await itemsCollection.findOneAndUpdate(
            { _id: itemId },
            { $set: updatedItem },
            { returnDocument: 'after' }
        );

        console.log('✅ MongoDB 更新結果:', result.value ? 'OK' : 'FAILED');
        console.log('📋 返回的文檔 locked 值:', result.value?.locked);

        // 相容不同版本的 MongoDB Driver
        const finalDoc = result.value || result;

        res.json({
            success: true,
            data: finalDoc,
            message: '更新成功'
        });
    } catch (error) {
        console.error('更新錯誤:', error);
        res.status(500).json({ success: false, message: '更新失敗: ' + error.message });
    }
});

// 刪除項目
app.delete('/api/items/:id', async (req, res) => {
    try {
        const { ObjectId } = require('mongodb');
        const itemId = new ObjectId(req.params.id);

        const result = await itemsCollection.deleteOne({ _id: itemId });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: '項目不存在'
            });
        }

        res.json({
            success: true,
            message: '刪除成功'
        });
    } catch (error) {
        console.error('刪除錯誤:', error);
        res.status(500).json({
            success: false,
            message: '刪除失敗: ' + error.message
        });
    }
});

// 健康檢查 - 包含 MongoDB 連接狀態
app.get('/api/health', async (req, res) => {
    try {
        // 嘗試查詢 MongoDB
        const adminDb = db?.admin();
        const status = await adminDb?.ping();

        res.json({
            status: 'OK',
            mongodb: 'CONNECTED',
            timestamp: new Date()
        });
    } catch (error) {
        res.status(503).json({
            status: 'ERROR',
            mongodb: 'DISCONNECTED',
            error: error.message,
            timestamp: new Date()
        });
    }
});

// 舊的健康檢查端點（相容性）
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});

// 啟動服務器
app.listen(PORT, async () => {
    console.log(`🚀 服務器運行於 port ${PORT}`);
    console.log(`📍 環境變數 MONGODB_URI:`, process.env.MONGODB_URI ? '✅ 已設置' : '❌ 未設置');

    const connected = await connectDB();
    if (!connected) {
        console.error('⚠️  警告：MongoDB 未連接，某些功能可能無法使用');
    }
});
