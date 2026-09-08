let currentLevel = 1;
let score = 0;
let correctAnswer = 0;
let playerName = "";
let playerPassword = "";

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

function checkEnter(event) {
  if (event.key === "Enter") {
    submitAnswer();
  }
}

async function saveScore() {
  const saveBtn = document.getElementById("save-btn");
  saveBtn.innerText = "Menyimpan...";
  saveBtn.disabled = true;

  try {
    const response = await fetch("/api/leaderboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nama: playerName,
        password: playerPassword,
        skor: score,
        waktu: new Date().toISOString()
      })
    });

    const result = await response.json();

    if (result.status === "error") {
      alert(result.message);
      saveBtn.innerText = "Coba Lagi";
      saveBtn.disabled = false;
    } else if (response.ok) {
      alert("Skor berhasil tersimpan!");
      location.reload();
    } else {
      alert("Gagal menyimpan skor.");
      saveBtn.innerText = "Coba Lagi";
      saveBtn.disabled = false;
    }
  } catch (error) {
    console.error(error);
    alert("Terjadi kesalahan koneksi server.");
    saveBtn.innerText = "Coba Lagi";
    saveBtn.disabled = false;
  }
}

async function loadLeaderboard() {
  try {
    const res = await fetch("/api/leaderboard");
    const data = await res.json();
    const tbody = document.getElementById("leaderboard-body");

    if (!data || data.length === 0) {
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
    console.error(error);
    document.getElementById("leaderboard-body").innerHTML = 
      `<tr><td colspan="3">Gagal memuat leaderboard.</td></tr>`;
  }
}

loadLeaderboard();
