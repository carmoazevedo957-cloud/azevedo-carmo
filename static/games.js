const area = document.querySelector('#game-area');
const game = document.querySelector('.game-shell').dataset.game;

const esc = (text) => String(text).replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));
const button = (text, className = '') => `<button class="game-button ${className}">${text}</button>`;

function tabuada() {
    let house = 2, points = 0, lives = 5, current = null, timer = null;
    const drawMenu = () => {
        area.innerHTML = `<h2>Escolha uma tabuada</h2><p>Resolva as contas antes que elas caiam.</p><div class="number-grid">${Array.from({length: 10}, (_, i) => `<button class="number-button ${house === i + 1 ? 'selected' : ''}" data-house="${i + 1}">${i + 1}</button>`).join('')}</div>${button('Jogar todas', 'primary')}<div class="status">Casa escolhida: <strong>${house}</strong></div>`;
        area.querySelectorAll('[data-house]').forEach((item) => item.onclick = () => { house = Number(item.dataset.house); drawMenu(); });
        area.querySelector('.primary').onclick = () => start(house === 0 ? 1 : house, house === 0);
    };
    const start = (selected, all) => {
        points = 0; lives = 5; current = newQuestion(selected); render();
    };
    const newQuestion = (selected) => { const multiplier = Math.floor(Math.random() * 10) + 1; return { house: selected, multiplier, answer: selected * multiplier, deadline: Date.now() + 7000 }; };
    const render = () => {
        clearInterval(timer); timer = setInterval(() => { if (Date.now() >= current.deadline) { lives--; next(); } else render(); }, 250);
        area.innerHTML = `<div class="score-line"><strong>Pontos: ${points}</strong><strong>Vidas: ${'♥'.repeat(lives)}</strong></div><div class="falling-card"><small>Tempo: ${Math.max(0, Math.ceil((current.deadline - Date.now()) / 1000))}s</small><h2>${current.house} × ${current.multiplier} = ?</h2></div><form id="answer-form"><input id="answer" type="number" min="0" max="999" autofocus required aria-label="Resposta"><button class="game-button primary">Responder</button></form><p id="message"></p><button id="quit" class="text-button">Voltar ao menu</button>`;
        area.querySelector('#answer-form').onsubmit = (event) => { event.preventDefault(); const value = Number(area.querySelector('#answer').value); if (value === current.answer) { points += 10; message('Correto! +10 pontos', 'success'); } else { lives--; message(`A resposta era ${current.answer}.`, 'error'); } setTimeout(next, 650); };
        area.querySelector('#quit').onclick = drawMenu;
    };
    const message = (text, type) => { const target = area.querySelector('#message'); target.textContent = text; target.className = type; };
    const next = () => { clearInterval(timer); if (lives <= 0) { area.innerHTML = `<h2>Fim de jogo</h2><p>Você fez ${points} pontos.</p>${button('Jogar novamente', 'primary')}</p>`; area.querySelector('button').onclick = drawMenu; } else { current = newQuestion(current.house); render(); } };
    drawMenu();
}

function saudacoes() {
    const cards = [{pt:'Bom dia!', en:['good morning']},{pt:'Boa tarde!', en:['good afternoon']},{pt:'Boa noite!', en:['good night','good evening']},{pt:'Olá!', en:['hello','hi']},{pt:'Tudo bem?', en:['how are you?','how are you']},{pt:'Tchau!', en:['bye','goodbye']},{pt:'Por favor', en:['please']},{pt:'Obrigado(a)', en:['thank you','thanks']}].sort(() => Math.random() - .5);
    let index = 0, right = 0, wrong = 0, revealed = false;
    const normalize = (value) => value.trim().toLowerCase().replace(/[!?]/g, '');
    const draw = () => { const card = cards[index]; area.innerHTML = `<div class="score-line"><strong>Acertos: ${right}</strong><strong>Erros: ${wrong}</strong><strong>${index + 1}/${cards.length}</strong></div><div class="flashcard"><small>Traduza para inglês</small><h2>${esc(card.pt)}</h2></div><form id="answer-form"><input id="answer" autocomplete="off" autofocus placeholder="Digite em inglês" required><button class="game-button primary">Verificar</button></form><p id="message"></p>${button('Revelar resposta', 'secondary')} ${button('Próxima', 'secondary')}`;
        area.querySelector('#answer-form').onsubmit = (event) => { event.preventDefault(); if (card.en.includes(normalize(area.querySelector('#answer').value))) { right++; show(`Correto! ${card.en[0]}`, 'success'); } else { wrong++; show(`Tente novamente. Dica: ${card.en[0][0]}...`, 'error'); } };
        area.querySelectorAll('.secondary')[0].onclick = () => show(`Resposta: ${card.en.join(' / ')}`, 'hint');
        area.querySelectorAll('.secondary')[1].onclick = next;
    };
    const show = (text, type) => { revealed = true; const target = area.querySelector('#message'); target.textContent = text; target.className = type; };
    const next = () => { index = (index + 1) % cards.length; revealed = false; draw(); };
    draw();
}

function historia() {
    const questions = [{q:'Em que ano o Brasil foi descoberto?',o:['1500','1498','1502','1510'],a:0,c:'Descobrimento'},{q:'Quem proclamou a Independência do Brasil?',o:['D. Pedro I','D. Pedro II','Tiradentes','Deodoro'],a:0,c:'Independência'},{q:'Quem foi o primeiro presidente do Brasil?',o:['Deodoro da Fonseca','Floriano Peixoto','Getúlio Vargas','JK'],a:0,c:'República'},{q:'Em que ano foi abolida a escravidão?',o:['1888','1889','1880','1890'],a:0,c:'Abolição'},{q:'Quem assinou a Lei Áurea?',o:['Princesa Isabel','D. Pedro II','Deodoro','Getúlio'],a:0,c:'Abolição'}].sort(() => Math.random() - .5);
    let index = 0, blue = 0, red = 0, team = 'AZUL', locked = false, timeout;
    const draw = () => { const item = questions[index]; locked = false; clearTimeout(timeout); area.innerHTML = `<div class="team-score"><strong class="blue">AZUL: ${blue}</strong><strong class="red">VERMELHA: ${red}</strong></div><div class="timer">15</div><div class="question"><small>${item.c}</small><h2>${item.q}</h2></div><div class="options">${item.o.map((option, i) => `<button class="option" data-answer="${i}"><b>${'ABCD'[i]})</b> ${esc(option)}</button>`).join('')}</div><p>Vez da equipe <strong>${team}</strong></p><p id="message"></p>`; area.querySelectorAll('.option').forEach((option) => option.onclick = () => answer(Number(option.dataset.answer))); let seconds = 15; const timer = area.querySelector('.timer'); timeout = setInterval(() => { seconds--; timer.textContent = seconds; if (seconds <= 0) { clearInterval(timeout); show('Tempo esgotado!', 'error'); setTimeout(next, 700); } }, 1000); };
    const answer = (choice) => { if (locked) return; locked = true; clearInterval(timeout); const item = questions[index]; if (choice === item.a) { if (team === 'AZUL') blue += 10; else red += 10; show(`Certo! +10 para ${team}`, 'success'); } else show(`Errado! A resposta era ${item.o[item.a]}.`, 'error'); setTimeout(next, 900); };
    const show = (text, type) => { const target = area.querySelector('#message'); target.textContent = text; target.className = type; };
    const next = () => { index = (index + 1) % questions.length; team = team === 'AZUL' ? 'VERMELHA' : 'AZUL'; draw(); };
    draw();
}

if (game === 'tabuada') tabuada();
if (game === 'saudacoes') saudacoes();
if (game === 'gincana') historia();
