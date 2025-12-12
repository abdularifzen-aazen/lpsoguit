/* KONFIGURASI PENTING 
  Ganti URL di bawah ini dengan URL Web App Anda (yang berakhiran /exec)
*/
const APP_URL = 'PASTE_WEB_APP_URL_ANDA_DISINI'; 
// Contoh: const APP_URL = 'https://script.google.com/macros/s/AKfycbwSlStAjrBmGifT1cOTxhbpSOPBZnY1hdYw1gidfbgn33G6XZ3a9OLgpw5PjREv0db8/exec';

document.addEventListener("DOMContentLoaded", function() {
    fetchData();
});

// Fungsi Utama Mengambil Data
function fetchData() {
    fetch(APP_URL)
        .then(response => response.json())
        .then(result => {
            if(result.status === 'success') {
                renderConfig(result.data.config);
                renderProducts(result.data.products);
                renderTestimonials(result.data.testimonials);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Gagal mengambil data dari Spreadsheet. Pastikan URL Apps Script benar.");
        });
}

// 1. RENDER HERO & CONFIG
function renderConfig(config) {
    // Sembunyikan loader
    document.getElementById('hero-loader').style.display = 'none';

    // Set Teks Hero
    document.getElementById('hero-title').innerText = config.hero_title;
    document.getElementById('hero-desc').innerText = config.hero_desc;
    
    // Set Gambar Background Hero
    if(config.hero_image) {
        document.getElementById('hero').style.backgroundImage = `url('${config.hero_image}')`;
    }

    // Set Link WA Dinamis
    const waLink = `https://wa.me/${config.wa_number}?text=${encodeURIComponent(config.wa_text)}`;
    document.getElementById('hero-cta').href = waLink;
    document.getElementById('nav-cta').href = waLink;

    // Set Footer
    document.getElementById('footer-contact').innerHTML = `Email: ${config.email_contact} | WA: +${config.wa_number}`;
}

// 2. RENDER PRODUK
function renderProducts(products) {
    const listContainer = document.getElementById('product-list');
    document.getElementById('product-loader').style.display = 'none';

    products.forEach(item => {
        // Logika Badge Harga (Merah/Hijau jika Free, Biru jika Bayar)
        let badgeColor = item.is_free ? 'bg-success' : 'bg-primary'; 
        // Jika ada kata 'promo' warnanya jadi merah
        if(item.harga && item.harga.toLowerCase().includes('promo')) {
            badgeColor = 'bg-danger';
        }
        
        let hargaHtml = '';
        if (item.harga) {
            hargaHtml = `<span class="position-absolute top-0 end-0 mt-3 price-badge text-white ${badgeColor}">${item.harga}</span>`;
        }

        const cardHtml = `
            <div class="col-md-6 col-lg-3">
                <div class="card h-100 shadow-sm border-0 position-relative overflow-hidden">
                    ${hargaHtml}
                    <img src="${item.image}" class="card-img-top" alt="${item.nama}" loading="lazy">
                    <div class="card-body">
                        <span class="badge bg-secondary mb-2">${item.kategori}</span>
                        <h5 class="card-title fw-bold">${item.nama}</h5>
                        <p class="card-text text-muted small">${item.deskripsi}</p>
                    </div>
                    <div class="card-footer bg-white border-0 pb-3">
                        <a href="${item.link_demo}" target="_blank" class="btn btn-outline-primary w-100 rounded-pill">Lihat Demo</a>
                    </div>
                </div>
            </div>
        `;
        listContainer.innerHTML += cardHtml;
    });
}

// 3. RENDER TESTIMONI
function renderTestimonials(testimonials) {
    const listContainer = document.getElementById('testimonial-list');
    
    testimonials.forEach(item => {
        const html = `
            <div class="col-md-4 mb-5">
                <div class="card h-100 border-0 shadow-sm bg-white text-center p-3 testimonial-card">
                    <div class="d-flex justify-content-center">
                        <img src="${item.foto}" class="avatar-img" alt="${item.nama}">
                    </div>
                    <div class="card-body mt-2">
                        <h5 class="card-title fw-bold mb-0">${item.nama}</h5>
                        <small class="text-primary fw-bold">${item.jabatan}</small>
                        <p class="card-text mt-3 text-muted fst-italic">"${item.isi}"</p>
                    </div>
                </div>
            </div>
        `;
        listContainer.innerHTML += html;
    });
}