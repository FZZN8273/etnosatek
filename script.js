// ============================================================
// SCRIPT.JS – ETNOSATEK (Navigasi + Chatbot Fix Total)
// ============================================================

// ---- 1. HAMBURGER NAVIGATION ----
const hamburgerBtn = document.getElementById('hamburgerBtn');
const navDropdown = document.getElementById('navDropdown');

if (hamburgerBtn && navDropdown) {
    hamburgerBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        navDropdown.classList.toggle('open');
    });

    // Tutup dropdown jika klik di luar
    document.addEventListener('click', function(e) {
        if (!hamburgerBtn.contains(e.target) && !navDropdown.contains(e.target)) {
            navDropdown.classList.remove('open');
        }
    });
}

// ---- 2. NAVIGASI MENU ----
const menuButtons = document.querySelectorAll('.nav-dropdown button');
const homeWrapper = document.getElementById('home');
const halamanLain = document.querySelectorAll('.halaman');

menuButtons.forEach(function(btn) {
    btn.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        if (targetId === 'home') {
            homeWrapper.style.display = 'flex';
            halamanLain.forEach(function(page) {
                page.classList.remove('active');
            });
        } else {
            homeWrapper.style.display = 'none';
            halamanLain.forEach(function(page) {
                page.classList.remove('active');
            });
            const targetPage = document.getElementById(targetId);
            if (targetPage) targetPage.classList.add('active');
        }
        navDropdown.classList.remove('open');
    });
});

// Saat halaman dimuat, tampilkan home
document.addEventListener('DOMContentLoaded', function() {
    homeWrapper.style.display = 'flex';
    halamanLain.forEach(function(page) {
        page.classList.remove('active');
    });
});

// ============================================================
// 3. CHATBOT – FIX TOTAL (TANPA FETCH, PAKAI DUMMY + JSON FALLBACK)
// ============================================================

// ---- 3a. Knowledge base (dummy) ----
let knowledgeBase = [
    {
        keywords: ['prasasti', 'kedukan bukit', 'sriwijaya', 'batu tua', 'peninggalan'],
        replies: [
            "Prasasti Kedukan Bukit adalah prasasti peninggalan Kerajaan Sriwijaya dari tahun 682 M, ditemukan di Palembang.",
            "Isi prasasti menceritakan perjalanan Dapunta Hyang Sri Jayanasa beserta pasukannya.",
            "Prasasti ini membuktikan nenek moyang kita sudah melek huruf dan matematika sejak abad ke-7.",
            "Prasasti Kedukan Bukit ditemukan oleh H. Batenburg pada 1920 di tepi Sungai Tatang."
        ]
    },
    {
        keywords: ['nol', '0', 'angka nol', 'lingkaran kecil'],
        replies: [
            "Angka nol dalam prasasti berbentuk lingkaran kecil berongga, mirip angka 0 modern.",
            "Konsep nol sudah dikenal di Nusantara sejak abad ke-7, jauh sebelum Eropa mengenalnya.",
            "Tanpa angka nol, angka 604 tidak bisa dibedakan dengan 64."
        ]
    },
    {
        keywords: ['nilai tempat', 'desimal', 'ratusan', 'puluhan', 'satuan'],
        replies: [
            "Sistem desimal dan nilai tempat sudah dipakai di prasasti, contoh angka 604 yang terdiri dari 6 ratusan, 0 puluhan, dan 4 satuan.",
            "Nilai tempat memungkinkan kita menulis angka besar dengan simbol yang sedikit."
        ]
    },
    {
        keywords: ['etnosatek', 'game', 'permainan'],
        replies: [
            "ETNOSATEK adalah game edukasi yang menggabungkan sejarah, matematika (sistem biner), GPS, dan literasi digital.",
            "Kamu bisa bermain di https://etnosatek-nazwa.vercel.app"
        ]
    },
    {
        keywords: ['literasi digital', 'hoaks', 'phishing', 'cyberbullying'],
        replies: [
            "Literasi digital adalah kemampuan menggunakan teknologi dengan bijak. Hindari hoaks, phishing, dan cyberbullying.",
            "Selalu cek kebenaran informasi sebelum membagikannya."
        ]
    },
    {
        keywords: ['gps', 'navigasi', 'bintang'],
        replies: [
            "GPS (Global Positioning System) menggunakan satelit untuk menentukan lokasi. Nenek moyang kita menggunakan navigasi bintang.",
            "Di ETNOSATEK, kamu belajar menggabungkan teknologi modern dengan kearifan lokal."
        ]
    }
];

// ---- 3b. Coba muat knowledge.json jika ada ----
fetch('knowledge.json')
    .then(function(res) {
        if (res.ok) return res.json();
        else throw new Error('File tidak ditemukan');
    })
    .then(function(data) {
        if (Array.isArray(data) && data.length > 0) {
            knowledgeBase = data;
            console.log('✅ Knowledge base dari JSON berhasil dimuat!');
        }
    })
    .catch(function(err) {
        console.log('ℹ️ Menggunakan knowledge base bawaan (dummy).');
    });

// ---- 3c. Fungsi pencari jawaban ----
function getEtnosatekReply(message) {
    var q = message.toLowerCase();
    var bestMatch = null;

    for (var i = 0; i < knowledgeBase.length; i++) {
        var item = knowledgeBase[i];
        // Support dua format: {keywords:[], replies:[]} atau {keywords:[], answers:[]}
        var keywords = item.keywords || [];
        var replies = item.replies || item.answers || [];
        for (var j = 0; j < keywords.length; j++) {
            if (q.indexOf(keywords[j].toLowerCase()) !== -1) {
                bestMatch = replies;
                break;
            }
        }
        if (bestMatch) break;
    }

    if (bestMatch && bestMatch.length > 0) {
        var rand = Math.floor(Math.random() * bestMatch.length);
        return bestMatch[rand];
    }

    return "Saya spesialis ETNOSATEK, Kapten! Silakan tanya seputar: 'Prasasti Kedukan Bukit', 'Angka Nol', 'Nilai Tempat', 'ETNOSATEK', 'Literasi Digital', atau 'GPS'.";
}

// ---- 3d. Fungsi toggle chat (GLOBAL) ----
window.toggleChat = function() {
    console.log("🤖 Tombol diklik!");
    var win = document.getElementById('ai-chat-window');
    if (win) {
        if (win.style.display === 'none' || win.style.display === '') {
            win.style.display = 'flex';
        } else {
            win.style.display = 'none';
        }
    } else {
        alert("Error: elemen chat tidak ditemukan!");
    }
};

// ---- 3e. Fungsi kirim pesan (GLOBAL) ----
window.sendChatGemini = function() {
    var input = document.getElementById('ai-chat-input');
    var msg = input.value.trim();
    if (msg === '') return;

    var container = document.getElementById('ai-chat-messages');
    if (!container) return;

    // Tambah pesan user
    var userDiv = document.createElement('div');
    userDiv.className = 'msg-user';
    userDiv.style.cssText = 'align-self:flex-end; background:#4a6fa5; color:white; padding:10px 14px; border-radius:16px 16px 0 16px; max-width:85%; font-size:14px; line-height:1.5;';
    userDiv.textContent = msg;
    container.appendChild(userDiv);

    input.value = '';
    container.scrollTop = container.scrollHeight;

    // Loading
    var loadingDiv = document.createElement('div');
    loadingDiv.className = 'msg-bot';
    loadingDiv.style.cssText = 'align-self:flex-start; background:#eee; padding:10px 14px; border-radius:16px 16px 16px 0; max-width:85%; font-size:14px; color:#333; line-height:1.5;';
    loadingDiv.textContent = 'Sedang berpikir...';
    container.appendChild(loadingDiv);
    container.scrollTop = container.scrollHeight;

    // Simulasi delay + balas
    setTimeout(function() {
        container.removeChild(loadingDiv);
        var reply = getEtnosatekReply(msg);
        var botDiv = document.createElement('div');
        botDiv.className = 'msg-bot';
        botDiv.style.cssText = 'align-self:flex-start; background:#eee; padding:10px 14px; border-radius:16px 16px 16px 0; max-width:85%; font-size:14px; color:#333; line-height:1.5;';
        botDiv.textContent = reply;
        container.appendChild(botDiv);
        container.scrollTop = container.scrollHeight;
    }, 500);
};

// ---- 3f. Tambahkan event listener untuk tombol kirim (jika ada) ----
document.addEventListener('DOMContentLoaded', function() {
    var sendBtn = document.getElementById('ai-chat-send');
    if (sendBtn) {
        sendBtn.addEventListener('click', window.sendChatGemini);
    }
    // Input enter sudah di-handle via onkeypress di HTML
    console.log('✅ Chatbot ETNOSATEK siap!');
});
