/* Checkout — validation, total, clear cart on order / cancel */

function getCartTotal() {
  return cart.reduce(function (sum, item) {
    return sum + item.price * item.qty;
  }, 0);
}

function renderCheckoutSummary() {
  var list = document.getElementById('checkoutItemsList');
  var totalEl = document.getElementById('checkoutTotal');

  if (!list || !totalEl) return;

  if (cart.length === 0) {
    list.innerHTML = '<p class="cart-empty">No items in cart. <a href="shop.html">Go to Shop</a></p>';
    totalEl.textContent = formatPrice(0);
    return;
  }

  list.innerHTML = '';
  cart.forEach(function (item) {
    var row = document.createElement('div');
    row.className = 'checkout-summary-row';
    row.innerHTML =
      '<span>' + item.name + ' × ' + item.qty + '</span>' +
      '<span>' + formatPrice(item.price * item.qty) + '</span>';
    list.appendChild(row);
  });

  totalEl.textContent = formatPrice(getCartTotal());
}

function showError(fieldId, message) {
  var input = document.getElementById(fieldId);
  var err = document.getElementById('err-' + fieldId);
  if (input) input.classList.add('input-error');
  if (err) err.textContent = message;
}

function clearErrors() {
  document.querySelectorAll('.checkout-form input, .checkout-form textarea').forEach(function (el) {
    el.classList.remove('input-error');
  });
  document.querySelectorAll('.form-error').forEach(function (el) {
    el.textContent = '';
  });
}

function validateCheckoutForm() {
  clearErrors();
  var valid = true;

  var fullName = document.getElementById('fullName').value.trim();
  var email = document.getElementById('email').value.trim();
  var phone = document.getElementById('phone').value.trim();
  var address = document.getElementById('address').value.trim();
  var city = document.getElementById('city').value.trim();

  if (fullName.length < 2) {
    showError('fullName', 'Please enter your full name.');
    valid = false;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError('email', 'Please enter a valid email.');
    valid = false;
  }

  if (!/^[0-9]{10}$/.test(phone.replace(/\s/g, ''))) {
    showError('phone', 'Phone must be 10 digits.');
    valid = false;
  }

  if (address.length < 10) {
    showError('address', 'Please enter a complete address.');
    valid = false;
  }

  if (city.length < 2) {
    showError('city', 'Please enter your city.');
    valid = false;
  }

  if (cart.length === 0) {
    alert('Your cart is empty. Add products from the Shop first.');
    valid = false;
  }

  return valid;
}

document.addEventListener('DOMContentLoaded', function () {
  renderCheckoutSummary();

  var form = document.getElementById('checkoutForm');
  var cancelBtn = document.getElementById('checkoutCancel');

  if (cancelBtn) {
    cancelBtn.addEventListener('click', function () {
      if (confirm('Cancel order and clear your cart?')) {
        clearCart();
        renderCheckoutSummary();
        window.location.href = 'shop.html';
      }
    });
  }

  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    document.getElementById('formSuccess').hidden = true;

    if (!validateCheckoutForm()) return;

    clearCart();
    renderCheckoutSummary();
    document.getElementById('formSuccess').hidden = false;
    form.reset();
    clearErrors();
  });
});
