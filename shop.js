/* ============================================================
   Shop page — filters, search, product grid
   ============================================================ */

fetchProducts()
  .then(function (data) {
    allProducts = data;
    renderProducts(allProducts, 'productGrid');
    setupAddToCartDelegation('productGrid');
    setupFilters();
    applyUrlCategory();
    applyUrlSearch();
  })
  .catch(function (err) {
    console.error(err);
    showFetchError('productGrid');
  });

/* Filter tabs: All / Fruits / Vegetables */
function setupFilters() {
  var filterButtons = document.querySelectorAll('.filter-btn');

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterButtons.forEach(function (b) {
        b.classList.remove('active');
      });
      btn.classList.add('active');

      var cat = btn.getAttribute('data-cat');

      if (cat === 'all') {
        renderProducts(allProducts, 'productGrid');
      } else {
        var filtered = allProducts.filter(function (p) {
          return p.category === cat;
        });
        renderProducts(filtered, 'productGrid');
      }
    });
  });
}

/* Open shop with ?cat=vegetables from home page links */
function applyUrlCategory() {
  var params = new URLSearchParams(window.location.search);
  var cat = params.get('cat');
  if (!cat) return;

  var btn = document.querySelector('.filter-btn[data-cat="' + cat + '"]');
  if (btn) btn.click();
}

/* Search from home page: shop.html?q=apple */
function applyUrlSearch() {
  var params = new URLSearchParams(window.location.search);
  var q = params.get('q');
  if (!q) return;


  var results = allProducts.filter(function (p) {
    return (
      p.name.toLowerCase().includes(q.toLowerCase()) ||
      p.category.toLowerCase().includes(q.toLowerCase())
    );
  });

  renderProducts(results, 'productGrid');
}
