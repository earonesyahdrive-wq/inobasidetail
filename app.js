// =========================
// GLOBAL STATE SAFE
// =========================
let listData = [];
let isSaving = false;
let firebaseListener = null;

// =========================
// FIREBASE SAFE INIT
// =========================
let dbRef = null;
let storageRef = null;

try {
    if (typeof db !== "undefined" && db && typeof db.ref === "function") {
        dbRef = db.ref("ide");
    }

    if (
        typeof firebase !== "undefined" &&
        firebase.storage &&
        typeof firebase.storage === "function"
    ) {
        storageRef = firebase.storage().ref();
    }
} catch (e) {
    console.error("Firebase init error:", e);
}

// =========================
// SAFE DOM HELPER
// =========================
const el = (id) => document.getElementById(id);

// =========================
// DOM CACHE (ANTI NULL CRASH)
// =========================
let form, tbody, toast, loading, modal, detailContent;
let statTotal, statDigital, statPelayanan, statAdmin;
let progressBar;

// =========================
// INIT DOM
// =========================
function initDOM() {
    form = el("formIde");
    tbody = el("tbodyIde");
    toast = el("toast");
    loading = el("loading");
    modal = el("modalDetail");
    detailContent = el("detailContent");

    statTotal = el("statTotal");
    statDigital = el("statDigital");
    statPelayanan = el("statPelayanan");
    statAdmin = el("statAdmin");

    progressBar = el("uploadProgress");
}

// =========================
// UI HELPERS
// =========================
function showToast(msg) {
    if (!toast) return;
    toast.innerText = msg;
    toast.style.display = "block";

    setTimeout(() => {
        if (toast) toast.style.display = "none";
    }, 2000);
}

function setLoading(state) {
    if (!loading) return;
    loading.style.display = state ? "block" : "none";
}


// =========================
// AI SMART SCORING ENGINE (REAL-TIME)
// =========================

function aiSmartScore(item = {}) {
    let score = 0;

    const kategori = item.kategori || "";
    const deskripsi = item.deskripsi || "";
    const latar = item.latarBelakang || "";
    const anggota = item.anggota || [];

    // =========================
    // BASE INTELLIGENCE SCORING
    // =========================
    const kategoriWeight = {
        "Digitalisasi": 35,
        "Pelayanan": 30,
        "Pengawasan": 40,
        "Administrasi": 20
    };

    score += kategoriWeight[kategori] || 10;

    // =========================
    // QUALITY SIGNAL
    // =========================
    if (deskripsi.length > 150) score += 20;
    else if (deskripsi.length > 80) score += 10;

    if (latar.length > 150) score += 20;
    else if (latar.length > 80) score += 10;

    if (anggota.length >= 4) score += 15;
    else if (anggota.length >= 2) score += 8;

    // =========================
    // DPMPTSP REAL-WORLD FACTOR
    // =========================

    // OSS readiness
    const ossFactor =
        kategori === "Pelayanan" ? 15 :
        kategori === "Digitalisasi" ? 20 :
        kategori === "Administrasi" ? 5 : 10;

    score += ossFactor;

    // Complexity penalty
    const complexityPenalty =
        kategori === "Administrasi" ? -10 :
        kategori === "Pengawasan" ? -5 : 0;

    score += complexityPenalty;

    // =========================
    // FINAL NORMALIZATION
    // =========================
    const probability = Math.min(95, Math.max(5, score + 12));

    return {
        score,
        probability
    };
}
// =========================
// ANALISA ENGINE (NO CHANGE)
// =========================
function generateAnalisa(item = {}) {

    const ai = aiSmartScore(item);
let score = ai.score;



    const probability = Math.min(95, score + 10);

    let level = "Rendah";
    if (probability >= 70) level = "Tinggi";
    else if (probability >= 40) level = "Sedang";

function buildKesimpulan(item, level, probability) {
    const bagian = [];

    // 1. Judul & konteks
    if (item.judul) {
        bagian.push(`Inovasi "${item.judul}" memiliki fokus pada ${item.kategori || "bidang terkait"}.`);
    }

    // 2. Kualitas deskripsi
    if (item.deskripsi && item.deskripsi.length > 120) {
        bagian.push("Deskripsi sudah cukup lengkap dan mendukung implementasi.");
    } else {
        bagian.push("Deskripsi masih perlu diperjelas untuk meningkatkan pemahaman.");
    }

    // 3. Tim
    const jumlahTim = item.anggota ? item.anggota.length : 0;

    if (jumlahTim >= 4) {
        bagian.push("Komposisi tim tergolong kuat dan kolaboratif.");
    } else if (jumlahTim >= 2) {
        bagian.push("Tim cukup, namun masih bisa diperluas untuk efektivitas.");
    } else {
        bagian.push("Tim masih kurang memadai untuk implementasi optimal.");
    }

    // 4. Level keputusan
    if (level === "Tinggi") {
        bagian.push("Secara keseluruhan, inovasi ini sangat layak untuk segera diimplementasikan.");
    } else if (level === "Sedang") {
        bagian.push("Inovasi ini potensial namun masih memerlukan penguatan konsep.");
    } else {
        bagian.push("Inovasi ini masih membutuhkan revisi signifikan sebelum dapat diterapkan.");
    }

    // 5. Probabilitas
    bagian.push(`Tingkat kelayakan diperkirakan sekitar ${probability}%.`);

    return bagian.join(" ");
}

    return {
    	aiInsight:
    probability >= 80
        ? "AI: Sangat siap diproses OSS-RBA (low friction approval)"
        : probability >= 50
            ? "AI: Perlu verifikasi tambahan DPMPTSP"
            : "AI: Risiko tinggi, butuh revisi data & dokumen",
        level,
        probability,
        saran:
            level === "Tinggi"
                ? "Layak implementasi cepat (pilot project)."
                : level === "Sedang"
                    ? "Perlu penguatan konsep & uji coba."
                    : "Perlu revisi mendalam sebelum implementasi.",

        regulasi: [
            "UU No. 25 Tahun 2009",
            "UU No. 30 Tahun 2014",
            "Perpres No. 95 Tahun 2018",
            "Permen PANRB Inovasi Pelayanan Publik"
        ],

        kendala: [
            (!item.anggota || item.anggota.length < 2) && "Tim kurang solid",
            (!item.deskripsi || item.deskripsi.length < 50) && "Deskripsi kurang detail",
            item.kategori === "Administrasi" && "Potensi hambatan birokrasi"
        ].filter(Boolean),

        produkHukum: [
            "SOP",
            "Keputusan Pimpinan",
            "Peraturan Internal",
            "Pedoman Teknis"
        ],

        kesimpulan: buildKesimpulan(item, level, probability)
    };
}

// =========================
// RENDER TABLE
// =========================
function renderTable() {
    if (!tbody) return;

    tbody.innerHTML = "";

    listData.forEach((item) => {
        const a = generateAnalisa(item);

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${item.judul ?? "-"}</td>
            <td>${item.unitKerja ?? "-"}</td>
            <td>${item.kategori ?? "-"}</td>
            <td>${a.level} (${a.probability}%)</td>
            <td>
                <button onclick="openDetail('${item.id}')">Detail</button>
                <button onclick="deleteData('${item.id}')">Hapus</button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

// =========================
// STATS
// =========================
function renderStats() {
    const count = (k) => listData.filter(x => x.kategori === k).length;

    if (statTotal) statTotal.innerText = listData.length;
    if (statDigital) statDigital.innerText = count("Digitalisasi");
    if (statPelayanan) statPelayanan.innerText = count("Pelayanan");
    if (statAdmin) statAdmin.innerText = count("Administrasi");
}

// =========================
// FIREBASE LISTENER SAFE
// =========================
function listenData() {
    if (!dbRef) {
        console.error("Firebase DB tidak tersedia");
        return;
    }

    try {
        if (firebaseListener && dbRef.off) {
            dbRef.off("value", firebaseListener);
        }

        firebaseListener = (snap) => {
            const data = snap.val();

            listData = (!data || typeof data !== "object")
                ? []
                : Object.entries(data).map(([id, val]) => {
                    const item = { id, ...(val || {}) };

                    // AI REAL-TIME SCORING
                    const ai = aiSmartScore(item);
                    item.aiProbability = ai.probability;
                    item.aiScore = ai.score;

                    return item;
                });

            renderTable();
            renderStats();
        };

        dbRef.on("value", firebaseListener);

    } catch (e) {
        console.error("Listener error:", e);
    }
}

// =========================
// SAVE DATA SAFE
// =========================
async function saveData() {
    if (!dbRef || isSaving) return;

    isSaving = true;
    setLoading(true);

    try {
        const data = {
            nama: el("nama")?.value || "",
            unitKerja: el("unitKerja")?.value || "",
            judul: el("judul")?.value || "",
            kategori: el("kategori")?.value || "",
            ketuaTim: el("ketuaTim")?.value || "",
            latarBelakang: el("latarBelakang")?.value || "",
            deskripsi: el("deskripsi")?.value || "",
            anggota: [...document.querySelectorAll(".anggota")].map(i => i?.value || ""),
            dasarHukum: [...document.querySelectorAll(".dasarHukum")].map(i => i?.value || ""),
            createdAt: Date.now()
        };

        const file = el("lampiran")?.files?.[0];

        if (file && storageRef) {
            const ref = storageRef.child("lampiran/" + Date.now() + ".pdf");
            const uploadTask = ref.put(file);

            uploadTask.on("state_changed", (snap) => {
                if (progressBar) {
                    progressBar.style.width =
                        (snap.bytesTransferred / snap.totalBytes) * 100 + "%";
                }
            });

            await uploadTask;

            data.lampiranURL = await ref.getDownloadURL();
        }

        await dbRef.push(data);

        showToast("Data berhasil disimpan");
        form?.reset();

        if (progressBar) progressBar.style.width = "0%";

    } catch (e) {
        console.error("SAVE ERROR:", e);
        showToast("Gagal menyimpan data");
    }

    setLoading(false);
    isSaving = false;
}

// =========================
// GLOBAL ACTIONS
// =========================
window.deleteData = function (id) {
    if (!dbRef) return;
    if (!confirm("Hapus data ini?")) return;

    dbRef.child(id).remove();
    showToast("Data dihapus");
};

window.openDetail = function (id) {
    const item = listData.find(x => x.id === id);
    if (!item || !detailContent) return;

    const a = generateAnalisa(item);

    const badgeClass =
        a.level === "Tinggi" ? "style='background:#dcfce7;color:#166534;'" :
        a.level === "Sedang" ? "style='background:#fef9c3;color:#854d0e;'" :
        "style='background:#fee2e2;color:#991b1b;'";

    detailContent.innerHTML = `
        <div style="max-height:80vh; overflow:auto; padding:5px;">

        <h2 style="margin-bottom:15px;">📊 Dashboard Analisa Ide</h2>

        <!-- TOP SUMMARY CARDS -->
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:15px;">

            <div style="background:#fff;padding:12px;border-radius:12px;box-shadow:0 5px 15px rgba(0,0,0,0.08);">
                <div style="font-size:12px;color:#6b7280;">Judul</div>
                <div style="font-weight:600">${item.judul || "-"}</div>
            </div>

            <div style="background:#fff;padding:12px;border-radius:12px;box-shadow:0 5px 15px rgba(0,0,0,0.08);">
                <div style="font-size:12px;color:#6b7280;">Kategori</div>
                <div style="font-weight:600">${item.kategori || "-"}</div>
            </div>

            <div style="background:#fff;padding:12px;border-radius:12px;box-shadow:0 5px 15px rgba(0,0,0,0.08);">
                <div style="font-size:12px;color:#6b7280;">Unit Kerja</div>
                <div style="font-weight:600">${item.unitKerja || "-"}</div>
            </div>

            <div style="background:#fff;padding:12px;border-radius:12px;box-shadow:0 5px 15px rgba(0,0,0,0.08);">
                <div style="font-size:12px;color:#6b7280;">Ketua Tim</div>
                <div style="font-weight:600">${item.ketuaTim || "-"}</div>
            </div>

        </div>

        <!-- ANALISA CARD -->
        <div style="background:#fff;border-radius:14px;padding:15px;box-shadow:0 8px 20px rgba(0,0,0,0.08);margin-bottom:15px;">

            <h3 style="margin-bottom:10px;">📈 Hasil Analisa</h3>

            <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;">
                <span style="padding:5px 10px;border-radius:8px;font-size:12px;${badgeClass}">
                    ${a.level}
                </span>

                <span style="padding:5px 10px;border-radius:8px;font-size:12px;background:#e0f2fe;color:#075985;">
                    Probability: ${a.probability}%
                </span>
            </div>

            <p style="margin:5px 0;"><b>Saran:</b> ${a.saran}</p>
            <p style="margin:5px 0;"><b>Kesimpulan:</b> ${a.kesimpulan}</p>

        </div>

        <!-- GRID SECTION -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">

            <div style="background:#fff;padding:12px;border-radius:12px;box-shadow:0 5px 15px rgba(0,0,0,0.06);">
                <h4>⚖️ Regulasi</h4>
                <ul style="padding-left:18px;margin:0;">
                    ${a.regulasi.map(r => `<li>${r}</li>`).join("")}
                </ul>
            </div>

            <div style="background:#fff;padding:12px;border-radius:12px;box-shadow:0 5px 15px rgba(0,0,0,0.06);">
                <h4>⚠️ Kendala</h4>
                <ul style="padding-left:18px;margin:0;">
                    ${
                        a.kendala.length
                            ? a.kendala.map(k => `<li>${k}</li>`).join("")
                            : "<li>Tidak ada kendala</li>"
                    }
                </ul>
            </div>

        </div>

        <!-- DETAIL TEXT -->
        <div style="margin-top:15px;background:#fff;padding:12px;border-radius:12px;box-shadow:0 5px 15px rgba(0,0,0,0.06);">

            <h4>📝 Detail Informasi</h4>

            <p><b>Deskripsi:</b><br>${item.deskripsi || "-"}</p>
            <p><b>Latar Belakang:</b><br>${item.latarBelakang || "-"}</p>

        </div>

        </div>
    `;

    modal.style.display = "flex";
};

// =========================
// MODAL CLOSE SAFE
// =========================
document.addEventListener("click", (e) => {
    if (modal && e.target === modal) {
        modal.style.display = "none";
    }
});

// =========================
// EVENTS SAFE
// =========================
document.addEventListener("DOMContentLoaded", () => {
    initDOM();
    listenData();

    document.getElementById("btnSimpan")?.addEventListener("click", saveData);

    document.getElementById("btnReset")?.addEventListener("click", () => {
        form?.reset();
        showToast("Form direset");
    });

    document.getElementById("btnTambahAnggota")?.addEventListener("click", () => {
        const div = document.getElementById("daftarAnggota");
        if (!div) return;

        const input = document.createElement("input");
        input.className = "anggota";
        input.placeholder = "Nama anggota";
        div.appendChild(input);
    });

    document.getElementById("btnTambahDasarHukum")?.addEventListener("click", () => {
        const div = document.getElementById("daftarDasarHukum");
        if (!div) return;

        const input = document.createElement("input");
        input.className = "dasarHukum";
        input.placeholder = "Dasar hukum";
        div.appendChild(input);
    });
});

// =========================
// START LISTENER (SAFETY CALL)
// =========================
listenData();
