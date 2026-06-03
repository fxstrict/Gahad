/* ============================================================
   script.js – ميس جهاد السمنودي Landing Page
   ============================================================ */

// ── Intersection Observer Animations ──────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = el.dataset.delay || 0;
      setTimeout(() => el.classList.add('visible'), parseInt(delay));
      observer.unobserve(el);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));

// ── Tool Tabs ──────────────────────────────────────────────
document.querySelectorAll('.tool-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tool-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tool-content').forEach(c => c.classList.add('hidden'));
    tab.classList.add('active');
    const target = document.getElementById('tool-' + tab.dataset.tool);
    if (target) target.classList.remove('hidden');
  });
});

// ── Multiplication Table ───────────────────────────────────
let selectedNum = 2;
const multNumbers = document.getElementById('multNumbers');
const multTable = document.getElementById('multTable');

function renderMultTable(n) {
  multTable.innerHTML = '';
  for (let i = 1; i <= 10; i++) {
    const cell = document.createElement('div');
    cell.className = 'mult-cell';
    cell.innerHTML = `${n} × ${i} = <strong>${n * i}</strong>`;
    multTable.appendChild(cell);
  }
}

if (multNumbers) {
  for (let i = 1; i <= 10; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    if (i === selectedNum) btn.classList.add('active');
    btn.addEventListener('click', () => {
      selectedNum = i;
      document.querySelectorAll('.number-btns button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderMultTable(i);
    });
    multNumbers.appendChild(btn);
  }
  renderMultTable(selectedNum);
}

// ── Flash Cards ────────────────────────────────────────────
const flashcardsData = [
  { q: '2 + 3 = ?', a: '5 ✓' },
  { q: 'كلمة بحرف الألف', a: 'أسد 🦁' },
  { q: 'كيف تكتب: Apple?', a: 'تفاحة 🍎' },
  { q: '5 × 4 = ?', a: '20 ✓' },
  { q: 'عاصمة مصر؟', a: 'القاهرة 🏙️' },
];

let fcIndex = 0;
let isFlipped = false;

function updateCard() {
  const fc = document.getElementById('flashcard');
  const front = document.getElementById('fcFront');
  const back = document.getElementById('fcBack');
  const counter = document.getElementById('fcCounter');
  if (!fc) return;
  isFlipped = false;
  fc.classList.remove('flipped');
  front.textContent = flashcardsData[fcIndex].q;
  back.textContent = flashcardsData[fcIndex].a;
  if (counter) counter.textContent = `${fcIndex + 1} / ${flashcardsData.length}`;
}

window.flipCard = function() {
  isFlipped = !isFlipped;
  const fc = document.getElementById('flashcard');
  if (fc) fc.classList.toggle('flipped', isFlipped);
};

window.nextCard = function() {
  fcIndex = (fcIndex + 1) % flashcardsData.length;
  updateCard();
};

window.prevCard = function() {
  fcIndex = (fcIndex - 1 + flashcardsData.length) % flashcardsData.length;
  updateCard();
};

// Click card to flip
const flashcard = document.getElementById('flashcard');
if (flashcard) flashcard.addEventListener('click', window.flipCard);
updateCard();

// ── Quick Quiz ─────────────────────────────────────────────
let quizScore = 0;
let quizTotal = 0;
let quizAnswered = false;

function generateQuestion() {
  const ops = ['+', '-', '×'];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a, b, answer;
  if (op === '+') { a = Math.floor(Math.random() * 20) + 1; b = Math.floor(Math.random() * 20) + 1; answer = a + b; }
  else if (op === '-') { a = Math.floor(Math.random() * 20) + 10; b = Math.floor(Math.random() * 10) + 1; answer = a - b; }
  else { a = Math.floor(Math.random() * 10) + 1; b = Math.floor(Math.random() * 10) + 1; answer = a * b; }

  const wrongs = new Set();
  while (wrongs.size < 3) {
    const wrong = answer + (Math.floor(Math.random() * 10) - 5);
    if (wrong !== answer && wrong > 0) wrongs.add(wrong);
  }

  const options = [answer, ...wrongs].sort(() => Math.random() - 0.5);
  const qEl = document.getElementById('quizQ');
  const optsEl = document.getElementById('quizOpts');
  const resultEl = document.getElementById('quizResult');

  if (!qEl) return;
  qEl.textContent = `${a} ${op} ${b} = ?`;
  resultEl.textContent = '';
  optsEl.innerHTML = '';
  quizAnswered = false;

  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.textContent = opt;
    btn.addEventListener('click', () => {
      if (quizAnswered) return;
      quizAnswered = true;
      quizTotal++;
      document.getElementById('quizTotal').textContent = quizTotal;
      if (opt === answer) {
        quizScore++;
        document.getElementById('quizScore').textContent = quizScore;
        btn.classList.add('correct');
        resultEl.textContent = '✅ إجابة صحيحة!';
        resultEl.style.color = '#28a745';
      } else {
        btn.classList.add('wrong');
        resultEl.textContent = `❌ الإجابة الصحيحة: ${answer}`;
        resultEl.style.color = '#dc3545';
        optsEl.querySelectorAll('button').forEach(b => { if (parseInt(b.textContent) === answer) b.classList.add('correct'); });
      }
      setTimeout(generateQuestion, 1800);
    });
    optsEl.appendChild(btn);
  });
}
generateQuestion();

// ── Counting Tool ──────────────────────────────────────────
const fruits = ['🍎', '🍊', '🍋', '🍇', '🍓', '🫐', '🍌', '🍉', '🍑', '🥝'];
let countVal = 1;

window.changeCount = function(delta) {
  countVal = Math.max(1, Math.min(10, countVal + delta));
  const displayEl = document.getElementById('countingDisplay');
  const numberEl = document.getElementById('countingNumber');
  if (!displayEl || !numberEl) return;
  const fruit = fruits[(countVal - 1) % fruits.length];
  displayEl.textContent = fruit.repeat(countVal);
  numberEl.textContent = countVal;
};
window.changeCount(0);

// ── Shapes ─────────────────────────────────────────────────
const shapesData = [
  { name: 'مربع', svg: '<rect x="10" y="10" width="40" height="40" fill="#ff4f9a" rx="2"/>' },
  { name: 'دائرة', svg: '<circle cx="30" cy="30" r="22" fill="#8f4fff"/>' },
  { name: 'مثلث', svg: '<polygon points="30,5 55,55 5,55" fill="#18c7d9"/>' },
  { name: 'مستطيل', svg: '<rect x="5" y="15" width="50" height="30" fill="#ff7b3e" rx="4"/>' },
  { name: 'نجمة', svg: '<polygon points="30,3 36,21 55,21 40,33 46,51 30,40 14,51 20,33 5,21 24,21" fill="#f1c40f"/>' },
  { name: 'قلب', svg: '<path d="M30 50 C10 35 5 20 15 12 C20 8 27 10 30 15 C33 10 40 8 45 12 C55 20 50 35 30 50Z" fill="#e91e63"/>' },
];

const shapesGrid = document.getElementById('shapesGrid');
if (shapesGrid) {
  shapesData.forEach(s => {
    const item = document.createElement('div');
    item.className = 'shape-item';
    item.innerHTML = `<svg class="shape-svg" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">${s.svg}</svg><p>${s.name}</p>`;
    shapesGrid.appendChild(item);
  });
}

// ── Sliders ────────────────────────────────────────────────
let certsOffset = 0;
let testiOffset = 0;

window.slideCerts = function(dir) {
  const slider = document.getElementById('certsSlider');
  if (!slider) return;
  const cards = slider.querySelectorAll('.cert-card');
  const maxOffset = cards.length - (window.innerWidth > 900 ? 4 : 2);
  certsOffset = Math.max(0, Math.min(maxOffset, certsOffset + dir));
  const cardW = cards[0].offsetWidth + 24;
  slider.style.transform = `translateX(${certsOffset * cardW}px)`;
  slider.style.transition = 'transform 0.4s ease';
};

window.slideTesti = function(dir) {
  const slider = document.getElementById('testiSlider');
  if (!slider) return;
  const cards = slider.querySelectorAll('.testi-card');
  const perView = window.innerWidth > 900 ? 3 : window.innerWidth > 620 ? 2 : 1;
  const maxOffset = cards.length - perView;
  testiOffset = Math.max(0, Math.min(maxOffset, testiOffset + dir));
  const cardW = cards[0].offsetWidth + 24;
  slider.style.transform = `translateX(${testiOffset * cardW}px)`;
  slider.style.transition = 'transform 0.4s ease';
};

// Auto-slide testimonials
setInterval(() => window.slideTesti(1), 5000);

// ── Registration Form ──────────────────────────────────────
const regForm = document.getElementById('regForm');
if (regForm) {
  regForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const studentName = document.getElementById('studentName').value.trim();
    const parentName = document.getElementById('parentName').value.trim();
    const grade = document.getElementById('grade').value;
    const phone = document.getElementById('phone').value.trim();
    const subject = document.getElementById('subject').value;
    const source = document.getElementById('source').value;
    const notes = document.getElementById('notes').value.trim();

    if (!studentName || !parentName || !grade || !phone || !subject) {
      highlightEmpty();
      showNotification('⚠️ الرجاء تعبئة جميع الحقول المطلوبة', 'warning');
      return;
    }

    const msg = encodeURIComponent(
      `السلام عليكم 🌸\nأرغب في التسجيل لدى ميس جهاد السمنودي\n\n` +
      `👦 اسم الطالب: ${studentName}\n` +
      `🎓 المرحلة: ${grade}\n` +
      `📚 المادة: ${subject}\n` +
      `👩 ولي الأمر: ${parentName}\n` +
      `📱 الهاتف: ${phone}\n` +
      `📣 وصلت عبر: ${source || 'غير محدد'}\n` +
      (notes ? `💬 ملاحظات: ${notes}\n` : '') +
      `\nشكراً جزيلاً 🌺`
    );

    window.open(`https://wa.me/201068028580?text=${msg}`, '_blank');
    showNotification('✅ تم إرسال طلبك بنجاح عبر واتساب!', 'success');
    regForm.reset();
  });
}

function highlightEmpty() {
  ['studentName','parentName','grade','phone','subject'].forEach(id => {
    const el = document.getElementById(id);
    if (el && !el.value.trim()) {
      el.style.borderColor = '#dc3545';
      el.addEventListener('input', () => el.style.borderColor = '', { once: true });
    }
  });
}

function showNotification(msg, type) {
  const n = document.createElement('div');
  n.style.cssText = `
    position:fixed;top:24px;right:24px;z-index:9999;
    background:${type === 'success' ? '#28a745' : '#ff9800'};
    color:#fff;padding:16px 24px;border-radius:14px;
    font-family:Cairo,sans-serif;font-weight:700;font-size:0.95rem;
    box-shadow:0 8px 30px rgba(0,0,0,0.2);
    animation:slideInNotif 0.4s ease;
    max-width:90vw;
  `;
  n.textContent = msg;
  document.head.insertAdjacentHTML('beforeend', `<style>@keyframes slideInNotif{from{transform:translateX(120%);opacity:0}to{transform:none;opacity:1}}</style>`);
  document.body.appendChild(n);
  setTimeout(() => n.remove(), 4000);
}

// ── Smooth Scroll for anchors ──────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// ── Lazy load images ───────────────────────────────────────
if ('loading' in HTMLImageElement.prototype) {
  document.querySelectorAll('img').forEach(img => img.loading = 'lazy');
}
