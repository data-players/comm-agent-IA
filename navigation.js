// Navigation functionality
function showPage(pageId) {
  // Hide all pages
  const pages = document.querySelectorAll('.page-section');
  pages.forEach(page => page.classList.remove('active'));

  // Remove active class from all nav items (both main nav and page nav)
  const navItems = document.querySelectorAll('.nav-item, .page-nav-item');
  navItems.forEach(item => item.classList.remove('active'));

  // Show selected page
  document.getElementById(`page-${pageId}`).classList.add('active');

  // Find and activate corresponding nav item using data-page attribute
  const targetNavItems = document.querySelectorAll(`[data-page="${pageId}"]`);
  targetNavItems.forEach(item => item.classList.add('active'));

  // Close mobile menu if open
  const mobileMenu = document.querySelector('.nav-menu');
  if (mobileMenu) {
    mobileMenu.classList.remove('active');
  }

  // Scroll to top
  window.scrollTo(0, 0);

  // Update URL
  updateURL(pageId);
}

function toggleMobileMenu() {
  const menu = document.getElementById('navMenu');
  menu.classList.toggle('active');
}

// Handle browser back/forward buttons
window.addEventListener('popstate', function(event) {
  if (event.state && event.state.page) {
    showPageById(event.state.page);
  }
});

function showPageById(pageId) {
  const pages = document.querySelectorAll('.page-section');
  pages.forEach(page => page.classList.remove('active'));

  const navItems = document.querySelectorAll('.nav-item, .page-nav-item');
  navItems.forEach(item => item.classList.remove('active'));

  document.getElementById(`page-${pageId}`).classList.add('active');
  
  // Find and activate corresponding nav item using data-page attribute
  const targetNavItems = document.querySelectorAll(`[data-page="${pageId}"]`);
  targetNavItems.forEach(item => item.classList.add('active'));
}

// Update URL without page reload
function updateURL(pageId) {
  const url = new URL(window.location);
  url.searchParams.set('page', pageId);
  history.pushState({page: pageId}, '', url);
}

// Check URL on page load
document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const page = urlParams.get('page');
  
  if (page && ['general', 'interne', 'public', 'qualite'].includes(page)) {
    showPageById(page);
  }
}); 