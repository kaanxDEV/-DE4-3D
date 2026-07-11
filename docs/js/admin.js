document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('product-form');
    const productTableBody = document.getElementById('admin-product-table');

    function getStoredProducts() {
        let data = localStorage.getItem('ide4_products');
        return data ? JSON.parse(data) : [];
    }

    // Try-Catch Korumalı Kaydetme Fonksiyonu
    function saveStoredProducts(products) {
        try {
            localStorage.setItem('ide4_products', JSON.stringify(products));
            return true;
        } catch (error) {
            if (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                alert("HATA: Tarayıcının hafıza sınırı (5MB) doldu! Lütfen yüklediğiniz fotoğrafların boyutunu küçültün (mümkünse 300 KB altında olsun) veya listedeki eski ürünlerden bazılarını silin.");
            } else {
                alert("Kaydetme sırasında teknik bir hata oluştu: " + error.message);
            }
            return false;
        }
    }

    function updateAdminMetrics() {
        const products = getStoredProducts();
        if (document.getElementById('stat-products')) {
            document.getElementById('stat-products').innerText = products.length;
        }
    }

    function loadAdminProductsTable() {
        if (!productTableBody) return;
        const products = getStoredProducts();
        productTableBody.innerHTML = '';
        
        if(products.length === 0) {
            productTableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Sistemde kayıtlı ürün bulunamadı. Yeni ürün ekleyin.</td></tr>';
            return;
        }

        products.forEach((p, index) => {
            const tr = document.createElement('tr');
            const displayPrice = p.priceLow ? `${p.priceLow} - ${p.priceHigh} TL` : `${p.price} TL`;

            tr.innerHTML = `
                <td><img src="${p.imageUrl}" alt="" onerror="this.src='https://via.placeholder.com/50'"></td>
                <td><strong>${p.name}</strong></td>
                <td>${p.category || 'Genel'}</td>
                <td><strong>${displayPrice}</strong></td>
                <td><button class="btn-delete" data-index="${index}"><i class="fas fa-trash"></i> Sil</button></td>
            `;
            productTableBody.appendChild(tr);
        });

        // Ürün Silme Eventi
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.currentTarget.getAttribute('data-index'));
                if(confirm('Bu ürünü mağazadan kalıcı olarak kaldırmak istediğinize emin misiniz?')) {
                    let products = getStoredProducts();
                    products.splice(idx, 1);
                    if (saveStoredProducts(products)) {
                        initAdminDashboard();
                    }
                }
            });
        });
    }

    const readFileAsDataURL = (file) => {
        return new Promise((resolve) => {
            if (!file) resolve("");
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
        });
    };

    if (productForm) {
        productForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const nameEl = document.getElementById('prod-name');
            const name = nameEl ? nameEl.value.trim() : "İsimsiz Ürün";

            // Fiyat Alanlarını Güvenli Okuma (Eski ve Yeni Form Uyumlu Fallback)
            const priceLowEl = document.getElementById('prod-price-low');
            const priceHighEl = document.getElementById('prod-price-high');
            const singlePriceEl = document.getElementById('prod-price');

            const priceLow = priceLowEl ? parseFloat(priceLowEl.value) : (singlePriceEl ? parseFloat(singlePriceEl.value) : 0);
            const priceHigh = priceHighEl ? parseFloat(priceHighEl.value) : (singlePriceEl ? parseFloat(singlePriceEl.value) : 0);
            
            const categoryEl = document.getElementById('prod-category');
            const category = categoryEl ? categoryEl.value : "Genel";

            const fileHighEl = document.getElementById('prod-img-high');
            const fileLowEl = document.getElementById('prod-img-low');

            const fileHigh = fileHighEl ? fileHighEl.files[0] : null;
            const fileLow = fileLowEl ? fileLowEl.files[0] : null;

            if (!fileHigh) {
                alert("Lütfen ana yüksek kalite (1. Fotoğraf) görselini seçin.");
                return;
            }

            // Dosyaları Base64 verisine çevir
            const imageUrl = await readFileAsDataURL(fileHigh);
            const lowQualityImg = fileLow ? await readFileAsDataURL(fileLow) : "";

            let products = getStoredProducts();
            const existingIndex = products.findIndex(p => p.name.toLowerCase() === name.toLowerCase());

            if(existingIndex !== -1) {
                products[existingIndex].priceLow = priceLow;
                products[existingIndex].priceHigh = priceHigh;
                products[existingIndex].price = priceHigh; 
                products[existingIndex].imageUrl = imageUrl;
                if(lowQualityImg) products[existingIndex].lowQualityImg = lowQualityImg;
                products[existingIndex].category = category;
            } else {
                products.push({
                    id: Date.now().toString(),
                    name,
                    priceLow,          
                    priceHigh,         
                    price: priceHigh,  
                    imageUrl,
                    lowQualityImg,
                    category
                });
            }

            // Hafıza Kontrollü Kayıt ve Arayüz Yenileme
            if (saveStoredProducts(products)) {
                alert('Ürün başarıyla kaydedildi!');
                productForm.reset();
                initAdminDashboard();
            }
        });
    }

    function initAdminDashboard() {
        updateAdminMetrics();
        loadAdminProductsTable();
    }

    initAdminDashboard();
});