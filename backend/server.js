const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // EKLENDİ: Dizin yollarını çözümlemek için
const apiRoutes = require('./routes/api');

const app = express();
app.use(cors());
app.use(express.json());

console.log('İDE4 3D PROJECT BACKEND')
// EKLENDİ: Frontend klasörünü kök dizin olarak tanımlama ve statik yayınlama
app.use(express.static(path.join(__dirname, '../frontend')));

/* GECİCİ OLARAK İPTAL EDİLDİ (MongoDB entegrasyonu yapılana kadar)
mongoose.connect('mongodb://127.0.0.1:27017/ide4_3d', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB Bağlantısı Başarılı'))
  .catch(err => console.error('MongoDB Bağlantı Hatası:', err));
*/

app.use('/api', apiRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda aktif.`);
    console.log(`Sisteme erişim adresi: http://localhost:${PORT}`);
});