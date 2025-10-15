// ================== CÁC BIẾN VÀ HÀM DÙNG CHUNG ==================

// Khai báo giỏ hàng, lấy từ localStorage nếu có
let cart = JSON.parse(localStorage.getItem("cart")) || [];

/**
 * Hiển thị thông báo (toast)
 * @param {string} message - Nội dung thông báo
 */
const showToast = (message) => {
    let toast = document.getElementById("toast");
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
};

/**
 * Cập nhật số lượng sản phẩm trên icon giỏ hàng
 */
const updateCartCount = () => {
     const cartCountEl = document.getElementById("cart-count");
     if (cartCountEl) {
        let totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountEl.textContent = totalQty;
    }
};

/**
 * Chuyển đổi chuỗi giá thành số (ví dụ: "10.000đ" -> 10000)
 * @param {string} str - Chuỗi giá tiền
 * @returns {number}
 */
function parsePrice(str) {
    return parseInt(String(str).replace(/[^0-9]/g, ""), 10) || 0;
}

/**
 * Định dạng số thành chuỗi giá tiền (ví dụ: 10000 -> "10.000đ")
 * @param {number} num - Số tiền
 * @returns {string}
 */
function formatPrice(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
}

/**
 * Xử lý sự kiện thêm sản phẩm vào giỏ hàng từ danh sách sản phẩm
 */
function initializeCartButtons() {
    const addToCartButtons = document.querySelectorAll(".add-to-cart");
    addToCartButtons.forEach((button) => {
        if (button.dataset.listenerAttached) return;

        button.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();

            const productItem = button.closest(".item");
            const productLink = productItem.href;
            if (!productLink) return;

            const productId = productLink.split('id=')[1];
            const productData = productsData.find(p => p.id == productId);
            if (!productData) return;

            const title = productData.name;
            const price = productData.price_new;
            const image = productData.image;

            const existing = cart.find((it) => it.title === title && it.price === price);
            if (existing) {
                existing.quantity++;
            } else {
                cart.push({ title, price, quantity: 1, image });
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartCount();
            showToast("🛒 Đã thêm vào giỏ hàng!");

            const cartIcon = document.getElementById('cart-container');
            if (cartIcon) {
                cartIcon.classList.add('shake');
                setTimeout(() => {
                    cartIcon.classList.remove('shake');
                }, 600);
            }
        });
        button.dataset.listenerAttached = true;
    });
}

// ================== HỆ THỐNG MODAL ĐA NĂNG ==================

function createModal() {
    if (document.getElementById('multi-purpose-modal')) return;

    const modalHTML = `
        <div id="multi-purpose-modal" class="modal-container hidden">
            <div class="modal-box">
                <h3 id="modal-title">Tiêu đề</h3>
                <p id="modal-message">Nội dung</p>
                <div id="modal-actions" class="modal-actions">
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function showModal(title, message, buttons) {
    createModal();

    const modal = document.getElementById('multi-purpose-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const modalActions = document.getElementById('modal-actions');
    const overlay = document.getElementById('overlay');

    modalTitle.textContent = title;
    modalMessage.innerHTML = message;

    modalActions.innerHTML = '';

    const closeModal = () => {
        modal.classList.add('hidden');
        if (overlay) overlay.classList.remove('active');
    };

    buttons.forEach(buttonInfo => {
        const button = document.createElement('button');
        button.textContent = buttonInfo.text;
        button.className = `btn ${buttonInfo.class}`;
        button.addEventListener('click', () => {
            closeModal();
            if (buttonInfo.action) {
                buttonInfo.action();
            }
        });
        modalActions.appendChild(button);
    });

    modal.classList.remove('hidden');
    if (overlay) {
        const newOverlay = overlay.cloneNode(true);
        overlay.parentNode.replaceChild(newOverlay, overlay);
        newOverlay.addEventListener('click', closeModal);
        newOverlay.classList.add('active');
    }
}

// ================== CHẾ ĐỘ SÁNG/TỐI (DARK MODE) - DÙNG CHUNG ==================
function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    const themeIcon = themeToggle.querySelector('i');

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        if (isDarkMode) {
            if (themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
        } else {
            if (themeIcon) themeIcon.classList.replace('fa-sun', 'fa-moon');
        }
    });
}

// Cập nhật các chức năng chung ngay khi tải trang
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    initializeTheme();
});