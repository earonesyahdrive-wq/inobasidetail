// =====================================
// FIREBASE SAFE INIT
// =====================================

(function initFirebaseSafe() {

    if (!window.firebase) {
        alert("Firebase tidak ditemukan");
        throw new Error("Firebase tidak loaded");
    }

    const firebaseConfig = {
        apiKey: "AIzaSyAV4elg7kaRtL7MTXtrb9oWOOuF2e5qlJ4",
        authDomain: "inovasi123-e8266.firebaseapp.com",
        databaseURL: "https://inovasi123-e8266-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "inovasi123-e8266",
        storageBucket: "inovasi123-e8266.firebasestorage.app",
        messagingSenderId: "881339507290",
        appId: "1:881339507290:web:867805e92aeb40f0742e63"
    };

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

})();

const db = firebase.database();

const pegawaiRef = db.ref("pegawai");
const inovasiRef = db.ref("inovasi");

// =====================================
// STATE GLOBAL
// =====================================

let allData = [];

const output = document.getElementById("output");

// =====================================
// LOADING
// =====================================

function showLoading() {
    const el = document.getElementById("loadingModal");
    if (el) el.style.display = "flex";
}

function hideLoading() {
    const el = document.getElementById("loadingModal");
    if (el) el.style.display = "none";
}

// =====================================
// TOAST
// =====================================

function toast(msg) {

    const el = document.getElementById("toast");

    if (!el) {
        alert(msg);
        return;
    }

    el.innerText = msg;
    el.classList.add("show");

    setTimeout(() => {
        el.classList.remove("show");
    }, 2500);
}

// =====================================
// PROBABILITAS OTOMATIS
// =====================================

function hitungProbabilitas(data) {

    let skor = 0;

    if (data.judul) skor += 15;
    if (data.kategori) skor += 15;

    if ((data.dasarHukum || "").length > 20) skor += 20;
    if ((data.latarBelakang || "").length > 50) skor += 20;
    if ((data.deskripsi || "").length > 100) skor += 20;
    if ((data.tujuan || "").length > 30) skor += 10;

    return Math.min(skor, 100);
}

// =====================================
// ANALISA (FALLBACK / OFFLINE)
// =====================================

function analisaOffline(data) {

    let saran = [];
    let kendala = [];
    let dasarHukum = [];

    // dasar hukum otomatis
    dasarHukum.push("UU No. 25 Tahun 2009 tentang Pelayanan Publik");
    dasarHukum.push("UU No. 23 Tahun 2014 tentang Pemerintahan Daerah");
    dasarHukum.push("Perpres SPBE No. 95 Tahun 2018");

    if ((data.kategori || "").toLowerCase().includes("pelayanan")) {
        dasarHukum.push("UU Cipta Kerja (OSS Perizinan Berusaha)");
    }

    // saran
    if ((data.deskripsi || "").length < 100) {
        saran.push("Deskripsi masih terlalu singkat");
    }

    if ((data.tujuan || "").length < 30) {
        saran.push("Tujuan belum spesifik");
    }

    // kendala
    if ((data.latarBelakang || "").length < 50) {
        kendala.push("Latar belakang kurang kuat");
    }

    if (!data.dasarHukum) {
        kendala.push("Belum ada dasar hukum input user");
    }

    if (kendala.length === 0) {
        kendala.push("Tidak ditemukan kendala besar");
    }

    // kesimpulan
    let kesimpulan =
        data.probabilitas >= 80
            ? "Sangat layak diimplementasikan"
            : data.probabilitas >= 60
                ? "Layak dengan perbaikan"
                : "Perlu revisi besar";

    return { saran, kendala, dasarHukum, kesimpulan };
}

// =====================================
// LOAD DATA
// =====================================

async function loadData() {

    try {

        showLoading();

        const pegawaiSnap = await pegawaiRef.once("value");
        const inovasiSnap = await inovasiRef.once("value");

        const pegawai = pegawaiSnap.val() || {};
        const inovasi = inovasiSnap.val() || {};

        allData = [];

        Object.keys(inovasi).forEach(id => {

            const inv = inovasi[id];
            const p = pegawai[inv.nip] || {};

            allData.push({
                id,
                nip: inv.nip,
                nama: p.nama || "-",
                jabatan: p.jabatan || "-",
                tempatTugas: p.tempatTugas || "-",
                judul: inv.judul || "-",
                kategori: inv.kategori || "-",
                dasarHukum: inv.dasarHukum || "",
                latarBelakang: inv.latarBelakang || "",
                deskripsi: inv.deskripsi || "",
                tujuan: inv.tujuan || "",
                status: inv.status || "diajukan",
                createdAt: inv.createdAt || 0,
                probabilitas: hitungProbabilitas(inv)
            });

        });

        allData.sort((a, b) => b.createdAt - a.createdAt);

        updateDashboard();
        renderTable(allData);

    } catch (err) {

        console.error(err);
        toast("Gagal load data");

    } finally {
        hideLoading();
    }
}

// =====================================
// DASHBOARD
// =====================================

function updateDashboard() {

    document.getElementById("totalInovasi").innerText = allData.length;
    document.getElementById("totalDiajukan").innerText =
        allData.filter(x => x.status === "diajukan").length;

    document.getElementById("totalDisetujui").innerText =
        allData.filter(x => x.status === "disetujui").length;

    document.getElementById("totalDitolak").innerText =
        allData.filter(x => x.status === "ditolak").length;
}

// =====================================
// RENDER TABLE
// =====================================

function renderTable(data) {

    output.innerHTML = "";

    if (!data.length) {
        output.innerHTML = `
        <tr>
            <td colspan="7" align="center">Data kosong</td>
        </tr>`;
        return;
    }

    data.forEach(item => {

        output.innerHTML += `
        <tr>
            <td>${item.nip}</td>
            <td>${item.nama}</td>
            <td>${item.judul}</td>
            <td>${item.kategori}</td>
            <td>${item.probabilitas}%</td>
            <td>${item.status}</td>
            <td>
                <button onclick="detail('${item.id}')">Detail</button>
                <button onclick="approve('${item.id}')">âœ”</button>
                <button onclick="reject('${item.id}')">âœ–</button>
                <button onclick="hapus('${item.id}')">Hapus</button>
            </td>
        </tr>`;
    });
}

// =====================================
// DETAIL POPUP (ANALISA REALTIME)
// =====================================

function detail(id) {

    const data = allData.find(x => x.id === id);
    if (!data) return;

    const hasil = analisaOffline(data);

    document.getElementById("detailBody").innerHTML = `

        <h3>DATA PEGAWAI</h3>
        <p>NIP: ${data.nip}</p>
        <p>Nama: ${data.nama}</p>
        <p>Jabatan: ${data.jabatan}</p>

        <hr>

        <h3>INOVASI</h3>
        <p>Judul: ${data.judul}</p>
        <p>Kategori: ${data.kategori}</p>

        <hr>

        <h3>PROBABILITAS: ${data.probabilitas}%</h3>

        <hr>

        <h3>ðŸ“Œ SARAN</h3>
        <ul>${hasil.saran.map(x => `<li>${x}</li>`).join("")}</ul>

        <h3>âš  KENDALA</h3>
        <ul>${hasil.kendala.map(x => `<li>${x}</li>`).join("")}</ul>

        <h3>ðŸ“š DASAR HUKUM</h3>
        <ul>${hasil.dasarHukum.map(x => `<li>${x}</li>`).join("")}</ul>

        <h3>ðŸ§¾ KESIMPULAN</h3>
        <p>${hasil.kesimpulan}</p>

    `;

    document.getElementById("detailModal").style.display = "flex";
}

// =====================================
// MODAL CLOSE
// =====================================

function tutupModal() {
    document.getElementById("detailModal").style.display = "none";
}

// =====================================
// APPROVE / REJECT / DELETE
// =====================================

function approve(id) {
    inovasiRef.child(id).update({ status: "disetujui" })
        .then(() => {
            toast("Disetujui");
            loadData();
        });
}

function reject(id) {
    inovasiRef.child(id).update({ status: "ditolak" })
        .then(() => {
            toast("Ditolak");
            loadData();
        });
}

function hapus(id) {

    if (!confirm("Hapus data?")) return;

    inovasiRef.child(id).remove()
        .then(() => {
            toast("Terhapus");
            loadData();
        });
}

// =====================================
// SEARCH + FILTER
// =====================================

function cariData() {

    const q = document.getElementById("search").value.toLowerCase();

    const hasil = allData.filter(x =>
        x.nip.toLowerCase().includes(q) ||
        x.nama.toLowerCase().includes(q) ||
        x.judul.toLowerCase().includes(q)
    );

    renderTable(hasil);
}

function applyFilter() {

    let data = [...allData];

    const status = document.getElementById("filterStatus").value;
    const kategori = document.getElementById("filterKategori").value;

    if (status) data = data.filter(x => x.status === status);
    if (kategori) data = data.filter(x => x.kategori === kategori);

    renderTable(data);
}

// =====================================
// INIT
// =====================================

window.onload = loadData;
