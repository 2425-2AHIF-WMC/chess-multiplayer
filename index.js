// Animation for feature cards
document.addEventListener('DOMContentLoaded', function() {
  const featureCards = document.querySelectorAll('.feature-card');

  // Basic animation for features on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, {threshold: 0.1});

  featureCards.forEach(card => {
    card.style.opacity = 0;
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
  });
});


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

document.addEventListener('DOMContentLoaded', function() {
  const featureCards = document.querySelectorAll('.feature-card');

  // Basic animation for features on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, {threshold: 0.1});

  featureCards.forEach(card => {
    card.style.opacity = 0;
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
  });

  // Language toggle functionality
  let currentLang = localStorage.getItem('chessWorldLang') || 'en';

  // Initialize language button text
  const langBtn = document.getElementById('lang-toggle');
  if (langBtn) {
    langBtn.textContent = currentLang === 'en' ? 'Deutsch' : 'English';

    // Add event listener to the language toggle button
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
      if (translations[currentLang][key]) {
        element.textContent = translations[currentLang][key];
      }
    });
  }
});



// Zeige den Button, wenn man 300px gescrollt hat
window.addEventListener('scroll', function () {
  var btn = document.getElementById('back-to-top');
  if (window.pageYOffset > 300) {
    btn.style.display = 'block';
  } else {
    btn.style.display = 'none';
  }
});





var dialLines = document.getElementsByClassName('diallines');
var clockEl = document.getElementsByClassName('clock')[0];

for (var i = 1; i < 60; i++) {
  clockEl.innerHTML += "<div class='diallines'></div>";
  dialLines[i].style.transform = "rotate(" + 6 * i + "deg)";
}

function clock() {
  var weekday = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ],
    d = new Date(),
    h = d.getHours(),
    m = d.getMinutes(),
    s = d.getSeconds(),
    date = d.getDate(),
    month = d.getMonth() + 1,
    year = d.getFullYear(),

    hDeg = h * 30 + m * (360 / 720),
    mDeg = m * 6 + s * (360 / 3600),
    sDeg = s * 6,

    hEl = document.querySelector('.hour-hand'),
    mEl = document.querySelector('.minute-hand'),
    sEl = document.querySelector('.second-hand'),
    dateEl = document.querySelector('.date'),
    dayEl = document.querySelector('.day');

  var day = weekday[d.getDay()];

  if (month < 9) {
    month = "0" + month;
  }

  hEl.style.transform = "rotate(" + hDeg + "deg)";
  mEl.style.transform = "rotate(" + mDeg + "deg)";
  sEl.style.transform = "rotate(" + sDeg + "deg)";
  dateEl.innerHTML = date + "/" + month + "/" + year;
  dayEl.innerHTML = day;
}

setInterval("clock()", 100);