document.addEventListener('DOMContentLoaded', () => {
    // --- ÖN YÜKLEYİCİ (PRELOADER) KONTROLÜ VE GÜVENLİK KİLİDİ ---
    const hidePreloader = () => {
        const preloader = document.getElementById('preloader');
        if (preloader && preloader.style.display !== 'none') {
            preloader.style.opacity = '0';
            setTimeout(() => preloader.style.display = 'none', 400);
        }
    };

    window.addEventListener('load', hidePreloader);
    setTimeout(hidePreloader, 800); // 800ms sonra zorla kapatır

    // Ana Arayüz Elementleri
    const productListContainer = document.getElementById('product-list');
    const cartCount = document.getElementById('cart-count');
    const cartModal = document.getElementById('cart-modal');
    const cartItemsList = document.getElementById('cart-items');
    const totalPriceEl = document.getElementById('total-price');
    const litofanModal = document.getElementById('litofan-modal');
    const litoStep1 = document.getElementById('litofan-step-1');
    const litoStep2 = document.getElementById('litofan-step-2');
    
    // Dinamik Karşılaştırma Modalı Elementleri
    const dynModal = document.getElementById('dynamic-compare-modal');
    const dynSlider = document.getElementById('dyn-compare-slider');
    const dynImgWrapper = document.getElementById('dyn-img-wrapper');
    const dynSliderLine = document.getElementById('dyn-slider-line');
    const dynSliderButton = document.getElementById('dyn-slider-button');
    const dynImgHigh = document.getElementById('dyn-img-high');
    const dynImgLow = document.getElementById('dyn-img-low');
    const dynContainer = document.getElementById('dyn-compare-container');
    
    const WHATSAPP_NUMBER = "905557430609"; // Kendi telefon numaranız
    let cart = JSON.parse(localStorage.getItem('ide4_cart')) || [];
    let pendingProduct = null; 
    let activeCompareProduct = null;

    // Varsayılan Statik Ürünler
    const fallbackProducts = [
        { id: "1", name: "Kişiye Özel 3D Litofan (Işıklı Fotoğraf)", price: 350, imageUrl: "assets/4167.jpg", lowQualityImg: "assets/4005.jpg", category: "Dekoratif" },
        { id: "2", name: "Markaya Özel Anahtarlık & Magnet", price: 75, imageUrl: "assets/4183.jpg", lowQualityImg: "", category: "Kurumsal" },
        { id: "3", name: "3D Tasarım & Endüstriyel Prototip", price: 500, imageUrl: "assets/4005.jpg", lowQualityImg: "", category: "Genel" }
    ];

    // --- LİTOFAN AKIŞ SEÇENEKLERİ ---
    if (document.getElementById('lito-option-1')) {
        document.getElementById('lito-option-1').addEventListener('click', () => {
            if(pendingProduct) {
                cart.push({ name: `${pendingProduct.name} [Müşteri Fotoğraf Gönderecek]`, price: pendingProduct.price });
                updateCartUI();
                showSuccessAnimation(pendingProduct.btnTarget);
            }
            litofanModal.classList.add('hidden');
        });
    }

    if (document.getElementById('lito-option-2')) {
        document.getElementById('lito-option-2').addEventListener('click', () => {
            litoStep1.classList.add('hidden');
            litoStep2.classList.remove('hidden');
        });
    }

    if (document.getElementById('lito-confirm-btn')) {
        document.getElementById('lito-confirm-btn').addEventListener('click', () => {
            if(pendingProduct) {
                cart.push({ name: `${pendingProduct.name} [Müşteri Kendi Tasarladı]`, price: pendingProduct.price });
                updateCartUI();
                showSuccessAnimation(pendingProduct.btnTarget);
            }
            litofanModal.classList.add('hidden');
            window.open("https://makerworld.com/en/makerlab/makeMyLithophane?from=makerlab", "_blank");
        });
    }

    if (document.getElementById('lito-back-btn')) {
        document.getElementById('lito-back-btn').addEventListener('click', () => {
            litoStep2.classList.add('hidden');
            litoStep1.classList.remove('hidden');
        });
    }

    if (document.getElementById('close-litofan-modal')) {
        document.getElementById('close-litofan-modal').addEventListener('click', () => {
            litofanModal.classList.add('hidden');
        });
    }

    // --- DİNAMİK ÜRÜN KARŞILAŞTIRMA VE SİPARİŞ MOTORU ---
    function openDynamicCompareModal(product) {
        activeCompareProduct = product;
        document.getElementById('cmp-prod-title').innerText = `${product.name} - Kalite Seçimi`;
        
        dynImgHigh.src = product.imageUrl;
        dynImgLow.src = product.lowQualityImg || product.imageUrl;
        
        // Fiyat ayrıştırma (Veri yoksa varsayılan hesaplama uygulanır)
        const highPrice = product.priceHigh || product.price;
        const lowPrice = product.priceLow || (product.price * 0.8);

        document.getElementById('price-high-display').innerText = highPrice;
        document.getElementById('price-low-display').innerText = lowPrice;

        dynModal.classList.remove('hidden');

        setTimeout(() => {
            if(dynContainer && dynImgLow) {
                const width = dynContainer.getBoundingClientRect().width;
                dynImgLow.style.width = `${width}px`;
            }
        }, 1200);
    }

    if(dynSlider && dynImgWrapper) {
        dynSlider.addEventListener('input', (e) => {
            const val = e.target.value;
            dynImgWrapper.style.width = `${val}%`;
            dynSliderLine.style.left = `${val}%`;
            dynSliderButton.style.left = `${val}%`;
        });
    }

    // Standart Kalite Seçimi ile Sepete Ekle
    if(document.getElementById('btn-choose-low')) {
        document.getElementById('btn-choose-low').addEventListener('click', (e) => {
            if(activeCompareProduct) {
                const selectedPrice = activeCompareProduct.priceLow || (activeCompareProduct.price * 0.8);
                cart.push({ 
                    name: `${activeCompareProduct.name} [Standart Kalite - 0.28mm]`, 
                    price: parseFloat(selectedPrice)
                });
                updateCartUI();
                showSuccessAnimation(e.currentTarget);
                setTimeout(() => dynModal.classList.add('hidden'), 800);
            }
        });
    }

    // Yüksek Kalite Seçimi ile Sepete Ekle
    if(document.getElementById('btn-choose-high')) {
        document.getElementById('btn-choose-high').addEventListener('click', (e) => {
            if(activeCompareProduct) {
                const selectedPrice = activeCompareProduct.priceHigh || activeCompareProduct.price;
                cart.push({ 
                    name: `${activeCompareProduct.name} [İDE4 Yüksek Kalite - 0.12mm]`, 
                    price: parseFloat(selectedPrice)
                });
                updateCartUI();
                showSuccessAnimation(e.currentTarget);
                setTimeout(() => dynModal.classList.add('hidden'), 800);
            }
        });
    }

    if(document.getElementById('close-dyn-compare-modal')) {
        document.getElementById('close-dyn-compare-modal').addEventListener('click', () => {
            dynModal.classList.add('hidden');
        });
    }

    // --- KATEGORİ FİLTRELEME & ÜRÜN LİSTELEME ---
    // HATA BURADA DÜZELTİLDİ: Fonksiyon adı olan "initializeProducts" eklendi!
    function initializeProducts(filterCategory = 'all') {
        if (!productListContainer) return;

        let localData = localStorage.getItem('ide4_products');
        let products = (localData && JSON.parse(localData).length > 0) ? JSON.parse(localData) : fallbackProducts;
        if(!localData) localStorage.setItem('ide4_products', JSON.stringify(fallbackProducts));
        
        productListContainer.innerHTML = '';
        
        const filteredProducts = filterCategory === 'all' 
            ? products 
            : products.filter(p => p.category === filterCategory);

        filteredProducts.forEach((p, index) => {
            const card = document.createElement('div');
            card.className = 'product-card fade-in-bottom';
            const hasDualQuality = p.lowQualityImg ? true : false;
            
            // Çift fiyat varsa aralık (Örn: 100 - 150 TL), yoksa tek fiyat göster
            const priceDisplay = (p.priceLow && p.priceHigh) ? `${p.priceLow} - ${p.priceHigh} TL` : `${p.price} TL`;

            card.innerHTML = `
                <img src="${p.imageUrl}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/200'">
                <h3>${p.name}</h3>
                <div class="price">${priceDisplay}</div>
                ${hasDualQuality ? 
                    `<button class="btn-compare-open btn-primary" style="background: var(--accent-orange);" data-index="${index}"><i class="fas fa-sliders-h"></i> Karşılaştır & Seç</button>` : 
                    `<button class="btn-add btn-primary" data-name="${p.name}" data-price="${p.priceLow || p.price}">Sepete Ekle</button>`
                }
            `;
            productListContainer.appendChild(card);
        });

        // Karşılaştır & Seç Dinleyicisi
        document.querySelectorAll('.btn-compare-open').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.currentTarget.getAttribute('data-index'));
                let currentProds = JSON.parse(localStorage.getItem('ide4_products')) || fallbackProducts;
                const activeCatProducts = filterCategory === 'all' ? currentProds : currentProds.filter(p => p.category === filterCategory);
                openDynamicCompareModal(activeCatProducts[idx]);
            });
        });

        // Standart Sepete Ekle Dinleyicisi
        document.querySelectorAll('.btn-add').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const name = e.target.getAttribute('data-name');
                const price = parseFloat(e.target.getAttribute('data-price'));
                
                if (name.toLowerCase().includes('litofan')) {
                    pendingProduct = { name, price, btnTarget: e.target };
                    litoStep1.classList.remove('hidden');
                    litoStep2.classList.add('hidden');
                    litofanModal.classList.remove('hidden');
                } else {
                    cart.push({ name, price });
                    updateCartUI();
                    showSuccessAnimation(e.target);
                }
            });
        });
    }

    // Kategori Filtre Butonları Tetikleyicisi
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            const category = e.target.getAttribute('data-filter');
            initializeProducts(category);
        });
    });

    // --- SEPET VE ANİMASYON MOTORU ---
    function showSuccessAnimation(btnElement) {
        const originalText = btnElement.innerHTML;
        btnElement.innerText = "Eklendi ✓";
        btnElement.style.backgroundColor = "#128C7E";
        setTimeout(() => {
            btnElement.innerHTML = originalText;
            btnElement.style.backgroundColor = "";
        }, 1500);
    }

    function updateCartUI() {
        localStorage.setItem('ide4_cart', JSON.stringify(cart));
        if (cartCount) cartCount.innerText = cart.length;
        
        if (cartItemsList && totalPriceEl) {
            cartItemsList.innerHTML = '';
            let total = 0;
            cart.forEach((item, index) => {
                total += item.price;
                const li = document.createElement('li');
                li.innerHTML = `
                    <span>${item.name}</span> 
                    <div>
                        <strong style="margin-right:10px;">${item.price} TL</strong>
                        <button class="btn-item-remove" data-index="${index}" style="background:none; border:none; color:#ef4444; cursor:pointer;"><i class="fas fa-trash"></i></button>
                    </div>
                `;
                cartItemsList.appendChild(li);
            });
            totalPriceEl.innerText = total;

            document.querySelectorAll('.btn-item-remove').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idx = parseInt(e.currentTarget.getAttribute('data-index'));
                    cart.splice(idx, 1);
                    updateCartUI();
                });
            });
        }
    }

    // --- WHATSAPP ENTEGRASYON MOTORU ---
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if(cart.length === 0) return alert("Hata: Sepetinizde ürün bulunmamaktadır.");

            const total = parseFloat(totalPriceEl.innerText);
            let text = "*İDE4 3D - SİPARİŞ FORMU*\n\n";
            let requirePhotoUpload = false;
            let requireDesignLink = false;

            cart.forEach((item, index) => { 
                text += `*${index + 1}.* ${item.name} | ${item.price} TL\n`; 
                if(item.name.includes('Fotoğraf Gönderecek')) requirePhotoUpload = true;
                if(item.name.includes('Müşteri Kendi Tasarladı')) requireDesignLink = true;
            });

            text += `\n*Toplam Tutar:* ${total} TL\n\n`;

            if(requirePhotoUpload) text += "📌 *Müşteri Notu:* Siparişim için gerekli fotoğrafları bu sohbet üzerinden iletiyorum.\n";
            if(requireDesignLink) text += "🔗 *Tasarım Dosyası:* Kendi tasarladığım modeli/linki iletiyorum.\n";

            text += "\nDetaylar, kargo ve üretim süreci için geri dönüş bekliyorum.";
            window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
            
            cart = []; 
            updateCartUI();
            if(cartModal) cartModal.classList.add('hidden');
        });
    }

    if (document.getElementById('cart-btn')) document.getElementById('cart-btn').addEventListener('click', (e) => { e.preventDefault(); cartModal.classList.remove('hidden'); });
    if (document.getElementById('close-modal')) document.getElementById('close-modal').addEventListener('click', () => { cartModal.classList.add('hidden'); });
    if (document.getElementById('hamburger-menu')) document.getElementById('hamburger-menu').addEventListener('click', () => { document.getElementById('nav-links').classList.toggle('active'); });

    updateCartUI();
    initializeProducts('all');
});