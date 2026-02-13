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
    try {
        const item = {
            date: req.body.date,
            sequence: req.body.sequence,
            images: req.body.images || ['', '', ''],
            brand: req.body.brand,
            notes: req.body.notes,
            shipment: req.body.shipment || '空白',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await itemsCollection.insertOne(item);

        res.status(201).json({
            success: true,
            data: { ...item, _id: result.insertedId },
            message: '新增成功'
        });
    } catch (error) {
        console.error('新增錯誤:', error);
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

        const updatedItem = {
            date: req.body.date,
            sequence: req.body.sequence,
            images: req.body.images || ['', '', ''],
            brand: req.body.brand,
            notes: req.body.notes,
            shipment: req.body.shipment || '空白',
            updatedAt: new Date()
        };

        const result = await itemsCollection.findOneAndUpdate(
            { _id: itemId },
            { $set: updatedItem },
            { returnDocument: 'after' }
        );

        if (!result.value) {
            return res.status(404).json({
                success: false,
                message: '項目不存在'
            });
        }

        res.json({
            success: true,
            data: result.value,
            message: '更新成功'
        });
    } catch (error) {
        console.error('更新錯誤:', error);
        res.status(500).json({
            success: false,
            message: '更新失敗: ' + error.message
        });
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

// 健康檢查
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
