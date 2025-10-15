document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');

    const productListContainer = document.getElementById('product-list');
    const categoryTitleEl = document.getElementById('category-title');
    const sortSelect = document.getElementById('sort-select');
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');
    const filterBtn = document.getElementById('filter-btn');
    const clearFilterBtn = document.getElementById('clear-filter-btn');

    let originalFilteredProducts = [];

    const renderProducts = (productsToRender) => {
        if (!productsToRender || productsToRender.length === 0) {
            productListContainer.innerHTML = '<p class="no-products">Không tìm thấy sản phẩm nào phù hợp.</p>';
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

    const applyFiltersAndSort = () => {
        let productsToShow = [...originalFilteredProducts];
        const minPrice = parseInt(minPriceInput.value, 10);
        const maxPrice = parseInt(maxPriceInput.value, 10);
        if (!isNaN(minPrice)) {
            productsToShow = productsToShow.filter(p => parsePrice(p.price_new) >= minPrice);
        }
        if (!isNaN(maxPrice)) {
            productsToShow = productsToShow.filter(p => parsePrice(p.price_new) <= maxPrice);
        }
        const sortBy = sortSelect.value;
        switch (sortBy) {
            case 'price-asc':
                productsToShow.sort((a, b) => parsePrice(a.price_new) - parsePrice(b.price_new));
                break;
            case 'price-desc':
                productsToShow.sort((a, b) => parsePrice(b.price_new) - parsePrice(a.price_new));
                break;
        }
        renderProducts(productsToShow);
    };

    if (category) {
        const categoryDisplayNames = { 'dienthoai': 'Điện thoại & Tablet', 'laptop': 'Laptop', 'amthanh': 'Âm thanh & Mic thu âm', 'dongho': 'Đồng hồ & Camera', 'dogiadung': 'Đồ gia dụng', 'phukien': 'Phụ kiện', 'pc-manhinh': 'PC & Màn hình', 'tv-tulanh': 'Tivi & Tủ lạnh' };
        const displayName = categoryDisplayNames[category] || 'Danh mục không xác định';
        categoryTitleEl.textContent = `Danh mục: ${displayName}`;
        document.title = displayName;

        fetch('http://127.0.0.1:8000/')
            .then(response => response.json())
            .then(productsData => {
                originalFilteredProducts = productsData.filter(product => product.category === category);
                renderProducts(originalFilteredProducts);
                sortSelect.addEventListener('change', applyFiltersAndSort);
                filterBtn.addEventListener('click', applyFiltersAndSort);
                clearFilterBtn.addEventListener('click', () => {
                    minPriceInput.value = '';
                    maxPriceInput.value = '';
                    sortSelect.value = 'default';
                    applyFiltersAndSort();
                });
            })
            .catch(error => {
                console.error('Lỗi khi tải danh mục:', error);
                productListContainer.innerHTML = '<p class="no-products">Không thể tải dữ liệu. Vui lòng đảm bảo server backend đang chạy.</p>';
            });

    } else {
        categoryTitleEl.textContent = 'Không có danh mục nào được chọn';
        if(productListContainer) productListContainer.innerHTML = '<p class="no-products">Vui lòng chọn một danh mục từ trang chủ.</p>';
    }
});