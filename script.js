// ============================================================
// SCRIPT.JS – ETNOSATEK (FIX TOTAL, PAKAI knowledge.js)
// ============================================================

// ---- 1. HAMBURGER NAVIGATION ----
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

document.addEventListener('DOMContentLoaded', function() {
    homeWrapper.style.display = 'flex';
    halamanLain.forEach(function(page) {
        page.classList.remove('active');
    });
});

// ============================================================
// 3. CHATBOT – MENGGUNAKAN window.knowledgeBase DARI knowledge.js
// ============================================================

// ---- 3a. Cek apakah knowledgeBase tersedia ----
if (typeof window.knowledgeBase !== 'undefined' && window.knowledgeBase.length > 0) {
    console.log('✅ Knowledge base siap! Total topik: ' + window.knowledgeBase.length);
} else {
    console.warn('⚠️ knowledge.js tidak ditemukan atau kosong!');
    // Fallback jika knowledge.js gagal
    window.knowledgeBase = [
        {
            keywords: ['prasasti', 'kedukan bukit'],
            replies: ['Prasasti Kedukan Bukit adalah peninggalan Sriwijaya.']
        }
    ];
}

// ---- 3b. Fungsi untuk menampilkan daftar topik ----
function getTopicList() {
    var topics = [];
    var seen = new Set();
    for (var i = 0; i < window.knowledgeBase.length; i++) {
        var item = window.knowledgeBase[i];
        if (item.keywords && item.keywords.length > 0) {
            // Ambil keyword pertama sebagai judul topik
            var title = item.keywords[0];
            // Kapitalisasi huruf pertama
            title = title.charAt(0).toUpperCase() + title.slice(1);
            if (!seen.has(title)) {
                seen.add(title);
                topics.push(title);
            }
        }
    }
    return topics;
}

// ---- 3c. Fungsi cek perintah khusus (!topik) ----
function cekPerintahKhusus(pesan) {
    var q = pesan.toLowerCase().trim();
    if (q === '!topik' || q === 'topik' || q === 'daftar topik' || q === 'topik apa aja') {
        var list = getTopicList();
        var total = list.length;
        var reply = '📋 *DAFTAR ' + total + ' TOPIK YANG DIDUKUNG:*\n\n';
        for (var i = 0; i < list.length; i++) {
            reply += (i+1) + '. ' + list[i] + '\n';
        }
        reply += '\n💡 *Cara tanya:* cukup ketik kata kunci, misal "prasasti", "nazwa", "hoaks", atau "biner".';
        return reply;
    }
    return null;
}

// ---- 3d. Fungsi pencarian jawaban dengan skor ----
function getEtnosatekReply(message) {
    var q = message.toLowerCase().trim();
    var words = q.split(/\s+/);
    var bestMatch = null;
    var bestScore = 0;

    for (var i = 0; i < window.knowledgeBase.length; i++) {
        var item = window.knowledgeBase[i];
        var keywords = item.keywords || [];
        var replies = item.replies || item.answers || [];
        var score = 0;

        for (var j = 0; j < keywords.length; j++) {
            var keyword = keywords[j].toLowerCase();
            // Cek apakah keyword ada di dalam pertanyaan (includes)
            if (q.indexOf(keyword) !== -1) {
                score += 10;
            }
            // Cek per kata (lebih fleksibel)
            for (var k = 0; k < words.length; k++) {
                if (words[k].length > 2) {
                    if (keyword.indexOf(words[k]) !== -1) {
                        score += 5;
                    }
                    if (words[k].indexOf(keyword) !== -1) {
                        score += 8;
                    }
                }
            }
        }

        if (score > bestScore) {
            bestScore = score;
            bestMatch = replies;
        }
    }

    if (bestMatch && bestMatch.length > 0) {
        var rand = Math.floor(Math.random() * bestMatch.length);
        return bestMatch[rand];
    }

    // Fallback
    var totalTopik = window.knowledgeBase.length;
    return "Maaf, saya belum paham pertanyaan itu. Saya mendukung " + totalTopik + " topik. Ketik *!topik* untuk melihat daftar lengkapnya.";
}

// ---- 3e. Fungsi toggle chat (GLOBAL) ----
window.toggleChat = function() {
    console.log("🤖 Tombol diklik!");
    var win = document.getElementById('ai-chat-window');
    if (win) {
        if (win.style.display === 'none' || win.style.display === '') {
            win.style.display = 'flex';
            // Tampilkan pesan sambutan dengan jumlah topik jika chat baru dibuka
            var container = document.getElementById('ai-chat-messages');
            // Hanya tambahkan jika belum ada pesan (misal hanya pesan default)
            if (container && container.children.length === 1) {
                var total = window.knowledgeBase.length;
                var botMsg = document.createElement('div');
                botMsg.className = 'msg-bot';
                botMsg.style.cssText = 'align-self:flex-start; background:#eee; padding:10px 14px; border-radius:16px 16px 16px 0; max-width:85%; font-size:14px; color:#333; line-height:1.5;';
                botMsg.textContent = 'Halo Kapten! Saya asisten ETNOSATEK. Saya mendukung ' + total + ' topik. Ketik *!topik* untuk melihat daftar lengkapnya.';
                container.appendChild(botMsg);
            }
        } else {
            win.style.display = 'none';
        }
    } else {
        alert("Error: elemen chat tidak ditemukan!");
    }
};

// ---- 3f. Fungsi kirim pesan (GLOBAL) ----
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

        // Cek perintah khusus dulu
        var specialReply = cekPerintahKhusus(msg);
        var reply = specialReply || getEtnosatekReply(msg);

        var botDiv = document.createElement('div');
        botDiv.className = 'msg-bot';
        botDiv.style.cssText = 'align-self:flex-start; background:#eee; padding:10px 14px; border-radius:16px 16px 16px 0; max-width:85%; font-size:14px; color:#333; line-height:1.5;';
        botDiv.textContent = reply;
        container.appendChild(botDiv);
        container.scrollTop = container.scrollHeight;
    }, 500);
};

// ---- 3g. Event listener untuk tombol kirim ----
document.addEventListener('DOMContentLoaded', function() {
    var sendBtn = document.getElementById('ai-chat-send');
    if (sendBtn) {
        sendBtn.addEventListener('click', window.sendChatGemini);
    }
    console.log('✅ Chatbot ETNOSATEK siap!');
});

// ---- 3h. Pastikan fungsi global ----
window.getTopicList = getTopicList;
window.cekPerintahKhusus = cekPerintahKhusus;
window.getEtnosatekReply = getEtnosatekReply;
