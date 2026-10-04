/* ============================================================
   Product detail page — reads ?id= from URL
   ============================================================ */

function getProductIdFromUrl() {
  var params = new URLSearchParams(window.location.search);
  return parseInt(params.get('id'), 10);
}

fetchProducts()
  .then(function (data) {
    allProducts = data;
    var productId = getProductIdFromUrl();
    var product = allProducts.find(function (p) {
      return p.id === productId;
    });

    if (!product) {
      showProductNotFound();
      return;
    }

    renderProductDetail(product);
    renderRelated(product);
  })
  .catch(function (err) {
    console.error(err);
    document.getElementById('productDetailContent').innerHTML =
      '<p class="empty-msg" style="color:red;">Could not load product. Use Live Server.</p>';
  });

function showProductNotFound() {
  document.getElementById('productDetailContent').innerHTML =
    '<div class="not-found">' +
      '<h2>Product not found</h2>' +
      '<p>This item does not exist or the link is wrong.</p>' +
      '<a href="shop.html" class="btn btn-primary">Back to Shop</a>' +
    '</div>';
  document.title = 'Product Not Found - Fruitables';
}

function renderProductDetail(product) {
  document.title = product.name + ' - Fruitables';

  var breadcrumbName = document.getElementById('breadcrumbName');
  if (breadcrumbName) breadcrumbName.textContent = product.name;

  var badgeHtml = product.badge
    ? '<span class="detail-badge">' + product.badge + '</span>'
    : '';

  var container = document.getElementById('productDetailContent');
  container.innerHTML =
    '<div class="detail-layout">' +
      '<div class="detail-image">' +
        badgeHtml +
        '<img src="' + product.image + '" alt="' + product.name + '">' +
      '</div>' +
      '<div class="detail-info">' +
        '<span class="prod-cat">' + product.category + '</span>' +
        '<h1>' + product.name + '</h1>' +
        '<p class="detail-price">' + formatPrice(product.price) + ' <small>/ ' + product.unit + '</small></p>' +
        '<p class="detail-desc">' + product.description + '</p>' +
        '<ul class="detail-meta">' +
          '<li><i class="fa fa-check-circle"></i> 100% organic</li>' +
          '<li><i class="fa fa-truck"></i> Free shipping over ₹2,500</li>' +
          '<li><i class="fa fa-undo"></i> 30-day return</li>' +
        '</ul>' +
        '<div class="detail-actions">' +
          '<button type="button" class="btn btn-primary btn-lg" id="detailAddBtn">Add to Cart</button>' +
          '<a href="shop.html" class="btn btn-outline">Back to Shop</a>' +
        '</div>' +
      '</div>' +
    '</div>';

  document.getElementById('detailAddBtn').addEventListener('click', function () {
    addToCart(product, this);
  });
}

function renderRelated(current) {
  var related = allProducts
    .filter(function (p) {
      return p.category === current.category && p.id !== current.id;
    })
    .slice(0, 4);

  if (related.length === 0) return;

  document.getElementById('relatedSection').style.display = 'block';
  renderProducts(related, 'relatedGrid');
  setupAddToCartDelegation('relatedGrid');
}
