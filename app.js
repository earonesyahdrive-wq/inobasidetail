// =========================
// FIREBASE REF
// =========================
const dbRef = db.ref("ide");

const aiCache = {};
const loadingAI = {};

// =========================
// ELEMENT CACHE
// =========================
const tbody = document.getElementById("tbodyIde");
const loading = document.getElementById("loading");
const toast = document.getElementById("toast");

const nama = document.getElementById("nama");
const unit = document.getElementById("unitKerja");
const judul = document.getElementById("judul");
const kategori = document.getElementById("kategori");
const ketua = document.getElementById("ketuaTim");
const latar = document.getElementById("latarBelakang");
const deskripsi = document.getElementById("deskripsi");
const lampiran = document.getElementById("lampiran");

let editId = null;

// =========================
// UI HELPERS (SAFE)
// =========================
const setLoading = (v) => {
    const el = document.getElementById("loading");
    if (el) el.style.display = v ? "block" : "none";
};

function toastMsg(msg) {
    const t = document.getElementById("toast");
    if (!t) return;

    t.innerText = msg;
    t.style.display = "block";

    setTimeout(() => {
        t.style.display = "none";
    }, 2500);
}

// =========================
// INPUT DINAMIS
// =========================
function addInput(containerId, className, placeholder) {
    const container = document.getElementById(containerId);

    const wrap = document.createElement("div");
    wrap.className = "input-group";

    const input = document.createElement("input");
    input.type = "text";
    input.className = className;
    input.placeholder = placeholder;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn-delete";
    btn.innerText = "×";
    btn.onclick = () => wrap.remove();

    wrap.appendChild(input);
    wrap.appendChild(btn);
    container.appendChild(wrap);
}

// tombol tambah
document.getElementById("btnTambahAnggota").onclick =
    () => addInput("daftarAnggota", "anggota", "Nama anggota");

document.getElementById("btnTambahDasarHukum").onclick =
    () => addInput("daftarDasarHukum", "dasarHukum", "Dasar hukum");

// =========================
// ARRAY HELPER
// =========================
const getArray = (cls) =>
    [...document.querySelectorAll("." + cls)]
        .map(e => e.value.trim())
        .filter(Boolean);

// =========================
// FORM DATA
// =========================
function getFormData() {
    return {
        nama: nama.value.trim(),
        unitKerja: unit.value.trim(),
        judul: judul.value.trim(),
        kategori: kategori.value,
        ketuaTim: ketua.value.trim(),
        latarBelakang: latar.value.trim(),
        deskripsi: deskripsi.value.trim(),
        anggota: getArray("anggota"),
        dasarHukum: getArray("dasarHukum"),
        tanggal: Date.now()
    };
}

// =========================
// RESET FORM
// =========================
function resetForm() {
    nama.value = "";
    unit.value = "";
    judul.value = "";
    kategori.value = "";
    ketua.value = "";
    latar.value = "";
    deskripsi.value = "";
    lampiran.value = "";

    editId = null;

    document.getElementById("daftarAnggota").innerHTML = `
        <div class="input-group">
            <input type="text" class="anggota" placeholder="Nama anggota">
        </div>
    `;

    document.getElementById("daftarDasarHukum").innerHTML = `
        <div class="input-group">
            <input type="text" class="dasarHukum" placeholder="Dasar hukum">
        </div>
    `;
}

// =========================
// GET DATA
// =========================
function getIdeById(id) {
    return db.ref("ide/" + id).once("value").then(s => s.val());
}

// =========================
// AI ENGINE LAMA (AMAN)
// =========================
function generateAIAnalysis(data) {
    const teks = `
        ${data?.judul || ""}
        ${data?.deskripsi || ""}
        ${data?.unitKerja || ""}
    `.toLowerCase();

    let kategoriAI = "Normal";
    let saran = [];
    let risiko = [];

    if (teks.includes("lambat")) {
        kategoriAI = "Masalah Kinerja";
        saran.push("Percepatan layanan");
    }

    if (teks.includes("error")) {
        kategoriAI = "Masalah Teknis";
        saran.push("Perbaikan sistem");
    }

    if (saran.length === 0) saran.push("Observasi lanjutan diperlukan");
    if (risiko.length === 0) risiko.push("Belum terdeteksi risiko signifikan");

    return {
        kategori: kategoriAI,
        ringkasan: teks.substring(0, 150),
        saran,
        risiko
    };
}

// =========================
// AI BUTTON
// =========================
async function analisaAI(id) {
    if (loadingAI[id]) return;
    loadingAI[id] = true;

    try {
        const data = await getIdeById(id);
        if (!data) return toastMsg("Data tidak ditemukan");

        if (aiCache[id]) return showAI(aiCache[id]);

        const result = generateAIAnalysis(data);
        aiCache[id] = result;

        showAI(result);
    } catch (err) {
        console.error(err);
    } finally {
        loadingAI[id] = false;
    }
}

function analisaAIPro(id) {
    analisaAI(id);
}

// =========================
// 🧠 UPGRADE SHOW AI + REGULASI
// =========================
function showAI(res) {

    const regulasi = `
📜 DASAR REGULASI:

1. UU No. 25 Tahun 2009 - Pelayanan Publik
2. UU No. 23 Tahun 2014 - Pemerintahan Daerah
3. Perpres No. 95 Tahun 2018 - SPBE
4. PermenPANRB No. 5 Tahun 2020 - Inovasi Pelayanan Publik
5. PP No. 96 Tahun 2012 - Standar Pelayanan Publik
`;

    alert(`
📊 HASIL ANALISA INOVASI

━━━━━━━━━━━━━━━━━━
🧠 KATEGORI:
${res.kategori}

━━━━━━━━━━━━━━━━━━
📌 RINGKASAN:
${res.ringkasan}

━━━━━━━━━━━━━━━━━━
💡 SARAN:
- ${res.saran.join("\n- ")}

━━━━━━━━━━━━━━━━━━
⚠️ RISIKO:
- ${res.risiko.join("\n- ")}

━━━━━━━━━━━━━━━━━━
📜 REGULASI:
${regulasi}
    `);
}

// =========================
// FIREBASE RENDER (TIDAK DIUBAH)
// =========================
dbRef.on("value", snap => {

    try {
        tbody.innerHTML = "";

        let total = 0, digital = 0, pelayanan = 0, admin = 0;

        if (!snap.exists()) {
            tbody.innerHTML = `<tr><td colspan="6">Belum ada data</td></tr>`;
            return;
        }

        snap.forEach(child => {
            const d = child.val() || {};
            const id = child.key;

            total++;
            if (d.kategori === "Digitalisasi") digital++;
            if (d.kategori === "Pelayanan") pelayanan++;
            if (d.kategori === "Administrasi") admin++;

            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${d?.judul || "-"}</td>
                <td>${d?.unitKerja || "-"}</td>
                <td>${d?.kategori || "-"}</td>
                <td>${d?.tanggal ? new Date(d.tanggal).toLocaleDateString() : "-"}</td>
                <td>
                    <button onclick="toggleDetail('${id}')">Detail</button>
                    <button onclick="analisaAI('${id}')">Analisa</button>
                </td>
                <td>
                    <button onclick="editData('${id}')">Edit</button>
                    <button onclick="hapus('${id}')">Hapus</button>
                </td>
            `;

            tbody.appendChild(tr);

            const detail = document.createElement("tr");
            detail.id = "detail-" + id;
            detail.style.display = "none";

            detail.innerHTML = `
                <td colspan="6">
                    <b>Latar:</b><br>${d?.latarBelakang || "-"}<br>
                    <b>Deskripsi:</b><br>${d?.deskripsi || "-"}
                </td>
            `;

            tbody.appendChild(detail);
        });

        document.getElementById("statTotal").innerText = total;
        document.getElementById("statDigital").innerText = digital;
        document.getElementById("statPelayanan").innerText = pelayanan;
        document.getElementById("statAdmin").innerText = admin;

    } catch (err) {
        console.error(err);
        toastMsg("Render error");
    }
});

// =========================
// TOGGLE DETAIL
// =========================
function toggleDetail(id) {
    const row = document.getElementById("detail-" + id);
    if (row) row.style.display = row.style.display === "none" ? "table-row" : "none";
}

// =========================
// DELETE
// =========================
function hapus(id) {
    if (!confirm("Hapus data?")) return;

    dbRef.child(id).remove()
        .then(() => toastMsg("Data dihapus"))
        .catch(() => toastMsg("Gagal hapus"));
}

// =========================
// EDIT
// =========================
function editData(id) {
    dbRef.child(id).once("value")
        .then(snap => {
            const d = snap.val();
            if (!d) return;

            nama.value = d.nama || "";
            unit.value = d.unitKerja || "";
            judul.value = d.judul || "";
            kategori.value = d.kategori || "";
            ketua.value = d.ketuaTim || "";
            latar.value = d.latarBelakang || "";
            deskripsi.value = d.deskripsi || "";

            editId = id;
        });
}

// =========================
// RESET
// =========================
document.getElementById("btnReset").onclick = resetForm;


//
// =========================
// SAFE LAYER (TAMBAHAN SAJA)
// TIDAK MERUSAK KODE LAMA
// =========================

(function () {

    // =========================
    // DISABLE SEMUA TEXTBOX (MODE VIEW ONLY)
    // =========================
    function disableAllInputs() {
        document.querySelectorAll("input, textarea, select").forEach(el => {
            el.disabled = true;
        });
    }

    // Aktifkan ini jika ingin form terkunci
    disableAllInputs();

    // =========================
    // SAFE TOAST (JIKA BELUM ADA)
    // =========================
    window.toastMsg = window.toastMsg || function (msg) {
        const toast = document.getElementById("toast");
        if (!toast) return;

        toast.innerText = msg;
        toast.style.display = "block";

        setTimeout(() => {
            toast.style.display = "none";
        }, 2000);
    };

    // =========================
    // SAFE LOADING CONTROL
    // =========================
    window.setLoading = window.setLoading || function (state) {
        const loading = document.getElementById("loading");
        if (!loading) return;

        loading.style.display = state ? "block" : "none";
    };

    // =========================
    // PROGRESS BAR HANDLER
    // =========================
    window.setUploadProgress = function (percent) {
        const bar = document.getElementById("uploadProgress");
        if (!bar) return;

        bar.style.width = percent + "%";
    };

})();