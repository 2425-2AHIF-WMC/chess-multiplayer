// Zeige/verstecke den Button beim Scrollen
window.addEventListener('scroll', function () {
  var btn = document.getElementById('back-to-top');
  if (window.pageYOffset > 300) { // bewirkt, dass der bitton erst aufscheint wenn man 300 pixel oder mehr runterscrollt
    btn.style.display = 'block'; // kein button
  } else {
    btn.style.display = 'none'; // button
  }
});

// Sanfter Scroll nach oben beim Klick
document.getElementById('back-to-top').addEventListener('click', function (e) {
  e.preventDefault(); // Verhindert das direkte Springen
  window.scrollTo({
    top: 0,
    behavior: 'smooth' // Animation "smooth" machen
  });
});


document.addEventListener('DOMContentLoaded', function() {
  // Add language toggle button
  let currentLang = localStorage.getItem('chessWorldLang') || 'en';

  // Create language toggle button if it doesn't exist
  if (!document.getElementById('lang-toggle')) {
    const nav = document.querySelector('nav ul');
    const langToggle = document.createElement('li');
    langToggle.innerHTML = `<button id="lang-toggle" class="lang-btn">${currentLang === 'en' ? 'Deutsch' : 'English'}</button>`;
    nav.appendChild(langToggle);

    // Add event listener to the language toggle button
    document.getElementById('lang-toggle').addEventListener('click', toggleLanguage);
  }

  // Apply translations on page load
  applyTranslations();

  // Function to toggle language
  function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'de' : 'en';
    localStorage.setItem('chessWorldLang', currentLang);

    // Update button text
    const langBtn = document.getElementById('lang-toggle');
    langBtn.textContent = currentLang === 'en' ? 'Deutsch' : 'English';

    // Apply translations
    applyTranslations();
  }

  // Function to apply translations
  function applyTranslations() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      if (translations[currentLang][key]) {
        element.textContent = translations[currentLang][key];
      }
    });
  }
});


