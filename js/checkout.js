document.addEventListener('DOMContentLoaded', () => {
    const checkoutForm = document.getElementById("checkout-form");

    // Hiển thị tóm tắt đơn hàng
    const orderSummary = document.getElementById("order-summary");
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    let summaryHTML = '<h4>Tóm tắt đơn hàng</h4><ul>';
    let total = 0;
    if(cart.length > 0) {
        cart.forEach(item => {
            summaryHTML += `<li>${item.title.split('|')[0]} (x${item.quantity}) <span>${formatPrice(parsePrice(item.price) * item.quantity)}</span></li>`;
            total += parsePrice(item.price) * item.quantity;
        });
        summaryHTML += `</ul><hr><div class="summary-total">Tổng cộng: <strong>${formatPrice(total)}</strong></div>`;
    } else {
        summaryHTML = '<p>Không có sản phẩm nào trong giỏ hàng.</p><br/><a href="index.html" class="btn btn-green" style="text-decoration:none">Quay lại mua sắm</a>';
        if (checkoutForm) checkoutForm.style.display = 'none';
    }
    if (orderSummary) orderSummary.innerHTML = summaryHTML;


    // Logic validate form
    if (checkoutForm) {
        const nameInput = document.getElementById('name');
        const phoneInput = document.getElementById('phone');
        const addressInput = document.getElementById('address');

        const showError = (input, message) => {
            const formGroup = input.parentElement;
            formGroup.classList.remove('success'); formGroup.classList.add('error');
            const errorMessage = formGroup.querySelector('.error-message');
            errorMessage.textContent = message;
        };
        const showSuccess = (input) => {
            const formGroup = input.parentElement;
            formGroup.classList.remove('error'); formGroup.classList.add('success');
            const errorMessage = formGroup.querySelector('.error-message');
            errorMessage.textContent = '';
        };
        const isVietnamesePhoneNumber = (number) => /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/.test(number);
        const validateName = () => { if (nameInput.value.trim() === '') { showError(nameInput, 'Họ và tên không được để trống.'); return false; } showSuccess(nameInput); return true; };
        const validatePhone = () => { if (phoneInput.value.trim() === '') { showError(phoneInput, 'Số điện thoại không được để trống.'); return false; } if (!isVietnamesePhoneNumber(phoneInput.value.trim())) { showError(phoneInput, 'Số điện thoại không hợp lệ.'); return false; } showSuccess(phoneInput); return true; };
        const validateAddress = () => { if (addressInput.value.trim() === '') { showError(addressInput, 'Địa chỉ không được để trống.'); return false; } showSuccess(addressInput); return true; };

        nameInput.addEventListener('input', validateName);
        phoneInput.addEventListener('input', validatePhone);
        addressInput.addEventListener('input', validateAddress);

        checkoutForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const isNameValid = validateName();
            const isPhoneValid = validatePhone();
            const isAddressValid = validateAddress();

            if (isNameValid && isPhoneValid && isAddressValid) {
                const submitButton = checkoutForm.querySelector('.btn-submit');
                submitButton.textContent = 'Đang xử lý...';
                submitButton.disabled = true;

                setTimeout(() => {
                    // Xóa giỏ hàng
                    localStorage.removeItem("cart");

                    // Hiển thị modal thành công
                    showModal(
                        'Đặt hàng thành công!',
                        'Cảm ơn bạn đã mua hàng. Chúng tôi sẽ liên hệ với bạn để xác nhận đơn hàng trong thời gian sớm nhất.',
                        [
                            {
                                text: 'Về trang chủ',
                                class: 'btn-green',
                                action: () => {
                                    window.location.href = 'index.html';
                                }
                            }
                        ]
                    );
                }, 1500);
            }
        });
    }
});