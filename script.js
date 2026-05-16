// Theme toggle
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;
const currentTheme = localStorage.getItem('theme') || 'dark';

html.setAttribute('data-theme', currentTheme);
themeToggle.textContent = currentTheme === 'dark' ? '☀' : '🌙';

themeToggle.addEventListener('click', () => {
  const newTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  themeToggle.textContent = newTheme === 'dark' ? '☀' : '🌙';
});

// Brand tab switching
const brandTabs = document.querySelectorAll('.brand-tab');
const brandSections = document.querySelectorAll('.brand-section');
const allCards = document.querySelectorAll('.app-card');
const totalApps = document.getElementById('totalApps');
const visibleApps = document.getElementById('visibleApps');
const noResults = document.getElementById('noResults');
const search = document.getElementById('search');

let currentBrand = 'all';

function updateCounts() {
  const visible = document.querySelectorAll('.app-card:not([style*="display: none"])').length;
  visibleApps.textContent = visible;
  noResults.style.display = visible === 0 ? 'block' : 'none';
}

function filterByBrand(brand) {
  currentBrand = brand;
  
  brandSections.forEach(section => {
    const sectionBrand = section.dataset.brand;
    
    if (brand === 'all') {
      section.style.display = 'block';
    } else {
      if (sectionBrand === brand) {
        section.style.display = 'block';
      } else {
        section.style.display = 'none';
      }
    }
  });
  
  filterBySearch(search.value);
}

function filterBySearch(query) {
  const q = query.toLowerCase();
  let visible = 0;
  
  allCards.forEach(card => {
    const text = card.dataset.name.toLowerCase();
    const parentSection = card.closest('.brand-section');
    const sectionBrand = parentSection.dataset.brand;
    
    const matchesSearch = text.includes(q);
    const matchesBrand = currentBrand === 'all' || sectionBrand === currentBrand;
    
    if (matchesSearch && matchesBrand) {
      card.style.display = 'block';
      visible++;
    } else {
      card.style.display = 'none';
    }
  });
  
  visibleApps.textContent = visible;
  noResults.style.display = visible === 0 ? 'block' : 'none';
}

brandTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    brandTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    filterByBrand(tab.dataset.brand);
  });
});

search.addEventListener('input', (e) => {
  filterBySearch(e.target.value);
});

// Initialize - show lahat sa start
totalApps.textContent = allCards.length;
filterByBrand('all');

// Share functions
function shareToQuickShare(url, title) {
  window.location.href = `intent://send?text=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}#Intent;action=android.intent.action.SEND;type=text/plain;package=com.samsung.android.app.sharelive;end`;
}

function shareToChrome(url) {
  window.location.href = `intent://${url.replace(/^https?:\/\//, '')}#Intent;scheme=https;package=com.android.chrome;end`;
}

async function copyLink(url, btn) {
  await navigator.clipboard.writeText(url);
  const originalText = btn.textContent;
  btn.textContent = '✓';
  setTimeout(() => btn.textContent = originalText, 1500);
}

async function nativeShare(url, title) {
  if (navigator.share) {
    try {
      await navigator.share({ title: title, text: title, url: url });
    } catch (err) {
      console.log('Share cancelled');
    }
  } else {
    await navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  }
}
