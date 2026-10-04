/* Full cart page — renders items from localStorage */

function renderCartPage() {
  var container = document.getElementById('cartPageContent');
  var summary = document.getElementById('cartPageSummary');
  var totalEl = document.getElementById('cartPageTotal');

  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML =
      '<div class="cart-page-empty">' +
        '<i class="fa fa-shopping-basket"></i>' +
        '<h2>Your cart is empty</h2>' +
        '<p>Add fresh products from our shop.</p>' +
        '<a href="shop.html" class="btn btn-primary">Go to Shop</a>' +
      '</div>';
    if (summary) summary.style.display = 'none';
    return;
  }

  container.innerHTML = '<div class="cart-page-list" id="cartPageList"></div>';
  var list = document.getElementById('cartPageList');

  cart.forEach(function (item) {
    var row = document.createElement('div');
    row.className = 'cart-page-row';
    row.innerHTML =
      '<img src="' + item.image + '" alt="' + item.name + '">' +
      '<div class="cart-page-row-info">' +
        '<h4>' + item.name + '</h4>' +
        '<span>' + formatPrice(item.price) + ' each</span>' +
        '<span class="cart-page-qty">Qty: ' + item.qty + '</span>' +
      '</div>' +
      '<div class="cart-page-row-right">' +
        '<strong>' + formatPrice(item.price * item.qty) + '</strong>' +
        '<button type="button" class="cart-remove" data-id="' + item.id + '" aria-label="Remove">' +
          '<i class="fa fa-trash"></i> Remove' +
        '</button>' +
      '</div>';
    list.appendChild(row);
  });

  list.querySelectorAll('.cart-remove').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = parseInt(btn.getAttribute('data-id'), 10);
      removeFromCart(id);
      renderCartPage();
    });
  });

  var total = cart.reduce(function (sum, item) {
    return sum + item.price * item.qty;
  }, 0);

  if (totalEl) totalEl.textContent = formatPrice(total);
  if (summary) summary.style.display = 'flex';
}

document.addEventListener('DOMContentLoaded', function () {
  setTimeout(renderCartPage, 50);
});
