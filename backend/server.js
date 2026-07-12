const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Statik klasör yolunu sabit bir değişkene atama (Tam olarak projenizdeki 'docs' klasörü)
const FRONTEND_PATH = path.join(__dirname, '..', 'docs');

// JSON veri akışını işlemek için ara katman
app.use(express.json());

// 1. STATİK DOSYA SUNUMU: Tüm CSS, JS ve resim dosyalarını 'docs' klasöründen dışa açar
app.use(express.static(FRONTEND_PATH));

// 2. SAYFA YÖNLENDİRMELERİ
app.get('/', (req, res) => {
    res.sendFile(path.join(FRONTEND_PATH, 'index.html'));
});

app.get('/products', (req, res) => {
    res.sendFile(path.join(FRONTEND_PATH, 'products.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(FRONTEND_PATH, 'admin.html'));
});

// 3. SUNUCUYU BAŞLATMA VE YOL TESTİ
app.listen(PORT, () => {
    console.log(`[BAŞARILI] Sunucu çalışıyor: http://localhost:${PORT}`);
    console.log(`[DİZİN ONAYI] Hedeflenen Frontend Yolu: ${FRONTEND_PATH}`);
});