let currentLang = localStorage.getItem('chessWorldLang') || 'en';

// Create language toggle button if it doesn't exist
if (!document.getElementById('lang-toggle')) {
  const nav = document.querySelector('nav ul');
  const langToggle = document.createElement('li');
  langToggle.innerHTML = `<button id="lang-toggle" class="lang-btn">${currentLang === 'en' ? 'Deutsch' : 'English'}</button>`;
  nav.appendChild(langToggle);
}

// Add event listener to the language toggle button
const langBtn = document.getElementById('lang-toggle');
if (langBtn) {
  langBtn.addEventListener('click', toggleLanguage);
}

// Apply translations on page load
applyTranslations();

// Function to toggle language
function toggleLanguage() {
  currentLang = currentLang === 'en' ? 'de' : 'en';
  localStorage.setItem('chessWorldLang', currentLang);

  // Update button text
  const langBtn = document.getElementById('lang-toggle');
  if (langBtn) {
    langBtn.textContent = currentLang === 'en' ? 'Deutsch' : 'English';
  }

  // Apply translations
  applyTranslations();
}

// Function to apply translations
function applyTranslations() {
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (translations[currentLang] && translations[currentLang][key]) {
      element.textContent = translations[currentLang][key];
    }
  });
}