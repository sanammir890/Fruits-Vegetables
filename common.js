/* ============================================================
   Shared UI — navbar, search popup, cart sidebar, menu
   ============================================================ */

function initCommonUI() {
  loadCart();
  updateCartBadge();
  updateCartSidebar();
  initCartSidebar();
  initSearchDialog();
  initNavDropdown();
  initMobileNav();

  var navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  var newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      alert('Thanks for subscribing!');
      e.target.reset();
    });
  }

  markActiveNavLink();
}

function initSearchDialog() {
  var toggleBtn = document.getElementById('searchToggleBtn');
  var dialog = document.getElementById('searchDialog');
  var overlay = document.getElementById('searchDialogOverlay');
  var closeBtn = document.getElementById('searchDialogClose');
  var searchBtn = document.getElementById('searchDialogBtn');
  var input = document.getElementById('searchDialogInput');

  if (!toggleBtn || !dialog) return;

  function openSearch() {
    dialog.classList.add('open');
    if (overlay) overlay.classList.add('open');
    document.body.classList.add('no-scroll');
    setTimeout(function () {
      if (input) input.focus();
    }, 100);
  }

  function closeSearch() {
    dialog.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.classList.remove('no-scroll');
  }

  toggleBtn.addEventListener('click', openSearch);
  if (closeBtn) closeBtn.addEventListener('click', closeSearch);
  if (overlay) overlay.addEventListener('click', closeSearch);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && dialog.classList.contains('open')) {
      closeSearch();
    }
  });

  function runSearch() {
    var query = input ? input.value.trim() : '';
    if (query) {
      window.location.href = 'shop.html?q=' + encodeURIComponent(query);
    } else {
      window.location.href = 'shop.html';
    }
  }

  if (searchBtn) searchBtn.addEventListener('click', runSearch);
  if (input) {
    input.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') runSearch();
    });
  }
}

function initMobileNav() {
  var hamburger = document.getElementById('hamburger');
  var navLinks = document.getElementById('navLinks');

  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', function () {
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      closeNavDropdown();
    });
  });
}

function initNavDropdown() {
  var dropdown = document.getElementById('pagesDropdown');
  var toggle = document.getElementById('pagesDropdownBtn');

  if (!dropdown || !toggle) return;

  toggle.addEventListener('click', function (e) {
    e.stopPropagation();
    var isOpen = dropdown.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  document.addEventListener('click', function (e) {
    if (!dropdown.contains(e.target)) {
      closeNavDropdown();
    }
  });
}

function closeNavDropdown() {
  var dropdown = document.getElementById('pagesDropdown');
  var toggle = document.getElementById('pagesDropdownBtn');
  if (dropdown) dropdown.classList.remove('open');
  if (toggle) toggle.setAttribute('aria-expanded', 'false');
}

function markActiveNavLink() {
  var path = window.location.pathname.split('/').pop() || 'index.html';
  if (path === '') path = 'index.html';

  document.querySelectorAll('.nav-links > li > a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (!href || href.charAt(0) === '#') return;
    var linkFile = href.split('?')[0].split('#')[0];
    if (linkFile === path) link.classList.add('nav-active');
  });

  document.querySelectorAll('.nav-dropdown-menu a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (!href) return;
    var linkFile = href.split('?')[0];
    if (linkFile === path) {
      link.classList.add('nav-active');
      var dropdown = document.getElementById('pagesDropdown');
      var toggle = document.getElementById('pagesDropdownBtn');
      if (dropdown) dropdown.classList.add('nav-active-parent');
      if (toggle) toggle.classList.add('nav-active');
    }
  });
}

document.addEventListener('DOMContentLoaded', initCommonUI);
