document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('q');

    const productListContainer = document.getElementById('product-list');
    const searchResultTitleEl = document.getElementById('search-result-title');

    if (searchQuery) {
        const decodedQuery = decodeURIComponent(searchQuery);
        document.title = `Tìm kiếm cho: "${decodedQuery}"`;
        if (searchResultTitleEl) {
            searchResultTitleEl.innerHTML = `Kết quả tìm kiếm cho: "<strong>${decodedQuery}</strong>"`;
        }
    } else {
        if (searchResultTitleEl) {
            searchResultTitleEl.textContent = 'Vui lòng nhập từ khóa để tìm kiếm';
        }
    }

    const renderProducts = (productsToRender) => {
        if (!productListContainer) return;
        if (!productsToRender || productsToRender.length === 0) {
            productListContainer.innerHTML = '<p class="no-products">Không tìm thấy sản phẩm nào phù hợp với từ khóa của bạn.</p>';
            return;
        }
        let productHTML = '';
        productsToRender.forEach(product => {
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
        productListContainer.innerHTML = productHTML;
        initializeCartButtons();
    };

    if (searchQuery) {
        fetch('http://127.0.0.1:8000/')
            .then(response => response.json())
            .then(productsData => {
                const lowerCaseQuery = searchQuery.toLowerCase();
                const searchResults = productsData.filter(product =>
                    product.name.toLowerCase().includes(lowerCaseQuery)
                );
                renderProducts(searchResults);
            })
            .catch(error => {
                console.error('Lỗi khi tìm kiếm:', error);
                productListContainer.innerHTML = '<p class="no-products">Không thể tải dữ liệu. Vui lòng đảm bảo server backend đang chạy.</p>';
            });
    } else {
        renderProducts([]);
    }
});