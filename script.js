/* =====================================================
   PUZZLE BOX 2D - THREE.JS
   ===================================================== */


/* =====================================================
   GOOGLE SHEETS CONFIG
   ===================================================== */

const GOOGLE_SCRIPT_URL =
    "https://docs.google.com/spreadsheets/d/1-1hyQO3Q1LQhf9Uii2gLh9NgQ9rYs47pg-_C3BWgvr0/edit?usp=drivesdk";


/* =====================================================
   GAME VARIABLES
   ===================================================== */

let playerName = "";

let playerPassword = "";

let currentLevel = 1;

let score = 0;

let currentAnswer = 0;

let questions = [];

const MAX_LEVEL = 20;


/* =====================================================
   THREE.JS
   ===================================================== */

let scene;
let camera;
let renderer;

let particles = [];


function initThreeJS() {

    const container =
        document.getElementById("game-container");


    scene = new THREE.Scene();


    camera = new THREE.OrthographicCamera(
        window.innerWidth / -2,
        window.innerWidth / 2,
        window.innerHeight / 2,
        window.innerHeight / -2,
        1,
        1000
    );

    camera.position.z = 10;


    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });


    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );


    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );


    container.appendChild(renderer.domElement);


    createParticles();


    animate();
}


/* =====================================================
   CREATE BACKGROUND PARTICLES
   ===================================================== */

function createParticles() {

    const geometry =
        new THREE.CircleGeometry(3, 16);


    for (let i = 0; i < 60; i++) {

        const material =
            new THREE.MeshBasicMaterial({
                color: 0x38bdf8,
                transparent: true,
                opacity: 0.15
            });


        const particle =
            new THREE.Mesh(
                geometry,
                material
            );


        particle.position.x =
            Math.random() * window.innerWidth
            - window.innerWidth / 2;

        particle.position.y =
            Math.random() * window.innerHeight
            - window.innerHeight / 2;

        particle.position.z =
            Math.random() * -20;


        particle.userData.speed =
            0.2 + Math.random() * 0.8;


        particles.push(particle);

        scene.add(particle);
    }
}


/* =====================================================
   ANIMATION
   ===================================================== */

function animate() {

    requestAnimationFrame(animate);


    particles.forEach(particle => {

        particle.position.y +=
            particle.userData.speed;


        particle.rotation.z += 0.005;


        if (
            particle.position.y >
            window.innerHeight / 2
        ) {

            particle.position.y =
                -window.innerHeight / 2;

        }

    });


    renderer.render(
        scene,
        camera
    );
}


/* =====================================================
   RESPONSIVE THREE.JS
   ===================================================== */

window.addEventListener(
    "resize",
    () => {

        if (!renderer) return;


        camera.left =
            window.innerWidth / -2;

        camera.right =
            window.innerWidth / 2;

        camera.top =
            window.innerHeight / 2;

        camera.bottom =
            window.innerHeight / -2;


        camera.updateProjectionMatrix();


        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

    }
);


/* =====================================================
   RANDOM QUESTION
   ===================================================== */

function generateQuestion(level) {

    const type =
        Math.floor(Math.random() * 4);


    let a;
    let b;
    let answer;
    let question;


    /*
       Level semakin tinggi,
       soal semakin sulit.
    */

    const maxNumber =
        5 + level * 5;


    if (type === 0) {

        // PENJUMLAHAN

        a =
            Math.floor(
                Math.random() * maxNumber
            ) + 1;

        b =
            Math.floor(
                Math.random() * maxNumber
            ) + 1;

        answer = a + b;

        question =
            `${a} + ${b} = ?`;

    }


    else if (type === 1) {

        // PENGURANGAN

        a =
            Math.floor(
                Math.random() * maxNumber
            ) + 10;

        b =
            Math.floor(
                Math.random() * a
            ) + 1;

        answer = a - b;

        question =
            `${a} - ${b} = ?`;

    }


    else if (type === 2) {

        // PERKALIAN

        a =
            Math.floor(
                Math.random() * Math.min(level + 5, 15)
            ) + 1;

        b =
            Math.floor(
                Math.random() * Math.min(level + 5, 15)
            ) + 1;

        answer = a * b;

        question =
            `${a} × ${b} = ?`;

    }


    else {

        // PEMBAGIAN

        b =
            Math.floor(
                Math.random() * Math.min(level + 4, 10)
            ) + 1;

        answer =
            Math.floor(
                Math.random() * Math.min(level + 5, 10)
            ) + 1;

        a = b * answer;

        question =
            `${a} ÷ ${b} = ?`;

    }


    currentAnswer = answer;

    document.getElementById(
        "question"
    ).textContent = question;

}


/* =====================================================
   START GAME
   ===================================================== */

function startGame() {

    playerName =
        document.getElementById(
            "player-name"
        ).value.trim();


    playerPassword =
        document.getElementById(
            "player-password"
        ).value.trim();


    const message =
        document.getElementById(
            "login-message"
        );


    if (!playerName) {

        message.textContent =
            "⚠️ Nama akun wajib diisi.";

        return;
    }


    if (!playerPassword) {

        message.textContent =
            "⚠️ Password / PIN wajib diisi.";

        return;
    }


    if (playerName.length < 3) {

        message.textContent =
            "⚠️ Nama minimal 3 karakter.";

        return;
    }


    currentLevel = 1;

    score = 0;


    document.getElementById(
        "score"
    ).textContent = score;


    document.getElementById(
        "level-num"
    ).textContent = currentLevel;


    document.getElementById(
        "start-screen"
    ).classList.add("hidden");


    document.getElementById(
        "end-screen"
    ).classList.add("hidden");


    document.getElementById(
        "game-screen"
    ).classList.remove("hidden");


    document.getElementById(
        "feedback"
    ).textContent = "";


    generateQuestion(
        currentLevel
    );


    document.getElementById(
        "answer"
    ).value = "";


    document.getElementById(
        "answer"
    ).focus();

}


/* =====================================================
   SUBMIT ANSWER
   ===================================================== */

function submitAnswer() {

    const answerInput =
        document.getElementById(
            "answer"
        );


    const userAnswer =
        answerInput.value.trim();


    const feedback =
        document.getElementById(
            "feedback"
        );


    if (userAnswer === "") {

        feedback.textContent =
            "⚠️ Masukkan jawaban terlebih dahulu.";

        return;
    }


    const numericAnswer =
        Number(userAnswer);


    if (
        numericAnswer ===
        currentAnswer
    ) {

        /*
           Skor:
           100 poin setiap jawaban benar
           + bonus sesuai level
        */

        const levelScore =
            100 + (currentLevel * 10);


        score += levelScore;


        feedback.textContent =
            `✅ Benar! +${levelScore} poin`;

    }

    else {

        feedback.textContent =
            `❌ Salah! Jawaban yang benar adalah ${currentAnswer}`;

    }


    document.getElementById(
        "score"
    ).textContent = score;


    setTimeout(
        nextLevel,
        1000
    );

}


/* =====================================================
   NEXT LEVEL
   ===================================================== */

function nextLevel() {

    if (
        currentLevel >=
        MAX_LEVEL
    ) {

        finishGame();

        return;
    }


    currentLevel++;


    document.getElementById(
        "level-num"
    ).textContent =
        currentLevel;


    document.getElementById(
        "answer"
    ).value = "";


    document.getElementById(
        "feedback"
    ).textContent = "";


    generateQuestion(
        currentLevel
    );


    document.getElementById(
        "answer"
    ).focus();

}


/* =====================================================
   ENTER KEY
   ===================================================== */

function checkEnter(event) {

    if (
        event.key === "Enter"
    ) {

        submitAnswer();

    }

}


/* =====================================================
   FINISH GAME
   ===================================================== */

function finishGame() {

    document.getElementById(
        "game-screen"
    ).classList.add("hidden");


    document.getElementById(
        "end-screen"
    ).classList.remove("hidden");


    document.getElementById(
        "final-score"
    ).textContent =
        score;

}


/* =====================================================
   RESTART
   ===================================================== */

function restartGame() {

    document.getElementById(
        "end-screen"
    ).classList.add("hidden");


    document.getElementById(
        "start-screen"
    ).classList.remove("hidden");


    document.getElementById(
        "save-message"
    ).textContent = "";

}


/* =====================================================
   SAVE SCORE TO GOOGLE SHEETS
   ===================================================== */

async function saveScore() {

    const saveButton =
        document.getElementById(
            "save-btn"
        );


    const message =
        document.getElementById(
            "save-message"
        );


    if (
        GOOGLE_SCRIPT_URL.includes(
            "MASUKKAN_URL"
        )
    ) {

        message.textContent =
            "⚠️ URL Google Apps Script belum dimasukkan.";

        return;
    }


    saveButton.disabled = true;

    saveButton.textContent =
        "⏳ Menyimpan...";


    try {

        const response =
            await fetch(
                GOOGLE_SCRIPT_URL,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "text/plain;charset=utf-8"
                    },

                    body: JSON.stringify({

                        name: playerName,

                        score: score,

                        level: MAX_LEVEL

                    })

                }
            );


        const result =
            await response.json();


        if (
            result.success
        ) {

            message.textContent =
                "✅ Skor berhasil disimpan!";


            await loadLeaderboard();

            saveButton.textContent =
                "✅ Skor Tersimpan";

        }

        else {

            throw new Error(
                result.message ||
                "Gagal menyimpan skor"
            );

        }

    }

    catch (error) {

        console.error(error);


        message.textContent =
            "❌ Gagal menyimpan skor. Periksa koneksi atau URL Apps Script.";


        saveButton.disabled = false;

        saveButton.textContent =
            "🏆 Simpan ke Leaderboard";

    }

}


/* =====================================================
   LOAD LEADERBOARD
   ===================================================== */

async function loadLeaderboard() {

    const body =
        document.getElementById(
            "leaderboard-body"
        );


    body.innerHTML = `
        <tr>
            <td colspan="3">
                ⏳ Memuat...
            </td>
        </tr>
    `;


    if (
        GOOGLE_SCRIPT_URL.includes(
            "MASUKKAN_URL"
        )
    ) {

        body.innerHTML = `
            <tr>
                <td colspan="3">
                    URL Google Apps Script belum diatur.
                </td>
            </tr>
        `;

        return;
    }


    try {

        const response =
            await fetch(
                GOOGLE_SCRIPT_URL
            );


        const data =
            await response.json();


        body.innerHTML = "";


        if (
            !data.success ||
            !data.data ||
            data.data.length === 0
        ) {

            body.innerHTML = `
                <tr>
                    <td colspan="3">
                        Belum ada skor.
                    </td>
                </tr>
            `;

            return;
        }


        const top10 =
            data.data
                .sort(
                    (a, b) =>
                        Number(b.score) -
                        Number(a.score)
                )
                .slice(0, 10);


        top10.forEach(
            (player, index) => {

                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${escapeHTML(player.name)}</td>
                    <td>${Number(player.score)}</td>
                `;


                body.appendChild(row);

            }
        );

    }

    catch (error) {

        console.error(error);


        body.innerHTML = `
            <tr>
                <td colspan="3">
                    ❌ Gagal memuat leaderboard.
                </td>
            </tr>
        `;

    }

}


/* =====================================================
   SECURITY
   ===================================================== */

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        text;

    return div.innerHTML;

}


/* =====================================================
   INITIALIZE
   ===================================================== */

window.addEventListener(
    "DOMContentLoaded",
    () => {

        initThreeJS();

        loadLeaderboard();

    }
);
