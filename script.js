// ============================================================
// SCRIPT.JS – ETNOSATEK (NAVIGASI + CHATBOT FIX TOTAL)
// ============================================================

// ============================================================
// 1. HAMBURGER NAVIGATION
// ============================================================
const hamburgerBtn = document.getElementById('hamburgerBtn');
const navDropdown = document.getElementById('navDropdown');

if (hamburgerBtn && navDropdown) {
    hamburgerBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        navDropdown.classList.toggle('open');
    });

    document.addEventListener('click', function(e) {
        if (!hamburgerBtn.contains(e.target) && !navDropdown.contains(e.target)) {
            navDropdown.classList.remove('open');
        }
    });
}

// ============================================================
// 2. NAVIGASI MENU
// ============================================================
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

document.addEventListener('DOMContentLoaded', function() {
    homeWrapper.style.display = 'flex';
    halamanLain.forEach(function(page) {
        page.classList.remove('active');
    });
});

// ============================================================
// 3. CHATBOT – KNOWLEDGE BASE (DUMMY + JSON FALLBACK)
// ============================================================

// ---- 3a. Knowledge base awal (DUMMY) ----
let knowledgeBase = [
    // =============================================
    // TOPIK PRASASTI
    // =============================================
    {
        keywords: ['prasasti', 'kedukan bukit', 'sriwijaya', 'batu tua', 'peninggalan'],
        replies: [
            "Prasasti Kedukan Bukit adalah prasasti peninggalan Kerajaan Sriwijaya dari tahun 682 M, ditemukan di Palembang.",
            "Isi prasasti menceritakan perjalanan Dapunta Hyang Sri Jayanasa beserta pasukannya.",
            "Prasasti ini membuktikan nenek moyang kita sudah melek huruf dan matematika sejak abad ke-7."
        ]
    },
    // =============================================
    // TOPIK ANGKA NOL
    // =============================================
    {
        keywords: ['nol', '0', 'angka nol', 'lingkaran kecil'],
        replies: [
            "Angka nol dalam prasasti berbentuk lingkaran kecil berongga, mirip angka 0 modern.",
            "Konsep nol sudah dikenal di Nusantara sejak abad ke-7, jauh sebelum Eropa mengenalnya.",
            "Tanpa angka nol, angka 604 tidak bisa dibedakan dengan 64."
        ]
    },
    // =============================================
    // TOPIK NILAI TEMPAT
    // =============================================
    {
        keywords: ['nilai tempat', 'desimal', 'ratusan', 'puluhan', 'satuan'],
        replies: [
            "Sistem desimal dan nilai tempat sudah dipakai di prasasti, contoh angka 604.",
            "Nilai tempat memungkinkan kita menulis angka besar dengan simbol yang sedikit."
        ]
    },
    // =============================================
    // TOPIK ETNOSATEK
    // =============================================
    {
        keywords: ['etnosatek', 'game', 'permainan'],
        replies: [
            "ETNOSATEK adalah game edukasi yang menggabungkan sejarah, matematika (sistem biner), GPS, dan literasi digital.",
            "Kamu bisa bermain di https://etnosatek-nazwa.vercel.app"
        ]
    },
    // =============================================
    // TOPIK LITERASI DIGITAL
    // =============================================
    {
        keywords: ['literasi digital', 'hoaks', 'phishing', 'cyberbullying'],
        replies: [
            "Literasi digital adalah kemampuan menggunakan teknologi dengan bijak. Hindari hoaks, phishing, dan cyberbullying.",
            "Selalu cek kebenaran informasi sebelum membagikannya."
        ]
    },
    // =============================================
    // TOPIK GPS & NAVIGASI
    // =============================================
    {
        keywords: ['gps', 'navigasi', 'bintang'],
        replies: [
            "GPS menggunakan satelit untuk menentukan lokasi. Nenek moyang kita menggunakan navigasi bintang.",
            "Di ETNOSATEK, kamu belajar menggabungkan teknologi modern dengan kearifan lokal."
        ]
    },
    // =============================================
    // TOPIK HI / HALO / SALAM
    // =============================================
    {
        keywords: ['hi', 'hai', 'halo', 'hello', 'assalamualaikum', 'salam'],
        replies: [
            "Halo, Kapten! Siap berlayar di lautan ilmu?",
            "Hai! Selamat datang di dek kapal Etnosatek. Mau belajar apa hari ini?",
            "Wa'alaikumsalam, Kapten! Silakan bertanya seputar ETNOSATEK."
        ]
    },
    // =============================================
    // TOPIK GURU / PEMBIMBING
    // =============================================
    {
        keywords: ['guru', 'pembimbing', 'bu okta', 'okta', 'mama umar20'],
        replies: [
            "Guru pembimbing ETNOSATEK adalah Bu Okta, guru TIK SMP Muhammadiyah 17 Tangsel. Instagram: @mama.umar20",
            "Bu Okta adalah guru TIK dan pembimbing Nazwa dalam membuat ETNOSATEK. Follow @mama.umar20 ya!",
            "ETNOSATEK dibimbing oleh Bu Okta, guru TIK yang sangat suportif."
        ]
    },
    // =============================================
    // TOPIK NAZWA / PEMBUAT
    // =============================================
    {
        keywords: ['nazwa', 'nazwa ananda', 'ananda devina', 'pembuat', 'pencipta', 'kreator'],
        replies: [
            "Nazwa Ananda Devina adalah siswi SMP Muhammadiyah 17 Tangsel, pencipta ETNOSATEK. Instagram: @ananda_dev2",
            "Nazwa adalah kapten utama ETNOSATEK. Inovator muda yang luar biasa! Follow @ananda_dev2",
            "Nazwa Ananda Devina, sang pencipta ETNOSATEK. Beliau juga aktif di TMS dan organisasi sekolah."
        ]
    }
];

// ---- 3b. Coba muat knowledge.json jika ada (GABUNG, BUKAN OVERWRITE) ----
fetch('knowledge.json')
    .then(function(res) {
        if (res.ok) return res.json();
        else throw new Error('File tidak ditemukan');
    })
    .then(function(data) {
        if (Array.isArray(data) && data.length > 0) {
            // ❌ JANGAN OVERWRITE!
            // knowledgeBase = data;
            
            // ✅ GABUNGKAN data JSON dengan knowledgeBase yang sudah ada
            knowledgeBase = knowledgeBase.concat(data);
            console.log('✅ Knowledge base dari JSON berhasil digabung! Total: ' + knowledgeBase.length + ' item');
        }
    })
    .catch(function(err) {
        console.warn('ℹ️ Gagal memuat knowledge.json, pakai data bawaan.');
    });

// ============================================================
// 3c. FUNGSI PENCARI JAWABAN (DENGAN LOGGING)
// ============================================================
function getEtnosatekReply(message) {
    var q = message.toLowerCase().trim();
    console.log('🔍 Mencari jawaban untuk: "' + q + '"');
    console.log('📚 Total knowledge base: ' + knowledgeBase.length + ' item');

    var bestMatch = null;
    var matchedKeyword = null;

    for (var i = 0; i < knowledgeBase.length; i++) {
        var item = knowledgeBase[i];
        var keywords = item.keywords || [];
        var replies = item.replies || item.answers || [];

        for (var j = 0; j < keywords.length; j++) {
            var keyword = keywords[j].toLowerCase();
            if (q.indexOf(keyword) !== -1) {
                bestMatch = replies;
                matchedKeyword = keyword;
                console.log('✅ Match ditemukan: "' + keyword + '" di item ke-' + i);
                break;
            }
        }
        if (bestMatch) break;
    }

    if (bestMatch && bestMatch.length > 0) {
        var rand = Math.floor(Math.random() * bestMatch.length);
        var reply = bestMatch[rand];
        console.log('📤 Jawaban: "' + reply.substring(0, 50) + '..."');
        return reply;
    }

    console.log('❌ Tidak ada match, pakai fallback.');
    return "Saya spesialis ETNOSATEK, Kapten! Silakan tanya seputar: 'Prasasti Kedukan Bukit', 'Angka Nol', 'Nilai Tempat', 'ETNOSATEK', 'Literasi Digital', atau 'GPS'.";
}

// ============================================================
// 3d. FUNGSI TOGGLE CHAT (GLOBAL)
// ============================================================
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

// ============================================================
// 3e. FUNGSI KIRIM PESAN (GLOBAL)
// ============================================================
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

// ============================================================
// 3f. EVENT LISTENER UNTUK TOMBOL KIRIM
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    var sendBtn = document.getElementById('ai-chat-send');
    if (sendBtn) {
        sendBtn.addEventListener('click', window.sendChatGemini);
    }
    console.log('✅ Chatbot ETNOSATEK siap!');
});
