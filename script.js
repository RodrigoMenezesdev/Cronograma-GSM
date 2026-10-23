const scheduleData = {
  segunda: {
    title: "Segunda-feira",
    blocks: [
      { time: "2h 30m", title: "Língua Portuguesa", details: "Compreensão de textos, coesão, sintaxe, concordância, regência e crase." },
      { time: "2h 30m", title: "Noções de Direito (Constitucional)", details: "Princípios fundamentais, Direitos e Garantias Fundamentais e Administração Pública." }
    ]
  },
  terca: {
    title: "Terça-feira",
    blocks: [
      { time: "2h 30m", title: "Conhecimentos Específicos (GMSN)", details: "Lei Municipal nº 1.625/2026 (Estatuto da Guarda) e Estatuto dos Servidores (Lei nº 1.416/2022)." },
      { time: "2h 30m", title: "Legislação Extravagante", details: "Estatuto do Desarmamento, Lei Maria da Penha, Lei de Drogas e Abuso de Autoridade." }
    ]
  },
  quarta: {
    title: "Quarta-feira",
    blocks: [
      { time: "2h 30m", title: "Informática", details: "Sistemas operacionais (Windows/Linux), Word/LibreOffice Writer e Excel/Calc." },
      { time: "2h 30m", title: "Noções de Direito (Penal)", details: "Fato típico, ilicitude, culpabilidade, tentativa, concurso de crimes e crimes em geral." }
    ]
  },
  quinta: {
    title: "Quinta-feira",
    blocks: [
      { time: "2h 30m", title: "Língua Portuguesa", details: "Pontuação, colocação pronominal, reescrita de textos e correspondência oficial." },
      { time: "2h 30m", title: "Noções de Direito (Proc. Penal / Admin.)", details: "Inquérito policial, prisões, Atos Administrativos, Poder de Polícia e Improbidade." }
    ]
  },
  sexta: {
    title: "Sexta-feira",
    blocks: [
      { time: "2h 30m", title: "Conhecimentos Específicos (SUSP & Estatuto)", details: "Lei Federal nº 13.022/2014 (Estatuto das Guardas) e Lei nº 13.675/2018 (SUSP)." },
      { time: "2h 30m", title: "Legislação Extravagante (CTB)", details: "Código de Trânsito Brasileiro (CTB - Lei nº 9.503/1997) e Crimes Ambientais." }
    ]
  },
  sabado: {
    title: "Sábado",
    blocks: [
      { time: "2h 30m", title: "Informática (Avançado) & Redes", details: "Segurança da informação, redes de computadores, internet, intranet, backup e antivírus." },
      { time: "2h 30m", title: "Revisão Geral & Simulados", details: "Resolução de questões de provas anteriores focadas na banca SELECON e revisão de leis secas." }
    ]
  },
  domingo: {
    title: "Domingo",
    blocks: [
      { time: "Descanso", title: "Descanso / Reposição", details: "Dia livre para recuperar as energias ou colocar em dia matérias em atraso." }
    ]
  }
};

let activeDay = 'segunda';
let progress = JSON.parse(localStorage.getItem('pmsg_progress')) || {};

function init() {
  renderNav();
  renderSchedule();
  updateDashboard();
}

function renderNav() {
  const nav = document.getElementById('days-nav');
  nav.innerHTML = '';
  Object.keys(scheduleData).forEach(dayKey => {
    const btn = document.createElement('button');
    btn.className = `day-btn ${dayKey === activeDay ? 'active' : ''}`;
    btn.innerText = scheduleData[dayKey].title.split('-')[0];
    btn.onclick = () => {
      activeDay = dayKey;
      renderNav();
      renderSchedule();
    };
    nav.appendChild(btn);
  });
}

function renderSchedule() {
  const container = document.getElementById('schedule-container');
  const dayData = scheduleData[activeDay];

  let html = `<div class="schedule-card"><h2>${dayData.title}</h2>`;

  dayData.blocks.forEach((block, index) => {
    const blockId = `${activeDay}_${index}`;
    const isChecked = progress[blockId] ? 'checked' : '';
    const isCompletedClass = progress[blockId] ? 'completed' : '';

    html += `
      <div class="block ${isCompletedClass}">
        <div class="block-header">
          <input type="checkbox" id="${blockId}" ${isChecked} onchange="toggleBlock('${blockId}')">
          <span class="time-badge">${block.time}</span>
          <span class="block-title">${block.title}</span>
        </div>
        <div class="block-details">${block.details}</div>
      </div>
    `;
  });

  html += '</div>';
  container.innerHTML = html;
}

function toggleBlock(blockId) {
  progress[blockId] = !progress[blockId];
  localStorage.setItem('pmsg_progress', JSON.stringify(progress));
  renderSchedule();
  updateDashboard();
}

function resetAllProgress() {
  if (confirm("Tem certeza de que deseja zerar todo o progresso dos estudos?")) {
    progress = {};
    localStorage.removeItem('pmsg_progress');
    renderSchedule();
    updateDashboard();
  }
}

function updateDashboard() {
  let totalBlocks = 0;
  let completedBlocks = 0;

  Object.keys(scheduleData).forEach(dayKey => {
    if (dayKey !== 'domingo') {
      scheduleData[dayKey].blocks.forEach((_, index) => {
        totalBlocks++;
        if (progress[`${dayKey}_${index}`]) {
          completedBlocks++;
        }
      });
    }
  });

  const percent = totalBlocks > 0 ? Math.round((completedBlocks / totalBlocks) * 100) : 0;
  document.getElementById('progress-percent').innerText = `${percent}%`;
  document.getElementById('completed-count').innerText = `${completedBlocks} / ${totalBlocks}`;
}

/* Lógica do Timer Pomodoro */
let timerInterval = null;
let timeLeft = 25 * 60;

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  document.getElementById('timer').innerText = 
    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer() {
  if (timerInterval) return;
  timerInterval = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateTimerDisplay();
    } else {
      clearInterval(timerInterval);
      timerInterval = null;
      alert('Tempo concluído! Faça uma pausa ou avance para o próximo bloco.');
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function resetTimer() {
  pauseTimer();
  timeLeft = 25 * 60;
  updateTimerDisplay();
}

function setTimer(minutes) {
  pauseTimer();
  timeLeft = minutes * 60;
  updateTimerDisplay();
}

init();
