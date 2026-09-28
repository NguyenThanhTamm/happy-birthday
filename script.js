/* ==========================================================================
   MINIMALIST META / FACEBOOK BIRTHDAY INVITATION - JAVASCRIPT LOGIC
   Host: Nguyễn Thanh Tâm (06/10/2003)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --------------------------------------------------------------------------
  // 1. STATE & URL CONFIGURATION
  // --------------------------------------------------------------------------
  const urlParams = new URLSearchParams(window.location.search);

  const state = {
    hostName: "Nguyễn Thanh Tâm",
    guestName: urlParams.get('guest') || localStorage.getItem('bg_guest') || "Anh Em & Bạn Bè",
    locationName: "Ốc Đêm Chú Kiệt 5 Garden",
    locationAddress: "120 Man Thiện, Phường Tăng Nhơn Phú, Thành phố Thủ Đức, TP. Hồ Chí Minh",
    partyDate: "2026-10-03T19:30:00", // October 3rd 2026 at 19:30
    isMusicPlaying: false,
    candlesRemaining: 5
  };

  // --------------------------------------------------------------------------
  // 2. DOM ELEMENTS
  // --------------------------------------------------------------------------
  const bgCanvas = document.getElementById('bg-canvas');
  const btnMusic = document.getElementById('btn-music');
  
  const sceneIntro = document.getElementById('scene-intro');
  const sceneCard = document.getElementById('scene-card');
  const giftBoxTrigger = document.getElementById('gift-box-trigger');

  const introGuestName = document.getElementById('intro-guest-name');
  const cardGuestName = document.getElementById('card-guest-name');

  const rsvpForm = document.getElementById('rsvp-form');
  const rsvpGuestNameInput = document.getElementById('rsvp-guest-name');
  const rsvpCountSelect = document.getElementById('rsvp-count');
  const rsvpMessageInput = document.getElementById('rsvp-message');
  const rsvpWallGrid = document.getElementById('rsvp-wall-grid');
  const rsvpCounter = document.getElementById('rsvp-counter');

  const btnBlowCandles = document.getElementById('btn-blow-candles');
  const btnRelightCandles = document.getElementById('btn-relight-candles');
  const wishRevealedBanner = document.getElementById('wish-revealed-banner');

  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  // --------------------------------------------------------------------------
  // 3. INITIALIZATION & UI SYNC
  // --------------------------------------------------------------------------
  function init() {
    syncStateToUI();
    initCanvasParticles();
    initCountdownTimer();
    initRSVPWall();
    initPolaroidListeners();
  }

  function syncStateToUI() {
    introGuestName.textContent = state.guestName;
    cardGuestName.textContent = state.guestName;
    rsvpGuestNameInput.value = (state.guestName === "Anh Em & Bạn Bè" || state.guestName === "Bạn Thân Yêu") ? "" : state.guestName;
  }

  // --------------------------------------------------------------------------
  // 4. MP3 AUDIO BACKGROUND MUSIC PLAYER (Happy Birthday Remix Hương Ly)
  // --------------------------------------------------------------------------
  const bgAudio = new Audio('assets/music.mp3');
  bgAudio.loop = true;

  function playMusic() {
    bgAudio.play().then(() => {
      state.isMusicPlaying = true;
      btnMusic.classList.add('playing');
    }).catch(err => {
      console.log("Audio play error (user gesture required):", err);
    });
  }

  function stopMusic() {
    bgAudio.pause();
    state.isMusicPlaying = false;
    btnMusic.classList.remove('playing');
  }

  btnMusic.addEventListener('click', () => {
    if (state.isMusicPlaying) {
      stopMusic();
    } else {
      playMusic();
    }
  });

  // --------------------------------------------------------------------------
  // 5. CANVAS SUBTLE PARTICLES
  // --------------------------------------------------------------------------
  function initCanvasParticles() {
    const ctx = bgCanvas.getContext('2d');
    let width = bgCanvas.width = window.innerWidth;
    let height = bgCanvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = bgCanvas.width = window.innerWidth;
      height = bgCanvas.height = window.innerHeight;
    });

    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 0.5,
      alpha: Math.random(),
      speed: Math.random() * 0.01 + 0.003,
      vy: -(Math.random() * 0.25 + 0.1)
    }));

    function render() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.alpha += p.speed;
        if (p.alpha > 1 || p.alpha < 0) p.speed = -p.speed;
        
        p.y += p.vy;
        if (p.y < 0) p.y = height;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(8, 102, 255, ${Math.abs(p.alpha) * 0.35})`;
        ctx.fill();
      });

      requestAnimationFrame(render);
    }

    render();
  }

  // --------------------------------------------------------------------------
  // 6. COUNTDOWN TIMER TO PARTY DATE (19:30 - 03/10)
  // --------------------------------------------------------------------------
  function initCountdownTimer() {
    function updateTimer() {
      const targetDate = new Date(state.partyDate).getTime();
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff <= 0) {
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      document.getElementById('days').textContent = String(days).padStart(2, '0');
      document.getElementById('hours').textContent = String(hours).padStart(2, '0');
      document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
      document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }

    updateTimer();
    setInterval(updateTimer, 1000);
  }

  // --------------------------------------------------------------------------
  // 7. OPEN ENVELOPE REVEAL
  // --------------------------------------------------------------------------
  giftBoxTrigger.addEventListener('click', () => {
    fireConfettiBurst();

    if (!state.isMusicPlaying) {
      playMusic();
    }

    sceneIntro.style.opacity = '0';
    sceneIntro.style.transform = 'scale(0.95)';

    setTimeout(() => {
      sceneIntro.classList.add('hidden');
      sceneCard.classList.remove('hidden');
      sceneCard.style.opacity = '0';
      sceneCard.style.transform = 'translateY(15px)';

      requestAnimationFrame(() => {
        sceneCard.style.transition = 'all 0.6s ease';
        sceneCard.style.opacity = '1';
        sceneCard.style.transform = 'translateY(0)';
      });
    }, 500);
  });

  function fireConfettiBurst() {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0866ff', '#00c6ff', '#ffffff', '#e4e6eb']
      });
    }
  }

  // --------------------------------------------------------------------------
  // 8. RSVP FORM HANDLING & PERSISTENCE
  // --------------------------------------------------------------------------
  function initRSVPWall() {
    const defaultRSVPs = [
      { name: "Hoàng Nam", count: 1, status: "yes", msg: "Chúc Tâm tuổi 23 luôn rực rỡ! Sẽ có mặt đúng 19:30 tại Ốc Đêm Chú Kiệt nha bro 🥳" },
      { name: "Minh Tuấn", count: 2, status: "yes", msg: "Happy Birthday Tâm! Hẹn gặp lại tối 03/10 cụng ly cùng anh em ✨" }
    ];

    const savedRSVPs = JSON.parse(localStorage.getItem('bg_rsvp_wall')) || defaultRSVPs;
    renderRSVPs(savedRSVPs);
  }

  function renderRSVPs(rsvps) {
    rsvpWallGrid.innerHTML = '';
    let totalConfirmedGuests = 0;

    rsvps.slice().reverse().forEach(item => {
      if (item.status === 'yes') {
        totalConfirmedGuests += parseInt(item.count || 1);
      }

      const card = document.createElement('div');
      card.className = 'rsvp-item-card';

      let statusBadgeText = "Sẽ tham dự 🥳";
      let statusClass = "yes";
      if (item.status === 'maybe') { statusBadgeText = "Có thể đến trễ ⏰"; statusClass = "maybe"; }
      if (item.status === 'no') { statusBadgeText = "Bận việc 🥹"; statusClass = "no"; }

      card.innerHTML = `
        <div class="rsvp-item-header">
          <span class="rsvp-item-name"><i class="fa-solid fa-user-check"></i> ${escapeHTML(item.name)} (${item.count || 1} người)</span>
          <span class="rsvp-item-tag ${statusClass}">${statusBadgeText}</span>
        </div>
        ${item.msg ? `<div class="rsvp-item-msg">"${escapeHTML(item.msg)}"</div>` : ''}
      `;
      rsvpWallGrid.appendChild(card);
    });

    rsvpCounter.textContent = totalConfirmedGuests;
  }

  rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = rsvpGuestNameInput.value.trim();
    const count = parseInt(rsvpCountSelect.value);
    const status = document.querySelector('input[name="rsvp-status"]:checked').value;
    const msg = rsvpMessageInput.value.trim();

    if (!name) return;

    const savedRSVPs = JSON.parse(localStorage.getItem('bg_rsvp_wall')) || [];
    savedRSVPs.push({ name, count, status, msg });
    localStorage.setItem('bg_rsvp_wall', JSON.stringify(savedRSVPs));

    renderRSVPs(savedRSVPs);
    rsvpMessageInput.value = '';
    fireConfettiBurst();

    alert(`Cảm ơn ${name} đã gửi phản hồi tham dự tiệc sinh nhật Nguyễn Thanh Tâm! ✨`);
  });

  // --------------------------------------------------------------------------
  // 9. CANDLE BLOWING
  // --------------------------------------------------------------------------
  document.querySelectorAll('.candle-flame').forEach(flame => {
    flame.addEventListener('click', (e) => {
      e.stopPropagation();
      extinguishCandle(flame);
    });
  });

  btnBlowCandles.addEventListener('click', () => {
    const activeFlames = document.querySelectorAll('.candle-flame.active');
    activeFlames.forEach((flame, idx) => {
      setTimeout(() => extinguishCandle(flame), idx * 150);
    });
  });

  btnRelightCandles.addEventListener('click', () => {
    document.querySelectorAll('.candle-flame').forEach(flame => {
      flame.classList.remove('extinguished');
      flame.classList.add('active');
    });
    state.candlesRemaining = 5;
    wishRevealedBanner.classList.add('hidden');
    btnRelightCandles.classList.add('hidden');
    btnBlowCandles.classList.remove('hidden');
  });

  function extinguishCandle(flame) {
    if (!flame.classList.contains('extinguished')) {
      flame.classList.remove('active');
      flame.classList.add('extinguished');
      state.candlesRemaining--;

      if (state.candlesRemaining <= 0) {
        wishRevealedBanner.classList.remove('hidden');
        btnBlowCandles.classList.add('hidden');
        btnRelightCandles.classList.remove('hidden');
        fireConfettiBurst();
      }
    }
  }

  // --------------------------------------------------------------------------
  // 10. POLAROID LIGHTBOX
  // --------------------------------------------------------------------------
  function initPolaroidListeners() {
    document.querySelectorAll('.polaroid-card').forEach(card => {
      card.addEventListener('click', () => {
        lightboxImg.src = card.dataset.img;
        lightboxCaption.textContent = card.dataset.caption;
        lightboxModal.classList.remove('hidden');
      });
    });
  }

  lightboxClose.addEventListener('click', () => {
    lightboxModal.classList.add('hidden');
  });

  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
      lightboxModal.classList.add('hidden');
    }
  });

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  // Start app!
  init();
});
