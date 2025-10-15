document.addEventListener('DOMContentLoaded', () => {
    const cartContentEl = document.getElementById('cart-page-content');
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const renderCartPage = () => {
        updateCartCount();

        if (cart.length === 0) {
            cartContentEl.innerHTML = `
                <div class="empty-cart-message" style="padding: 50px 20px; text-align: center; background: var(--card-bg-color); border-radius: 8px;">
                    <div class="empty-cart-icon" style="font-size: 50px; color: #ced4da; margin-bottom: 15px;"><i class="fas fa-shopping-cart"></i></div>
                    <h3>Giỏ hàng của bạn đang trống</h3>
                    <p>Hãy quay lại trang chủ để bắt đầu mua sắm nhé!</p>
                </div>
            `;
            return;
        }

        let itemsHTML = '<table class="cart-table" style="width: 100%;">';
        itemsHTML += `
            <thead>
                <tr><th>Sản phẩm</th><th>Giá</th><th>Số lượng</th><th>Thành tiền</th><th>Xóa</th></tr>
            </thead>
            <tbody>
        `;

        let total = 0;
        cart.forEach((item, index) => {
            const itemTotal = parsePrice(item.price) * item.quantity;
            total += itemTotal;
            itemsHTML += `
                <tr>
                    <td class="product-cell">
                        <img src="${item.image}" alt="${item.title}" class="cart-item-img">
                        <div>
                            <div class="cart-item-title">${String(item.title).split('|')[0]}</div>
                        </div>
                    </td>
                    <td>${item.price}</td>
                    <td>
                        <div class="cart-qty">
                            <button class="qty-btn" data-action="minus" data-index="${index}">-</button>
                            <span>${item.quantity}</span>
                            <button class="qty-btn" data-action="plus" data-index="${index}">+</button>
                        </div>
                    </td>
                    <td>${formatPrice(itemTotal)}</td>
                    <td>
                        <button class="remove-btn" data-index="${index}"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `;
        });

        itemsHTML += `
            </tbody></table>
            <div class="cart-total" style="padding: 20px 25px; font-size: 20px; font-weight: bold; text-align: right; border-top: 1px solid var(--border-color); background: var(--bg-soft-color);">
                <b>Tổng cộng: ${formatPrice(total)}</b>
            </div>
            <div class="cart-actions" style="padding: 20px 25px; background: var(--bg-soft-color); display: flex; justify-content: flex-end; gap: 12px;">
                <a href="checkout.html" class="btn btn-green" style="text-decoration: none;">Đi đến thanh toán</a>
                <button id="clear-cart-page-btn" class="btn btn-orange">Xóa tất cả</button>
            </div>
        `;
        cartContentEl.innerHTML = itemsHTML;

        addCartPageEventListeners();
    };

    const addCartPageEventListeners = () => {
        const clearCartBtn = document.getElementById('clear-cart-page-btn');
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', () => {
                showModal(
                    'Xác nhận',
                    'Bạn có chắc chắn muốn xóa toàn bộ sản phẩm khỏi giỏ hàng?',
                    [
                        {
                            text: 'Hủy',
                            class: 'btn-red',
                            action: () => {} // Không làm gì cả
                        },
                        {
                            text: 'Xác nhận',
                            class: 'btn-orange',
                            action: () => {
                                cart = [];
                                localStorage.setItem("cart", JSON.stringify(cart));
                                renderCartPage();
                                showToast("🗑️ Đã xoá toàn bộ giỏ hàng!");
                            }
                        }
                    ]
                );
            });
        }

        cartContentEl.addEventListener('click', (e) => {
            const target = e.target;
            const removeBtn = target.closest('.remove-btn');
            const qtyBtn = target.closest('.qty-btn');

            let needsRender = false;

            if (removeBtn) {
                const index = Number(removeBtn.dataset.index);
                const itemTitle = cart[index].title.split('|')[0];
                showModal(
                    'Xác nhận xóa',
                    `Bạn có muốn xóa <strong>${itemTitle}</strong> khỏi giỏ hàng?`,
                    [
                        { text: 'Hủy', class: 'btn-red' },
                        {
                            text: 'Xác nhận',
                            class: 'btn-orange',
                            action: () => {
                                cart.splice(index, 1);
                                localStorage.setItem("cart", JSON.stringify(cart));
                                renderCartPage();
                            }
                        }
                    ]
                )

            } else if (qtyBtn) {
                const index = Number(qtyBtn.dataset.index);
                const action = qtyBtn.dataset.action;
                if (action === 'plus') {
                    cart[index].quantity++;
                    needsRender = true;
                } else if (action === 'minus') {
                    if (cart[index].quantity > 1) {
                        cart[index].quantity--;
                        needsRender = true;
                    } else {
                        // Nếu số lượng là 1 và bấm trừ, hiện modal xác nhận xóa
                        const itemTitle = cart[index].title.split('|')[0];
                         showModal(
                            'Xác nhận xóa',
                            `Số lượng là 1. Bạn có muốn xóa <strong>${itemTitle}</strong> khỏi giỏ hàng?`,
                            [
                                { text: 'Không', class: 'btn-red' },
                                {
                                    text: 'Xóa',
                                    class: 'btn-orange',
                                    action: () => {
                                        cart.splice(index, 1);
                                        localStorage.setItem("cart", JSON.stringify(cart));
                                        renderCartPage();
                                    }
                                }
                            ]
                        )
                    }
                }
            }

            if (needsRender) {
                localStorage.setItem("cart", JSON.stringify(cart));
                renderCartPage();
            }
        });
    };

    renderCartPage();
});