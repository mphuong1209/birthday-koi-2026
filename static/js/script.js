// ================== ĐẾM THỜI GIAN YÊU NHAU ==================
function updateLoveCounter() {
  const now = Date.now();
  let diff = now - LOVE_START_TS;
  if (diff < 0) diff = 0;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  const daysElem = document.getElementById("days");
  const hoursElem = document.getElementById("hours");
  const minutesElem = document.getElementById("minutes");
  const secondsElem = document.getElementById("seconds");

  if (daysElem) daysElem.textContent = days;
  if (hoursElem) hoursElem.textContent = hours;
  if (minutesElem) minutesElem.textContent = minutes;
  if (secondsElem) secondsElem.textContent = seconds;
}

// ================== ĐẾM NGƯỢC SINH NHẬT (10/09/2026) ==================
function updateBirthdayCounter() {
  const now = Date.now();
  let diff = NEXT_BDAY_TS - now;

  if (diff <= 0) {
    const bdayCounter = document.getElementById("bdayCounter");
    if (bdayCounter) bdayCounter.innerHTML = "<div class='bday-arrived'>🎂 HÔM NAY LÀ SINH NHẬT ANH GẤU! 🎉🐻</div>";
    launchConfetti();
    setTimeout(launchConfetti, 600);
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  const bdays = document.getElementById("bdays");
  const bhours = document.getElementById("bhours");
  const bminutes = document.getElementById("bminutes");
  const bseconds = document.getElementById("bseconds");

  if (bdays) bdays.textContent = days;
  if (bhours) bhours.textContent = hours;
  if (bminutes) bminutes.textContent = minutes;
  if (bseconds) bseconds.textContent = seconds;
}

setInterval(() => {
  updateLoveCounter();
  updateBirthdayCounter();
}, 1000);
updateLoveCounter();
updateBirthdayCounter();

// ================== SLIDER SCREEN LOGIC ==================
const screens = ["screen-intro", "screen-1", "screen-2"];
let currentScreenIndex = 0;
const prevBtn = document.getElementById("sliderPrevBtn");
const nextBtn = document.getElementById("sliderNextBtn");
let hasBlownCandle = false;
let typewriterTriggered = false;

function showScreen(index) {
  if (index < 0 || index >= screens.length) return;
  
  // Ẩn tất cả
  screens.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove("active");
  });
  
  // Hiện màn chỉ định
  const activeScreen = document.getElementById(screens[index]);
  if (activeScreen) {
    activeScreen.classList.add("active");
    // Scroll về top của screen nếu content quá dài
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  currentScreenIndex = index;
  
  // Cập nhật mũi tên
  if (prevBtn) {
    if (index === 0) prevBtn.classList.add("hidden");
    else prevBtn.classList.remove("hidden");
  }
  
  if (nextBtn) {
    if (index === screens.length - 1 || (index === 0 && !hasBlownCandle)) {
      nextBtn.classList.add("hidden");
    } else {
      nextBtn.classList.remove("hidden");
    }
  }
  
  // Typewriter sẽ được kích hoạt khi mở hộp quà Lời Chúc
}

if (prevBtn) {
  prevBtn.addEventListener("click", () => showScreen(currentScreenIndex - 1));
}
if (nextBtn) {
  nextBtn.addEventListener("click", () => showScreen(currentScreenIndex + 1));
}

// Khởi tạo slider
showScreen(0);

// ================== THỔI NẾN → MỞ FORM ƯỚC NGUYỆN ==================
const blowCandleBtn = document.getElementById("blowCandleBtn");
const wishForm = document.getElementById("wishForm");

if (blowCandleBtn) {
  blowCandleBtn.addEventListener("click", () => {
    const flame1 = document.getElementById("candleFlame1");
    const flame2 = document.getElementById("candleFlame2");
    const flame3 = document.getElementById("candleFlame3");
    
    if (flame1) flame1.classList.add("off");
    if (flame2) flame2.classList.add("off");
    if (flame3) flame3.classList.add("off");
    
    blowCandleBtn.style.display = "none";
    if (wishForm) {
      wishForm.classList.remove("hidden");
    }
    
    // Kích hoạt các hiệu ứng đặc biệt
    launchConfetti();
    setTimeout(launchConfetti, 500);
    spawnBurstBalloons();
    
    hasBlownCandle = true;
    // Hiện mũi tên sang màn tiếp theo
    if (nextBtn && currentScreenIndex === 0) {
      nextBtn.classList.remove("hidden");
    }
    
    setTimeout(() => {
      if (wishForm) wishForm.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 200);
  });
}

// Nút gửi ước nguyện (lưu localStorage)
const sendWishBtn = document.getElementById("sendWishBtn");
const wishInput = document.getElementById("wishInput");
const wishDisplay = document.getElementById("wishDisplay");

if (sendWishBtn && wishInput) {
  // Khôi phục ước nguyện cũ từ localStorage khi tải trang
  const savedWish = localStorage.getItem("bearWish_dudukoi");
  if (savedWish && wishDisplay) {
    wishDisplay.innerHTML = "🐻 Ước nguyện của anh gấu: <em>\"" + savedWish + "\"</em> ✨";
    wishDisplay.classList.remove("hidden");
    if (wishForm) wishForm.classList.remove("hidden");
  }

  sendWishBtn.addEventListener("click", () => {
    const wishText = wishInput.value.trim();
    if (!wishText) {
      wishInput.focus();
      wishInput.style.outline = "3px solid #ff4757";
      setTimeout(() => wishInput.style.outline = "", 1500);
      return;
    }
    localStorage.setItem("bearWish_dudukoi", wishText);
    if (wishDisplay) {
      wishDisplay.innerHTML = "🐻 Ước nguyện của anh gấu: <em>\"" + wishText + "\"</em> ✨";
      wishDisplay.classList.remove("hidden");
    }
    wishInput.value = "";
    sendWishBtn.textContent = "✅ Đã gửi! Minnie đọc được rồi nè 💖";
    sendWishBtn.style.background = "linear-gradient(135deg, #2ed573, #26af5f)";
    setTimeout(() => {
      sendWishBtn.textContent = "💌 Gửi ước nguyện đến Bé Minnie ✨";
      sendWishBtn.style.background = "";
    }, 3000);
    launchMiniConfetti();
  });
}

// ================== HỘP QUÀ BÍ MẬT (LỜI CHÚC & THƠ) ==================
const wishBtn = document.getElementById("wish-btn");
const poemBtn = document.getElementById("poem-btn");
const modalWish = document.getElementById("modalWish");
const modalPoem = document.getElementById("modalPoem");
const closeWishBtn = document.getElementById("closeWishBtn");
const closePoemBtn = document.getElementById("closePoemBtn");

if (wishBtn && modalWish) {
  wishBtn.addEventListener("click", () => {
    const box = document.getElementById("giftBoxWish");
    if (box) box.classList.add("open");
    
    setTimeout(() => {
      modalWish.classList.remove("hidden"); // Remove hidden if present
      modalWish.classList.add("show");
      
      // Kích hoạt Typewriter nếu chưa chạy
      if (!typewriterTriggered && typeof window.triggerTypewriter === "function") {
        typewriterTriggered = true;
        setTimeout(window.triggerTypewriter, 300);
      }
    }, 600);
  });
}

if (poemBtn && modalPoem) {
  poemBtn.addEventListener("click", () => {
    const box = document.getElementById("giftBoxPoem");
    if (box) box.classList.add("open");
    
    setTimeout(() => {
      modalPoem.classList.remove("hidden");
      modalPoem.classList.add("show");
    }, 600);
  });
}

// Đóng Modal
if (closeWishBtn) {
  closeWishBtn.addEventListener("click", () => {
    modalWish.classList.remove("show");
    const box = document.getElementById("giftBoxWish");
    if (box) box.classList.remove("open");
  });
}

if (closePoemBtn) {
  closePoemBtn.addEventListener("click", () => {
    modalPoem.classList.remove("show");
    const box = document.getElementById("giftBoxPoem");
    if (box) box.classList.remove("open");
  });
}


// ================== GLOBAL TOGGLES (THEME & MUSIC) ==================
const themeToggle = document.getElementById("themeToggle");
const musicToggleBtn = document.getElementById("musicToggleBtn");
const countdownAudioEl = document.getElementById("countdown-audio");
const bubuAudioEl = document.getElementById("bubu-audio");

let isMusicPlaying = true;

// Removed themeToggle logic

if (musicToggleBtn) {
  musicToggleBtn.addEventListener("click", () => {
    if (isMusicPlaying) {
      if (countdownAudioEl) countdownAudioEl.pause();
      if (bubuAudioEl) bubuAudioEl.pause();
      isMusicPlaying = false;
      musicToggleBtn.textContent = "🔇";
    } else {
      if (bubuAudioEl) {
        bubuAudioEl.currentTime = 0;
        bubuAudioEl.play().catch(e => console.log(e));
      }
      isMusicPlaying = true;
      musicToggleBtn.textContent = "🎵";
    }
  });
}

const typewriterMessage = document.getElementById("typewriterMessage");

// ================== HIỆU ỨNG TYPEWRITER TỰ ĐỘNG BẰNG OBSERVER ==================
if (typewriterMessage) {
  const text = typewriterMessage.getAttribute("data-text");
  
  // Tạo 2 thẻ div để chứa tiêu đề và lời chúc riêng biệt
  typewriterMessage.innerHTML = `<div style="display: flex; justify-content: center; align-items: center; gap: 10px; margin-bottom: 8px;"><div id="tw-title" style="text-align: center; font-weight: 800; font-size: 1.8rem; color: #ff4757; font-family: 'Baloo 2', cursive;"></div><img src="/static/images/dudu-face.png" alt="Dudu" style="width: 50px; height: auto; animation: dudoBounceGift 1.2s ease-in-out infinite alternate;"></div><div id="tw-body" style="text-align: justify; white-space: pre-wrap;"></div>`;
  
  const parts = text.split(/\n\s*\n/);
  const titleStr = (parts[0] || "").trim();
  const bodyStr = (parts.slice(1).join("\n\n") || "").trim();
  
  const twTitle = document.getElementById("tw-title");
  const twBody = document.getElementById("tw-body");
  
  let i = 0;
  let isTypingTitle = true;
  let isTyped = false;
  
  function typeWriter() {
    if (isTypingTitle) {
      if (i < titleStr.length) {
        twTitle.textContent += titleStr.charAt(i);
        i++;
        setTimeout(typeWriter, 40);
      } else {
        isTypingTitle = false;
        i = 0;
        setTimeout(typeWriter, 300);
      }
    } else {
      if (i < bodyStr.length) {
        twBody.textContent += bodyStr.charAt(i);
        i++;
        setTimeout(typeWriter, 35);
      }
    }
  }

  // Đóng gói hàm Typewriter thành hàm toàn cục để gọi từ Slider
  window.triggerTypewriter = function() {
    typeWriter();
  };
}




// Đã gỡ bỏ giftMusicPlayBtn vì dư thừa



// ================== BÓNG BAY GẤU NÂU HERO ==================
const bubuDuduImages = [
  "719942690460194314.gif", "719942690460194318.gif", "719942690460194352.png", 
  "719942690460194354.png", "719942690460194359.png", "719942690460201009.png", 
  "719942690460201015.png", "719942690460236956.png", "719942690460236959.png", 
  "719942690460236960.png", "719942690460236962.png", "719942690460236963.png", 
  "719942690460431555.png", "719942690460431591.gif", "719942690460431605_1.png"
];

function spawnFloatingBalloon() {
  const container = document.getElementById("floatingBalloons");
  if (!container) return;
  const balloon = document.createElement("div");
  balloon.className = "floating-balloon";
  
  const randomImage = bubuDuduImages[Math.floor(Math.random() * bubuDuduImages.length)];
  balloon.innerHTML = `<img src="/static/images/bubu-dudu/${randomImage}" style="width:100%; height:auto;" onerror="this.style.display='none'">`;
  
  balloon.style.left = Math.random() * 95 + "%";
  balloon.style.animationDuration = (5 + Math.random() * 5) + "s";
  // Tăng size vì img render nhỏ hơn emoji
  const size = 30 + Math.random() * 40; 
  balloon.style.width = size + "px";
  
  container.appendChild(balloon);
  setTimeout(() => balloon.remove(), 10000);
}
setInterval(spawnFloatingBalloon, 500);

function spawnBurstBalloons() {
  const container = document.getElementById("floatingBalloons");
  if (!container) return;
  for (let i = 0; i < 35; i++) {
    setTimeout(() => {
      const b = document.createElement("div");
      b.className = "floating-balloon";
      
      const randomImage = bubuDuduImages[Math.floor(Math.random() * bubuDuduImages.length)];
      b.innerHTML = `<img src="/static/images/bubu-dudu/${randomImage}" style="width:100%; height:auto;" onerror="this.style.display='none'">`;
      
      b.style.left = (5 + Math.random() * 90) + "%";
      b.style.animationDuration = (2.5 + Math.random() * 3) + "s";
      const size = 40 + Math.random() * 50; 
      b.style.width = size + "px";
      
      container.appendChild(b);
      setTimeout(() => b.remove(), 5500);
    }, i * 80);
  }
}

// ================== SCROLL ANIMATION: TIMELINE & GALLERY ==================
const animateOnScroll = document.querySelectorAll(".timeline-item, .gallery-item");
const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.12 });
animateOnScroll.forEach(item => scrollObserver.observe(item));

// ================== CONFETTI ==================
function launchConfetti() {
  if (typeof confetti === "function") {
    var duration = 3000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10001 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    var interval = setInterval(function() {
      var timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      var particleCount = 50 * (timeLeft / duration);
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
  }
}

function launchMiniConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  if (!canvas) return;
  const colors = ["#ff4757", "#ffa502", "#70a1ff", "#ff6b81", "#2ed573"];
  for (let i = 0; i < 40; i++) {
    const piece = document.createElement("div");
    piece.style.position = "absolute";
    piece.style.width = "7px";
    piece.style.height = "12px";
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.left = "50vw";
    piece.style.top = "50vh";
    piece.style.opacity = "1";
    piece.style.borderRadius = "2px";
    piece.style.transition = "transform 1.3s cubic-bezier(0.1, 0.8, 0.3, 1), opacity 1.3s";
    canvas.appendChild(piece);
    const angle = Math.random() * Math.PI * 2;
    const distance = 130 + Math.random() * 200;
    requestAnimationFrame(() => {
      piece.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) rotate(${Math.random() * 720}deg)`;
      piece.style.opacity = "0";
    });
    setTimeout(() => piece.remove(), 1400);
  }
}

// ================== PRE-INTRO COUNTDOWN ==================
document.addEventListener("DOMContentLoaded", () => {
  const preIntro = document.getElementById("pre-intro");
  const preCountdown = document.getElementById("pre-countdown");
  const preContent = document.getElementById("pre-content");
  const startOverlay = document.getElementById("start-overlay");
  const startBtn = document.getElementById("start-btn");
  const countdownAudio = document.getElementById("countdown-audio");
  const bubuAudio = document.getElementById("bubu-audio");
  
  if (bubuAudio) {
    bubuAudio.addEventListener("ended", () => {
      setTimeout(() => {
        if (isMusicPlaying) bubuAudio.play().catch(e => console.log("Bubu audio play failed:", e));
      }, 1500);
    });
  }

  if (countdownAudio && bubuAudio) {
    countdownAudio.addEventListener("ended", () => {
      if (isMusicPlaying) bubuAudio.play().catch(e => console.log("Bubu audio play failed:", e));
    });
  }

  if (preIntro && preCountdown && preContent && startOverlay && startBtn) {
    document.body.style.overflow = "hidden";
    
    startBtn.addEventListener("click", () => {
      const giftBox = document.getElementById("giftBox");
      if (giftBox) giftBox.classList.add("open");
      
      setTimeout(() => {
        startBtn.classList.add("fade-out");
      }, 500);
      
      setTimeout(() => {
        startOverlay.style.opacity = '0';
        setTimeout(() => startOverlay.remove(), 500);
        
        if (countdownAudio && isMusicPlaying) {
          countdownAudio.play().catch(e => console.log("Audio play failed:", e));
        
        // --- BỘ CĂN CHỈNH ĐỒNG BỘ NHẠC & SỐ ---
        // 1. Nhạc dạo mất bao nhiêu giây trước khi tiếng "10" vang lên? 
        // (Ví dụ: nếu vào phát đọc "10" luôn thì để 0. Nếu 1 giây rưỡi sau mới đọc thì để 1.5)
        const AUDIO_START_TIME = 0.5; 
        
        // 2. Khoảng cách giữa 2 con số (thường là 1 giây)
        const SECONDS_PER_NUMBER = 1.0;
        
        countdownAudio.addEventListener('timeupdate', () => {
          const t = countdownAudio.currentTime;
          
          if (t >= AUDIO_START_TIME) {
            let currentNumber = 10 - Math.floor((t - AUDIO_START_TIME) / SECONDS_PER_NUMBER);
            
            if (currentNumber > 0 && currentNumber <= 10) {
              if (preCountdown.textContent != currentNumber) {
                preCountdown.textContent = currentNumber;
                
                // Set pastel color based on the number sequence
                const numColors = [
                  "", // 0
                  "#bae1ff", // 1 - xanh dương
                  "#baffc9", // 2 - xanh lá
                  "#ffffba", // 3 - vàng
                  "#ff7675", // 4 - đỏ pastel
                  "#bae1ff", // 5 - xanh dương
                  "#baffc9", // 6 - xanh lá
                  "#ffffba", // 7 - vàng
                  "#ff7675", // 8 - đỏ pastel
                  "#bae1ff", // 9 - xanh dương
                  "#baffc9"  // 10 - xanh lá
                ];
                preCountdown.style.setProperty('--num-color', numColors[currentNumber] || "#baffc9");
                
                preCountdown.style.animation = 'none';
                preCountdown.offsetHeight; 
                preCountdown.style.animation = null; 
              }
            } else if (currentNumber <= 0 && !preCountdown.classList.contains("hidden")) {
              preCountdown.classList.add("hidden");
              preContent.classList.remove("hidden");
              
              launchConfetti();
        
        // Launch infinite vibrant balloons, avoiding the center
        for(let i=0; i<35; i++) {
          setTimeout(() => {
            const container = document.getElementById("pre-intro");
            if (!container) return;
            const balloon = document.createElement("div");
            balloon.className = "pre-intro-balloon";
            balloon.style.zIndex = "10000"; 
            
            // Random pastel HSL colors
            const hue = Math.floor(Math.random() * 360);
            const color = [
              `hsl(${hue}, 80%, 90%)`, // Highlight
              `hsl(${hue}, 70%, 80%)`, // Base (Pastel)
              `hsl(${hue}, 60%, 65%)`  // Shadow
            ];
            const isPolka = Math.random() > 0.6; // 40% chance of dots
            
            const balloonSVG = `
              <svg width="100%" height="100%" viewBox="0 0 60 150" xmlns="http://www.w3.org/2000/svg">
                <path d="M 30 75 Q 15 100 35 125 T 30 150" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="2"/>
                <polygon points="26,70 34,70 30,76" fill="${color[1]}"/>
                <ellipse cx="30" cy="40" rx="26" ry="32" fill="url(#ballGrad${i})"/>
                ${isPolka ? `<ellipse cx="30" cy="40" rx="26" ry="32" fill="url(#polka${i})"/>` : ''}
                <ellipse cx="18" cy="25" rx="6" ry="12" fill="rgba(255,255,255,0.4)" transform="rotate(-30 18 25)"/>
                <defs>
                  <radialGradient id="ballGrad${i}" cx="35%" cy="30%" r="70%">
                    <stop offset="0%" stop-color="${color[0]}"/>
                    <stop offset="50%" stop-color="${color[1]}"/>
                    <stop offset="100%" stop-color="${color[2]}"/>
                  </radialGradient>
                  ${isPolka ? `
                  <pattern id="polka${i}" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(20)">
                    <circle cx="6" cy="6" r="2.5" fill="rgba(255,255,255,0.5)" />
                  </pattern>
                  ` : ''}
                </defs>
              </svg>
            `;
            balloon.innerHTML = balloonSVG;
            
            // Tránh khu vực giữa màn hình (từ 30% đến 70%) để không che chữ và avatar
            let leftPos = Math.random() * 100;
            if (leftPos > 30 && leftPos < 70) {
              leftPos = leftPos > 50 ? leftPos + 35 : leftPos - 35; 
            }
            leftPos = Math.max(2, Math.min(92, leftPos)); // Keep within screen bounds
            
            balloon.style.left = leftPos + "%";
            balloon.style.animationDuration = (4 + Math.random() * 4) + "s";
            const size = 60 + Math.random() * 45; 
            balloon.style.width = size + "px";
            balloon.style.height = (size * 2.5) + "px";
            
            container.appendChild(balloon);
            setTimeout(() => balloon.remove(), 8000);
          }, i * 150);
        }
        
        setTimeout(() => {
          preIntro.style.opacity = '0';
          preIntro.style.visibility = 'hidden';
          document.body.style.overflow = "auto"; 
          setTimeout(() => preIntro.remove(), 1000);
          
          const floatingControls = document.getElementById("floatingControls");
          if (floatingControls) {
            floatingControls.classList.remove("hidden");
          }
        }, 5000);
            }
          }
        });
      }
      }, 1000);
    });
  }
});

// ================== 3D FLIPBOOK ALBUM LOGIC ==================
document.addEventListener("DOMContentLoaded", () => {
  if (typeof albumData === 'undefined') return;
  const flipbook    = document.getElementById("flipbook");
  const fbPages     = document.getElementById("flipbookPages");
  const btnClose    = document.getElementById("btnCloseAlbum");
  const btnPrev     = document.getElementById("btnFlipPrev");
  const btnNext     = document.getElementById("btnFlipNext");
  if (!flipbook || !fbPages) return;

  // ===== Config =====
  const PER_SIDE   = 4;
  const NUM_LEAVES = 12;
  const TOTAL      = NUM_LEAVES * 2 * PER_SIDE;

  // ===== Fill up albumData =====
  const seeds = ['aa','bb','cc','dd','ee','ff','gg','hh','ii','jj'];
  while (albumData.length < TOTAL) {
    const s = seeds[albumData.length % seeds.length];
    albumData.push({ image: `https://picsum.photos/seed/${s}${albumData.length}/300/300`, title: '', desc: '' });
  }

  // ===== Render 2×2 grid of photos for one side =====
  const renderSide = (items, leaf, side) => {
    let g = '<div class="fb-photo-grid">';
    items.forEach((item, i) => {
      const s = `lf${leaf}_${side}_${i}`;
      if (!item) { g += '<div class="fb-photo-cell empty"></div>'; return; }
      g += `<div class="fb-photo-cell">
        <div class="fb-photo-img-wrap">
          <img src="${item.image}" loading="lazy" onerror="this.onerror=null;this.src='https://picsum.photos/seed/${s}/300/300'">
        </div>
        ${item.title ? `<div class="fb-photo-caption">${item.title}</div>` : ''}
      </div>`;
    });
    g += '</div>';
    return g;
  };

  // ===== Build HTML =====
  let html = '';

  // Cover
  html += `<div class="fb-page fb-page-cover" style="z-index:200;" data-index="0">
    <div class="fb-front fb-cover-inner">
      <div class="fb-cover-spine"></div>
      <div class="fb-cover-content">
        <img src="/static/images/dudu-face.png" class="cover-icon" alt="Dudu" onerror="this.style.display='none'">
        <h2>Album Kỷ Niệm</h2>
        <p class="cover-subtitle">Dudu &amp; Bé 💖</p>
        <div class="cover-open-hint">✦ Nhấn để mở ✦</div>
      </div>
    </div>
    <div class="fb-back fb-cover-back-inner"></div>
  </div>`;

  // Inner leaves
  for (let leaf = 0; leaf < NUM_LEAVES; leaf++) {
    const z          = 199 - leaf;
    const fi         = leaf * 2 * PER_SIDE;
    const bi         = fi + PER_SIDE;
    const frontItems = albumData.slice(fi, fi + PER_SIDE);
    const backItems  = albumData.slice(bi, bi + PER_SIDE);

    html += `<div class="fb-page" style="z-index:${z};" data-index="${leaf + 1}">
      <div class="fb-front">${renderSide(frontItems, leaf, 'f')}</div>
      <div class="fb-back">${renderSide(backItems, leaf, 'b')}</div>
    </div>`;
  }

  // Back Cover
  html += `<div class="fb-page fb-page-cover" style="z-index:1;" data-index="${NUM_LEAVES + 1}">
    <div class="fb-front"></div>
    <div class="fb-back fb-back-cover-inner">
      <div class="fb-cover-content">
        <p style="font-size:2rem;">💖</p>
        <p>Đến đây thôi nhé~</p>
        <p style="font-size:0.85rem;opacity:0.7;">Cảm ơn vì tất cả những kỷ niệm ❤️</p>
      </div>
    </div>
  </div>`;

  fbPages.innerHTML = html;

  // ===== Flip logic =====
  const pages = fbPages.querySelectorAll('.fb-page');
  let cur = 0; // index into pages[]

  const show = el => { if (el) { el.style.display = ''; el.style.opacity = '1'; } };
  const hide = el => { if (el) { el.style.display = 'none'; } };

  const syncUI = () => {
    if (cur === 0) {
      hide(btnClose); hide(btnPrev); hide(btnNext);
      flipbook.classList.remove('open');
    } else {
      show(btnClose);
      cur <= 1   ? hide(btnPrev) : show(btnPrev);
      cur >= pages.length - 1 ? hide(btnNext) : show(btnNext);
    }
  };

  const flipNext = () => {
    if (cur >= pages.length - 1) return;
    if (cur === 0) flipbook.classList.add('open');
    pages[cur].classList.add('flipped');
    cur++;
    syncUI();
  };

  const flipPrev = () => {
    if (cur <= 0) return;
    cur--;
    pages[cur].classList.remove('flipped');
    if (cur === 0) flipbook.classList.remove('open');
    syncUI();
  };

  // Click on COVER to open
  pages[0].addEventListener('click', () => { if (cur === 0) flipNext(); });

  // Click RIGHT half of the open book → next page
  // Click LEFT half → prev page
  flipbook.addEventListener('click', e => {
    if (cur === 0) return; // cover handles its own click
    const rect = flipbook.getBoundingClientRect();
    const midX = rect.left + rect.width / 2;
    if (e.clientX > midX) {
      flipNext();
    } else {
      flipPrev();
    }
  });

  // Button controls
  if (btnNext) btnNext.addEventListener('click', e => { e.stopPropagation(); flipNext(); });
  if (btnPrev) btnPrev.addEventListener('click', e => { e.stopPropagation(); flipPrev(); });
  if (btnClose) {
    btnClose.addEventListener('click', e => {
      e.stopPropagation();
      pages.forEach(p => p.classList.remove('flipped'));
      cur = 0;
      flipbook.classList.remove('open');
      syncUI();
    });
  }

  syncUI();
});
