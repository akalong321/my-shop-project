document.addEventListener("DOMContentLoaded", () => {
    // ================== HIỂN THỊ SẢN PHẨM TỰ ĐỘNG (LẤY TỪ API) ==================
    const productContainer = document.querySelector('.container');
    if (productContainer) {
        fetch('http://127.0.0.1:8000/') // Gửi yêu cầu đến backend
            .then(response => response.json()) // Chuyển đổi kết quả nhận về thành JSON
            .then(productsData => { // Bây giờ chúng ta có dữ liệu sản phẩm từ server

                let productHTML = '';
                productsData.forEach(product => {
                    productHTML += `
                        <a href="product.html?id=${product.id}" class="item">
                            <div class="badge badge-left">${product.badge_left}</div>
                            <div class="badge badge-right">${product.badge_right}</div>
                            <img class="item-img" src="${product.image}" alt="${product.name}">
                            <div class="info">
                                <h3 class="title">${product.name}</h3>
                                <div class="price-box">
                                    <span class="new-price">${product.price_new}</span>
                                    <span class="old-price">${product.price_old}</span>
                                </div>
                                <div class="tags">${product.tags.map(tag => `<span>${tag}</span>`).join('')}</div>
                                <div class="member">${product.member_discount}</div>
                                <p class="desc">${product.desc}</p>
                                <div class="rating">⭐ ${product.rating} &nbsp;&nbsp; 💙 Yêu thích</div>
                                <button class="add-to-cart">🛒 Thêm vào giỏ</button>
                            </div>
                        </a>
                    `;
                });
                productContainer.innerHTML = productHTML;
                initializeCartButtons();

            })
            .catch(error => {
                // Xử lý nếu không kết nối được với server
                console.error('Lỗi khi tải sản phẩm:', error);
                productContainer.innerHTML = '<p class="no-products">Không thể tải được sản phẩm. Vui lòng đảm bảo server backend đang chạy và thử lại.</p>';
            });
    }

    // ================== SLIDER ==================
    const slides = document.querySelectorAll(".slide");
    const navItems = document.querySelectorAll(".nav-item");
    const prevBtn = document.querySelector(".prev");
    const nextBtn = document.querySelector(".next");
    if (slides.length > 0) {
        let index = 0;
        function showSlide(n) {
            slides.forEach((s, i) => {
                s.classList.toggle("active", i === n);
                if (navItems[i]) navItems[i].classList.toggle("active", i === n);
            });
            index = n;
        }
        let slideInterval = setInterval(() => showSlide((index + 1) % slides.length), 5000);
        function resetInterval() {
            clearInterval(slideInterval);
            slideInterval = setInterval(() => showSlide((index + 1) % slides.length), 5000);
        }
        if (nextBtn) nextBtn.onclick = () => { showSlide((index + 1) % slides.length); resetInterval(); };
        if (prevBtn) prevBtn.onclick = () => { showSlide((index - 1 + slides.length) % slides.length); resetInterval(); };
        navItems.forEach((item, i) => (item.onclick = () => { showSlide(i); resetInterval(); }));
    }

    // ================== MENU POP-UP ==================
    const menuBtn = document.getElementById("menu-toggle");
    const modalMenu = document.getElementById("modal-menu");
    const staticMenu = document.getElementById("side-menu");
    const overlay = document.getElementById("overlay");

    if (menuBtn && modalMenu && overlay && staticMenu) {
        modalMenu.innerHTML = staticMenu.innerHTML;

        const openMenu = () => {
            if (window.innerWidth > 992) {
                const rect = staticMenu.getBoundingClientRect();
                modalMenu.style.left = `${rect.left}px`;
                modalMenu.style.top = `${rect.top}px`;
                modalMenu.style.width = `${rect.width}px`;
                modalMenu.style.height = `${rect.height}px`;
            } else {
                modalMenu.style.left = '';
                modalMenu.style.top = '';
                modalMenu.style.width = '';
                modalMenu.style.height = '';
            }
            modalMenu.classList.add("visible");
            overlay.classList.add("active");
        };

        const closeMenu = () => {
            modalMenu.classList.remove("visible");
            overlay.classList.remove("active");
        };

        menuBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (modalMenu.classList.contains("visible")) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        overlay.addEventListener("click", closeMenu);
    }

    // ================== TÌM KIẾM AUTOCOMPLETE ==================
    const searchInput = document.querySelector(".search-box input");
    const suggestionBox = document.getElementById("suggestions");
    // ... (Phần code autocomplete giữ nguyên, không cần thay đổi)
});