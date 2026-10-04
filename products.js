/* ============================================================
   Shared product helpers — cards, fetch, render
   ============================================================ */

var allProducts = [];

function fetchProducts() {
  return fetch('data/products.json').then(function (response) {
    if (!response.ok) {
      throw new Error('Could not load products.json');
    }
    return response.json();
  });
}

function createProductCard(product) {
  var card = document.createElement('div');
  card.className = 'prod-card prod-card--clickable';

  var badgeClass = '';
  if (product.badge === 'Fresh') badgeClass = 'badge-fresh';
  if (product.badge === 'Popular') badgeClass = 'badge-popular';

  var badgeHtml = product.badge
    ? '<span class="prod-badge ' + badgeClass + '">' + product.badge + '</span>'
    : '';

  var detailUrl = 'product.html?id=' + product.id;

  card.innerHTML =
    '<div class="prod-img-wrap">' +
      badgeHtml +
      '<img src="' + product.image + '" alt="' + product.name + '">' +
    '</div>' +
    '<div class="prod-body">' +
      '<span class="prod-cat">' + product.category + '</span>' +
      '<h4 class="prod-title-link">' + product.name + '</h4>' +
      '<p>' + product.description + '</p>' +
      '<div class="prod-footer">' +
        '<span class="prod-price">' + formatPrice(product.price) + ' / ' + product.unit + '</span>' +
        '<button type="button" class="prod-add" data-id="' + product.id + '">Add to Cart</button>' +
      '</div>' +
    '</div>';

  card.addEventListener('click', function (e) {
    if (e.target.closest('.prod-add')) return;
    window.location.href = detailUrl;
  });

  return card;
}

function renderProducts(products, gridId) {
  var grid = document.getElementById(gridId || 'productGrid');
  if (!grid) return;

  grid.innerHTML = '';

  if (products.length === 0) {
    grid.innerHTML = '<p class="empty-msg">No products found.</p>';
    return;
  }

  products.forEach(function (product) {
    grid.appendChild(createProductCard(product));
  });
}

function setupAddToCartDelegation(gridId) {
  var grid = document.getElementById(gridId || 'productGrid');
  if (!grid) return;

  grid.addEventListener('click', function (e) {
    var btn = e.target.closest('.prod-add');
    if (!btn) return;

    e.preventDefault();
    var id = parseInt(btn.getAttribute('data-id'), 10);
    var product = allProducts.find(function (p) {
      return p.id === id;
    });
    addToCart(product, btn);
  });
}

function showFetchError(gridId) {
  var grid = document.getElementById(gridId || 'productGrid');
  if (grid) {
    grid.innerHTML =
      '<p class="empty-msg" style="color:red;">Failed to load products. Use Live Server to open the site.</p>';
  }
}
