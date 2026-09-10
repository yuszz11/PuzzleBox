// ==========================================
// KONFIGURASI BACKEND GOOGLE APPS SCRIPT
// ==========================================
// Ganti dengan URL Web App Google Apps Script Anda (yang berakhiran /exec)
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbx1r0Zs7Z-RGxcEV6PPRn8nQySLNbErogHuQPvw3IKDri3KNUuGvLf-xYamZMTQEqw2sA/exec";

// ==========================================
// STATE & VARIABEL GAME
// ==========================================
let currentLevel = 1;
let score = 0;
let correctAnswer = 0;
let playerName = "";
let playerPassword = "";

// ==========================================
// LOGIKA GAME & SOAL
// ==========================================

// Membuat soal acak (+ , - , *) berdasarkan level
function generateQuestion() {
  const maxRange = Math.ceil(currentLevel / 4) * 8;
  const operators = ['+', '-', '*'];
  let op = operators[Math.floor(Math.random() * (currentLevel > 5 ? 3 : 2))];
  
  let num1 = Math.floor(Math.random() * maxRange) + 1;
  let num2 = Math.floor(Math.random() * maxRange) + 1;

  if (op === '-') {
    if (num1 < num2) [num1, num2] = [num2, num1];
    correctAnswer = num1 - num2;
  } else if (op === '*') {
    num1 = Math.floor(Math.random() * 10) + 1;
    num2 = Math.floor(Math.random() * (5 + Math.floor(currentLevel / 2))) + 1;
    correctAnswer = num1 * num2;
  } else {
    correctAnswer = num1 + num2;
  }

  document.getElementById("question").innerText = `${num1} ${op} ${num2} = ?`;
}

// Memulai permainan
function startGame() {
  playerName = document.getElementById("player-name").value.trim();
  playerPassword = document.getElementById("player-password").value.trim();

  if (!playerName || !playerPassword) {
    alert("Isi Nama dan Password terlebih dahulu!");
    return;
  }

  document.getElementById("start-screen").classList.add("hidden");
  document.getElementById("game-screen").classList.remove("hidden");
  currentLevel = 1;
  score = 0;
  document.getElementById("score").innerText = score;
  document.getElementById("level-num").innerText = currentLevel;
  
  generateQuestion();
  document.getElementById("answer").focus();
}

// Menyerahkan/Mengecek jawaban user
function submitAnswer() {
  const answerInput = document.getElementById("answer");
  const userAnswer = parseInt(answerInput.value);

  if (!isNaN(userAnswer) && userAnswer === correctAnswer) {
    score += 10;
    document.getElementById("score").innerText = score;
  }

  answerInput.value = "";
  currentLevel++;

  if (currentLevel > 20) {
    document.getElementById("game-screen").classList.add("hidden");
    document.getElementById("end-screen").classList.remove("hidden");
    document.getElementById("final-score").innerText = score;
  } else {
    document.getElementById("level-num").innerText = currentLevel;
    generateQuestion();
    answerInput.focus();
  }
}

// Event menekan tombol Enter pada keyboard
function checkEnter(event) {
  if (event.key === "Enter") {
    submitAnswer();
  }
}

// ==========================================
// INTEGRASI DATABASE (GOOGLE SHEETS)
// ==========================================

// Menyimpan skor ke Google Sheets
async function saveScore() {
  const saveBtn = document.getElementById("save-btn");
  saveBtn.innerText = "Menyimpan...";
  saveBtn.disabled = true;

  const payload = {
    nama: playerName,
    password: playerPassword,
    skor: score,
    waktu: new Date().toISOString()
  };

  try {
    // Trik panggil Google Apps Script via text/plain agar menghindari isu CORS preflight
    const response = await fetch(GOOGLE_SHEET_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (result.status === "error") {
      alert(result.message);
      saveBtn.innerText = "Coba Lagi";
      saveBtn.disabled = false;
    } else {
      alert("Skor berhasil tersimpan di Google Sheets!");
      location.reload();
    }
  } catch (error) {
    console.error("Error saving score:", error);
    alert("Terjadi kesalahan koneksi saat menyimpan skor.");
    saveBtn.innerText = "Coba Lagi";
    saveBtn.disabled = false;
  }
}

// Mengambil data Top 10 Leaderboard dari Google Sheets
async function loadLeaderboard() {
  const tbody = document.getElementById("leaderboard-body");
  
  try {
    const res = await fetch(GOOGLE_SHEET_URL);
    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="3">Belum ada skor tercatat.</td></tr>`;
      return;
    }

    tbody.innerHTML = data.map((item, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${item[1]}</td>
        <td><strong>${item[2]}</strong></td>
      </tr>
    `).join("");
  } catch (error) {
    console.error("Error loading leaderboard:", error);
    tbody.innerHTML = `<tr><td colspan="3">Gagal memuat data leaderboard.</td></tr>`;
  }
}

// Memuat data leaderboard secara otomatis saat halaman pertama kali dibuka
document.addEventListener("DOMContentLoaded", () => {
  loadLeaderboard();
});
