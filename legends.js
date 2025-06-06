document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('legend-modal');
  const modalContent = document.getElementById('modal-content');
  const closeModalBtn = document.querySelector('.close-modal');
  const readMoreBtns = document.querySelectorAll('.read-more-btn');

  // Legend data
  const legendData = {
    carlsen: {
      name: "Magnus Carlsen",
      title: "World Chess Champion 2013-2023",
      nationality: "Norwegian",
      years: "1990 - Present",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Magnus_Carlsen_%282019%29.png/220px-Magnus_Carlsen_%282019%29.png",
      bio: "Magnus Carlsen is widely regarded as the strongest chess player of all time. Known for his versatile play, strategic depth, and extraordinary endgame technique, Carlsen became a grandmaster at age 13 and achieved the world's highest rating at age 19. In 2023, he chose not to defend his World Championship title but continues to dominate the chess scene.<br><br>Carlsen is known for his photographic memory and exceptional intuition. He can recall games he played years ago and perform complex calculations with extraordinary speed. His play is often described as 'universal,' as he excels in all types of positions - tactical, positional, endgame, and middle game.<br><br>Beyond classical chess, Carlsen is also a formidable blitz and rapid player, winning multiple world championships in these formats. He has also embraced online chess and streaming, helping to bring the game to a wider audience.",
      achievements: [
        "Highest rated player in history (peak rating 2882)",
        "World Chess Champion 2013-2023",
        "World Rapid Chess Champion (2014, 2015, 2019, 2022)",
        "World Blitz Chess Champion (2009, 2014, 2017, 2018, 2022)",
        "Winner of numerous elite tournaments"
      ],
      famousGame: "The 'Immortal Draw' vs Karjakin, 2021"
    },
    kasparov: {
      name: "Garry Kasparov",
      title: "World Chess Champion 1985-2000",
      nationality: "Russian",
      years: "1963 - Present",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Garry_Kasparov%2C_Avast_2018_cropped.jpg/220px-Garry_Kasparov%2C_Avast_2018_cropped.jpg",
      bio: "Garry Kasparov dominated chess from the mid-1980s until his retirement in 2005. Known for his dynamic and aggressive style, he was the highest-rated player for 20 years. His matches against IBM's Deep Blue computer marked a historic moment in AI development.<br><br>Kasparov's preparation and opening knowledge revolutionized chess theory. He embraced computer analysis earlier than most of his contemporaries, which gave him a significant advantage. His tactical ability and calculating power were legendary, earning him the nickname 'The Beast from Baku'.<br><br>Since retiring from professional chess, Kasparov has become an influential political activist, author, and commentator. He remains involved in chess through coaching, writing, and his Kasparov Chess Foundation, which promotes chess education worldwide.",
      achievements: [
        "World Chess Champion for 15 years (1985-2000)",
        "Ranked world #1 for 255 months",
        "Winner of 15+ super-tournaments with 1st or shared 1st place",
        "First player to break the 2800 Elo rating barrier",
        "Authored influential chess books including 'My Great Predecessors' series"
      ],
      famousGame: "Kasparov vs Topalov, Wijk aan Zee 1999 (featuring the famous 'immortal' queen sacrifice)"
    },
    fischer: {
      name: "Bobby Fischer",
      title: "World Chess Champion 1972-1975",
      nationality: "American",
      years: "1943 - 2008",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Bobby_Fischer_1960_in_Leipzig.jpg/220px-Bobby_Fischer_1960_in_Leipzig.jpg",
      bio: "Robert James Fischer was a chess prodigy who became famous for his brilliant play and eccentric behavior. His 1972 World Championship victory against Boris Spassky during the Cold War captivated global attention.<br><br>Fischer's contributions to chess include innovative opening preparation and the invention of Fischer Random Chess (Chess960). Despite his troubled later years, his impact on chess remains legendary.<br><br>Fischer's famous quote, 'I don't believe in psychology. I believe in good moves,' reflected his pure approach to chess. His clarity of play and precision were remarkable, with an ability to find the most accurate moves in complex positions. Perhaps most impressively, Fischer achieved his incredible results largely on his own, without the teams of seconds and computer assistance that later champions would rely on.",
      achievements: [
        "US Chess Champion at age 14",
        "Won 20 consecutive matches in the 1970-71 Candidates Tournament",
        "Defeated Boris Spassky in the 'Match of the Century' (1972)",
        "Achieved the highest rating gap between #1 and #2 players (125 points)",
        "Invented Fischer Random Chess (Chess960)"
      ],
      famousGame: "The 'Game of the Century' vs Donald Byrne (1956), played when Fischer was only 13 years old"
    },
    karpov: {
      name: "Anatoly Karpov",
      title: "World Chess Champion 1975-1985",
      nationality: "Russian",
      years: "1951 - Present",
      image: "Pictures/Anatoly_Karpov_(1957).jpg",
      bio: "Anatoly Karpov became World Champion by default when Fischer refused to defend his title in 1975. Despite this unusual beginning, Karpov proved his worth by dominating chess through the late 1970s and early 1980s.<br><br>Known for his positional mastery and endgame technique, Karpov's epic rivalry with Kasparov produced some of the greatest games in chess history. Their five world championship matches (1984-1990) featured 144 games of extraordinary quality and fighting spirit.<br><br>Karpov's style was characterized by a seemingly simple but enormously effective strategic approach. He would create tiny weaknesses in his opponent's position, then gradually accumulate small advantages until they became decisive. This 'boa constrictor' style of play made him particularly feared in endgames.",
      achievements: [
        "World Chess Champion for a decade (1975-1985)",
        "Over 160 tournament victories throughout his career",
        "Played five epic world championship matches against Kasparov",
        "Won the World Rapid Chess Championship at age 51",
        "One of the greatest positional players in chess history"
      ],
      famousGame: "Karpov vs Unzicker, 1974 - a brilliant demonstration of positional chess and strategic domination"
    }
  };

  // Open modal with legend details
  function openModal(legendId) {
    const legend = legendData[legendId];
    if (!legend) return;

    let achievementsList = '';
    legend.achievements.forEach(achievement => {
      achievementsList += `<li>${achievement}</li>`;
    });

    modalContent.innerHTML = `
            <div class="modal-header">
                <h2>${legend.name}</h2>
                <p class="legend-title">${legend.title}</p>
                <p class="legend-years">${legend.years} • ${legend.nationality}</p>
            </div>
            <div class="modal-body">
                <img src="${legend.image}" alt="${legend.name}" style="float:right;margin:0 0 15px 15px;max-width:200px;">
                <div class="legend-full-bio">
                    <p>${legend.bio}</p>
                </div>
                <div class="legend-achievements">
                    <h3>Key Achievements</h3>
                    <ul>${achievementsList}</ul>
                </div>
                <div class="legend-famous-game">
                    <h3>Famous Game</h3>
                    <p>${legend.famousGame}</p>
                </div>
            </div>
        `;

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  }

  // Close modal
  function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Enable scrolling
  }

  // Set up event listeners
  readMoreBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const legendId = this.getAttribute('data-legend');
      openModal(legendId);
    });
  });

  closeModalBtn.addEventListener('click', closeModal);

  // Close modal when clicking outside
  window.addEventListener('click', function(event) {
    if (event.target == modal) {
      closeModal();
    }
  });

  // Close modal with Escape key
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      closeModal();
    }
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

  // Legend data
  const legendData = {
    carlsen: {
      name: "Magnus Carlsen",
      title: "World Chess Champion 2013-2023",
      nationality: "Norwegian",
      years: "1990 - Present",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Magnus_Carlsen_%282019%29.png/220px-Magnus_Carlsen_%282019%29.png",
      bio: "Magnus Carlsen is widely regarded as the strongest chess player of all time. Known for his versatile play, strategic depth, and extraordinary endgame technique, Carlsen became a grandmaster at age 13 and achieved the world's highest rating at age 19. In 2023, he chose not to defend his World Championship title but continues to dominate the chess scene.<br><br>Carlsen is known for his photographic memory and exceptional intuition. He can recall games he played years ago and perform complex calculations with extraordinary speed. His play is often described as 'universal,' as he excels in all types of positions - tactical, positional, endgame, and middle game.<br><br>Beyond classical chess, Carlsen is also a formidable blitz and rapid player, winning multiple world championships in these formats. He has also embraced online chess and streaming, helping to bring the game to a wider audience.",
      achievements: [
        "Highest rated player in history (peak rating 2882)",
        "World Chess Champion 2013-2023",
        "World Rapid Chess Champion (2014, 2015, 2019, 2022)",
        "World Blitz Chess Champion (2009, 2014, 2017, 2018, 2022)",
        "Winner of numerous elite tournaments"
      ],
      famousGame: "The 'Immortal Draw' vs Karjakin, 2021"
    },
    kasparov: {
      name: "Garry Kasparov",
      title: "World Chess Champion 1985-2000",
      nationality: "Russian",
      years: "1963 - Present",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Garry_Kasparov%2C_Avast_2018_cropped.jpg/220px-Garry_Kasparov%2C_Avast_2018_cropped.jpg",
      bio: "Garry Kasparov dominated chess from the mid-1980s until his retirement in 2005. Known for his dynamic and aggressive style, he was the highest-rated player for 20 years. His matches against IBM's Deep Blue computer marked a historic moment in AI development.<br><br>Kasparov's preparation and opening knowledge revolutionized chess theory. He embraced computer analysis earlier than most of his contemporaries, which gave him a significant advantage. His tactical ability and calculating power were legendary, earning him the nickname 'The Beast from Baku'.<br><br>Since retiring from professional chess, Kasparov has become an influential political activist, author, and commentator. He remains involved in chess through coaching, writing, and his Kasparov Chess Foundation, which promotes chess education worldwide.",
      achievements: [
        "World Chess Champion for 15 years (1985-2000)",
        "Ranked world #1 for 255 months",
        "Winner of 15+ super-tournaments with 1st or shared 1st place",
        "First player to break the 2800 Elo rating barrier",
        "Authored influential chess books including 'My Great Predecessors' series"
      ],
      famousGame: "Kasparov vs Topalov, Wijk aan Zee 1999 (featuring the famous 'immortal' queen sacrifice)"
    },
    fischer: {
      name: "Bobby Fischer",
      title: "World Chess Champion 1972-1975",
      nationality: "American",
      years: "1943 - 2008",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Bobby_Fischer_1960_in_Leipzig.jpg/220px-Bobby_Fischer_1960_in_Leipzig.jpg",
      bio: "Robert James Fischer was a chess prodigy who became famous for his brilliant play and eccentric behavior. His 1972 World Championship victory against Boris Spassky during the Cold War captivated global attention.<br><br>Fischer's contributions to chess include innovative opening preparation and the invention of Fischer Random Chess (Chess960). Despite his troubled later years, his impact on chess remains legendary.<br><br>Fischer's famous quote, 'I don't believe in psychology. I believe in good moves,' reflected his pure approach to chess. His clarity of play and precision were remarkable, with an ability to find the most accurate moves in complex positions. Perhaps most impressively, Fischer achieved his incredible results largely on his own, without the teams of seconds and computer assistance that later champions would rely on.",
      achievements: [
        "US Chess Champion at age 14",
        "Won 20 consecutive matches in the 1970-71 Candidates Tournament",
        "Defeated Boris Spassky in the 'Match of the Century' (1972)",
        "Achieved the highest rating gap between #1 and #2 players (125 points)",
        "Invented Fischer Random Chess (Chess960)"
      ],
      famousGame: "The 'Game of the Century' vs Donald Byrne (1956), played when Fischer was only 13 years old"
    },
    karpov: {
      name: "Anatoly Karpov",
      title: "World Chess Champion 1975-1985",
      nationality: "Russian",
      years: "1951 - Present",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Anatoli_Karpov_2017.jpg/220px-Anatoli_Karpov_2017.jpg",
      bio: "Anatoly Karpov became World Champion by default when Fischer refused to defend his title in 1975. Despite this unusual beginning, Karpov proved his worth by dominating chess through the late 1970s and early 1980s.<br><br>Known for his positional mastery and endgame technique, Karpov's epic rivalry with Kasparov produced some of the greatest games in chess history. Their five world championship matches (1984-1990) featured 144 games of extraordinary quality and fighting spirit.<br><br>Karpov's style was characterized by a seemingly simple but enormously effective strategic approach. He would create tiny weaknesses in his opponent's position, then gradually accumulate small advantages until they became decisive. This 'boa constrictor' style of play made him particularly feared in endgames.",
      achievements: [
        "World Chess Champion for a decade (1975-1985)",
        "Over 160 tournament victories throughout his career",
        "Played five epic world championship matches against Kasparov",
        "Won the World Rapid Chess Championship at age 51",
        "One of the greatest positional players in chess history"
      ],
      famousGame: "Karpov vs Unzicker, 1974 - a brilliant demonstration of positional chess and strategic domination"
    }
  };

  // Open modal with legend details
  function openModal(legendId) {
    const legend = legendData[legendId];
    if (!legend) return;

    let achievementsList = '';
    legend.achievements.forEach(achievement => {
      achievementsList += `<li>${achievement}</li>`;
    });

    modalContent.innerHTML = `
            <div class="modal-header">
                <h2>${legend.name}</h2>
                <p class="legend-title">${legend.title}</p>
                <p class="legend-years">${legend.years} • ${legend.nationality}</p>
            </div>
            <div class="modal-body">
                <img src="${legend.image}" alt="${legend.name}" style="float:right;margin:0 0 15px 15px;max-width:200px;">
                <div class="legend-full-bio">
                    <p>${legend.bio}</p>
                </div>
                <div class="legend-achievements">
                    <h3>Key Achievements</h3>
                    <ul>${achievementsList}</ul>
                </div>
                <div class="legend-famous-game">
                    <h3>Famous Game</h3>
                    <p>${legend.famousGame}</p>
                </div>
            </div>
        `;

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  }

  // Close modal
  function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Enable scrolling
  }

  // Set up event listeners
  readMoreBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const legendId = this.getAttribute('data-legend');
      openModal(legendId);
    });
  });

  closeModalBtn.addEventListener('click', closeModal);

  // Close modal when clicking outside
  window.addEventListener('click', function(event) {
    if (event.target == modal) {
      closeModal();
    }
  });

  // Close modal with Escape key
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      closeModal();
    }
  });
});