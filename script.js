const cards = [...document.querySelectorAll('.game-card')];
const filters = [...document.querySelectorAll('.filter-chip')];
const search = document.querySelector('#game-search');
const count = document.querySelector('#game-count');
const emptyState = document.querySelector('#empty-state');
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('#main-nav');
const visitorCounter = document.querySelector('#visit-counter');

let activeFilter = 'todos';

function updateVisitorCounter() {
  if (!visitorCounter) return;

  try {
    const storageKey = 'jogos-educativos-visitas';
    const currentVisits = Number(localStorage.getItem(storageKey) || 0);
    const nextVisits = currentVisits + 1;
    localStorage.setItem(storageKey, String(nextVisits));
    visitorCounter.textContent = String(nextVisits).padStart(4, '0');
  } catch (error) {
    visitorCounter.textContent = '0001';
  }
}

function updateGames() {
  const query = search.value.trim().toLocaleLowerCase('pt-BR');
  let visibleCount = 0;

  for (const card of cards) {
    const matchesCategory = activeFilter === 'todos' || card.dataset.category === activeFilter;
    const matchesSearch = card.dataset.title.toLocaleLowerCase('pt-BR').includes(query);
    const isVisible = matchesCategory && matchesSearch;
    card.hidden = !isVisible;
    if (isVisible) visibleCount += 1;
  }

  count.textContent = String(visibleCount).padStart(2, '0');
  emptyState.hidden = visibleCount !== 0;
}

for (const button of filters) {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    for (const filter of filters) {
      const isActive = filter === button;
      filter.classList.toggle('is-active', isActive);
      filter.setAttribute('aria-pressed', String(isActive));
    }
    updateGames();
  });
}

search.addEventListener('input', updateGames);

document.addEventListener('keydown', (event) => {
  if (event.key === '/' && document.activeElement !== search && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
    event.preventDefault();
    search.focus();
  }
});

updateVisitorCounter();

menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Abrir menu' : 'Fechar menu');
  mainNav.classList.toggle('is-open', !isOpen);
});

mainNav.addEventListener('click', (event) => {
  if (event.target.closest('a')) {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menu');
    mainNav.classList.remove('is-open');
  }
});
