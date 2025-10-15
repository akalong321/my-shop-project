document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('product-detail-container');
    if (!container) return;

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    fetch('http://127.0.0.1:8000/')
        .then(response => response.json())
        .then(productsData => {
            const product = productsData.find(p => p.id == productId);

            if (product) {
                document.title = product.name.split('|')[0].trim();
                container.innerHTML = `
                    <div class="product-breadcrumb">
                        <a href="index.html">Trang chủ</a> / <a href="category.html?category=${product.category}">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</a> / <span>${product.name.split('|')[0].trim()}</span>
                    </div>
                    <div class="product-layout">
                        <div class="product-gallery">
                            <img src="${product.image}" alt="${product.name}">
                        </div>
                        <div class="product-info">
                            <h1>${product.name}</h1>
                            <div class="product-price">
                                <span class="new-price">${product.price_new}</span>
                                <span class="old-price">${product.price_old}</span>
                            </div>
                            <div class="product-short-desc">
                                <p>${product.desc}</p>
                            </div>
                            <div class="product-actions">
                                <button class="add-to-cart-detail" data-id="${product.id}">Thêm vào giỏ hàng</button>
                            </div>
                        </div>
                    </div>
                `;

                const addToCartDetailButton = document.querySelector('.add-to-cart-detail');
                if (addToCartDetailButton) {
                    addToCartDetailButton.addEventListener('click', () => {
                        let cart = JSON.parse(localStorage.getItem("cart")) || [];
                        const title = product.name;
                        const price = product.price_new;
                        const image = product.image;

                        const existing = cart.find(it => it.title === title);
                        if (existing) {
                            existing.quantity++;
                        } else {
                            cart.push({ title, price, quantity: 1, image });
                        }

                        localStorage.setItem("cart", JSON.stringify(cart));
                        updateCartCount();
                        showToast("🛒 Đã thêm vào giỏ hàng!");
                    });
                }

            } else {
                container.innerHTML = `
                    <div class="product-not-found">
                        <h1>404</h1>
                        <p>Không tìm thấy sản phẩm bạn yêu cầu.</p>
                        <a href="index.html" class="btn-green" style="text-decoration: none;">Quay về trang chủ</a>
                    </div>
                `;
            }
        })
        .catch(error => {
            console.error('Lỗi khi tải chi tiết sản phẩm:', error);
            container.innerHTML = '<p class="no-products">Không thể tải dữ liệu sản phẩm. Vui lòng đảm bảo server backend đang chạy.</p>';
        });
});