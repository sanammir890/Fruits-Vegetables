/* ============================================================
   Shared cart — localStorage + sidebar
   ============================================================ */

var CART_KEY = 'fruitables_cart';
var cart = [];

/* Indian Rupees — see formatPrice() in seminar notes */
function formatPrice(amount) {
  return '₹' + Number(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
}

function loadCart() {
  var saved = localStorage.getItem(CART_KEY);
  if (saved) {
    try {
      cart = JSON.parse(saved);
    } catch (e) {
      cart = [];
    }
  }
}

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function clearCart() {
  cart = [];
  saveCart();
  updateCartBadge();
  updateCartSidebar();
}

function addToCart(product, btn) {
  if (!product) return;

  var existing = cart.find(function (item) {
    return item.id === product.id;
  });

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      qty: 1
    });
  }

  saveCart();
  updateCartBadge();
  updateCartSidebar();

  if (btn) {
    var originalText = btn.textContent;
    btn.textContent = 'Added!';
    btn.classList.add('added');
    setTimeout(function () {
      btn.textContent = originalText;
      btn.classList.remove('added');
    }, 2000);
  }
}

function removeFromCart(productId) {
  cart = cart.filter(function (item) {
    return item.id !== productId;
  });
  saveCart();
  updateCartBadge();
  updateCartSidebar();
}

function updateCartBadge() {
  var badge = document.getElementById('cartBadge');
  if (!badge) return;

  var totalQty = cart.reduce(function (sum, item) {
    return sum + item.qty;
  }, 0);

  badge.textContent = totalQty;
}

function updateCartSidebar() {
  var container = document.getElementById('cartItems');
  var totalEl = document.getElementById('cartTotal');
  if (!container || !totalEl) return;

  if (cart.length === 0) {
    container.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
    totalEl.textContent = formatPrice(0);
    return;
  }

  container.innerHTML = '';

  cart.forEach(function (item) {
    var row = document.createElement('div');
    row.className = 'cart-row';
    row.innerHTML =
      '<img src="' + item.image + '" alt="' + item.name + '">' +
      '<div class="cart-row-info">' +
        '<h5>' + item.name + '</h5>' +
        '<span>' + formatPrice(item.price) + ' × ' + item.qty + '</span>' +
      '</div>' +
      '<button type="button" class="cart-remove" data-id="' + item.id + '" aria-label="Remove">' +
        '<i class="fa fa-trash"></i>' +
      '</button>';
    container.appendChild(row);
  });

  container.querySelectorAll('.cart-remove').forEach(function (btn) {
    btn.addEventListener('click', function () {
      removeFromCart(parseInt(btn.getAttribute('data-id'), 10));
    });
  });

  var total = cart.reduce(function (sum, item) {
    return sum + item.price * item.qty;
  }, 0);

  totalEl.textContent = formatPrice(total);
}

function initCartSidebar() {
  var cartBtn = document.getElementById('cartBtn');
  var cartClose = document.getElementById('cartClose');
  var cartSidebar = document.getElementById('cartSidebar');
  var cartOverlay = document.getElementById('cartOverlay');

  if (!cartBtn || !cartSidebar) return;

  function openCart() {
    cartSidebar.classList.add('open');
    if (cartOverlay) cartOverlay.classList.add('open');
  }

  function closeCart() {
    cartSidebar.classList.remove('open');
    if (cartOverlay) cartOverlay.classList.remove('open');
  }

  cartBtn.addEventListener('click', openCart);
  if (cartClose) cartClose.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);
}
