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
  
  // Kích hoạt Typewriter nếu tới màn 1
  if (index === 1 && !typewriterTriggered && typeof window.triggerTypewriter === "function") {
    typewriterTriggered = true;
    setTimeout(window.triggerTypewriter, 500);
  }
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
const candleFlame = document.getElementById("candleFlame");
const wishForm = document.getElementById("wishForm");

if (blowCandleBtn && candleFlame) {
  blowCandleBtn.addEventListener("click", () => {
    candleFlame.classList.add("off");
    blowCandleBtn.style.display = "none";
    if (wishForm) {
      wishForm.classList.remove("hidden");
    }
    
    // Kích hoạt các hiệu ứng đặc biệt
    launchConfetti();
    setTimeout(launchConfetti, 500);
    spawnBurstBalloons();
    playAudio();
    
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

// ================== HỘP QUÀ BÍ MẬT ==================
const giftBtn = document.getElementById("giftBtn");
const giftRevealPanel = document.getElementById("giftRevealPanel");
const reasonBox = document.getElementById("reasonBox");
const randomReasonBtn = document.getElementById("randomReasonBtn");
const giftMusicPlayBtn = document.getElementById("giftMusicPlayBtn");
const bgMusicEl = document.getElementById("bgMusic");
const musicToggleBtn = document.getElementById("musicToggle");

let isMusicPlaying = false;

function playAudio() {
  if (bgMusicEl) {
    bgMusicEl.play().then(() => {
      isMusicPlaying = true;
      if (giftMusicPlayBtn) giftMusicPlayBtn.textContent = "⏸️ Tạm Dừng Nhạc 🎶";
      if (musicToggleBtn) musicToggleBtn.textContent = "⏸️";
    }).catch(() => {
      if (giftMusicPlayBtn) giftMusicPlayBtn.textContent = "⚠️ Chưa có file nhạc – chép happy_birthday.mp3 vào static/music/";
    });
  }
}

function pauseAudio() {
  if (bgMusicEl) {
    bgMusicEl.pause();
    isMusicPlaying = false;
    if (giftMusicPlayBtn) giftMusicPlayBtn.textContent = "▶️ Phát Nhạc Sinh Nhật 🎶";
    if (musicToggleBtn) musicToggleBtn.textContent = "🎵";
  }
}

const typewriterMessage = document.getElementById("typewriterMessage");

// ================== HIỆU ỨNG TYPEWRITER TỰ ĐỘNG BẰNG OBSERVER ==================
if (typewriterMessage) {
  const text = typewriterMessage.getAttribute("data-text");
  
  // Tạo 2 thẻ div để chứa tiêu đề và lời chúc riêng biệt
  typewriterMessage.innerHTML = `
    <div style="display: flex; justify-content: center; align-items: center; gap: 10px; margin-bottom: 8px;">
      <div id="tw-title" style="text-align: center; font-weight: 800; font-size: 1.8rem; color: #ff4757; font-family: 'Baloo 2', cursive;"></div>
      <img src="/static/images/dudu-face.png" alt="Dudu" style="width: 50px; height: auto; animation: dudoBounceGift 1.2s ease-in-out infinite alternate;">
    </div>
    <div id="tw-body" style="text-align: justify;"></div>
  `;
  
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


if (randomReasonBtn && reasonBox) {
  randomReasonBtn.addEventListener("click", () => {
    const r = REASONS[Math.floor(Math.random() * REASONS.length)];
    reasonBox.innerHTML = "💖 " + r;
    launchMiniConfetti();
  });
}

if (giftMusicPlayBtn) {
  giftMusicPlayBtn.addEventListener("click", () => {
    isMusicPlaying ? pauseAudio() : playAudio();
  });
}

if (musicToggleBtn) {
  musicToggleBtn.addEventListener("click", () => {
    isMusicPlaying ? pauseAudio() : playAudio();
  });
}

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
  const canvas = document.getElementById("confetti-canvas");
  if (!canvas) return;
  const colors = ["#ff4757", "#ffa502", "#2ed573", "#1e90ff", "#9b59b6", "#ff6b81", "#ffd32a"];
  for (let i = 0; i < 150; i++) {
    const piece = document.createElement("div");
    piece.style.position = "absolute";
    piece.style.width = (6 + Math.random() * 8) + "px";
    piece.style.height = (10 + Math.random() * 10) + "px";
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.left = Math.random() * 100 + "vw";
    piece.style.top = "-20px";
    piece.style.opacity = "0.95";
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    piece.style.borderRadius = "3px";
    piece.style.transition = `top ${2 + Math.random() * 2.5}s ease-out, transform ${2 + Math.random() * 2.5}s ease-out`;
    canvas.appendChild(piece);
    requestAnimationFrame(() => {
      piece.style.top = "110vh";
      piece.style.transform = `rotate(${Math.random() * 1080}deg)`;
    });
    setTimeout(() => piece.remove(), 5000);
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
