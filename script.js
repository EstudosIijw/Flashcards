let flashcards = [];
let remaining = [];

// Função de embaralhamento (Fisher–Yates)
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Carrega e prepara os flashcards
fetch('flashcards.txt')
  .then(r => r.ok ? r.text() : Promise.reject('Erro ao carregar flashcards'))
  .then(text => {
    flashcards = text
      .split('\n')
      .map(l => l.trim())
      .filter(l => l && l.includes(';'))
      .map(l => {
        const sep = l.indexOf(';');
        const pergunta = l.slice(0, sep);
        const resposta = l.slice(sep + 1);
        return [pergunta, resposta];
      });
    remaining = shuffle(flashcards.slice());
    mostrarFlashcard();
  })
  .catch(err => {
    document.getElementById('pergunta').textContent = err;
  });

function mostrarFlashcard() {
  if (remaining.length === 0) {
    // Reinicia o baralho quando acabar
    remaining = shuffle(flashcards.slice());
  }
  const [q, a] = remaining.pop();
  document.getElementById('pergunta').textContent = q;
  const respEl = document.getElementById('resposta');
  respEl.textContent = a;
  respEl.style.display = 'none';
}

document.getElementById('mostrar').addEventListener('click', () => {
  document.getElementById('resposta').style.display = 'block';
});
document.getElementById('proximo').addEventListener('click', mostrarFlashcard);

// Theme switcher logic
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Function to apply the saved theme or default to light
function applyTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    themeToggle.textContent = 'Tema Claro'; // Update button text
  } else {
    body.classList.remove('dark-mode');
    themeToggle.textContent = 'Tema Escuro'; // Update button text
  }
}

// Event listener for the theme toggle button
themeToggle.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  if (body.classList.contains('dark-mode')) {
    localStorage.setItem('theme', 'dark');
    themeToggle.textContent = 'Tema Claro'; // Update button text
  } else {
    localStorage.setItem('theme', 'light');
    themeToggle.textContent = 'Tema Escuro'; // Update button text
  }
});

// Apply theme on initial load
applyTheme();
