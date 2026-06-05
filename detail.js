// =========================
// FIREBASE REF
// =========================
const dbRef = db.ref("ide");

// =========================
// ELEMENT
// =========================
const tableData = document.getElementById("tableData");
const searchInput = document.getElementById("search");

// =========================
// LOCAL DATA CACHE
// =========================
let allData = {};

// =========================
// LOAD DATA REALTIME
// =========================
dbRef.on("value", (snapshot) => {
    allData = snapshot.val() || {};
    renderTable(allData);
});

// =========================
// RENDER TABLE
// =========================
function renderTable(data) {
    tableData.innerHTML = "";

    const entries = Object.entries(data);

    if (entries.length === 0) {
        tableData.innerHTML = `
            <tr>
                <td colspan="4" style="text-align:center;">Belum ada data</td>
            </tr>
        `;
        return;
    }

    entries.forEach(([id, d]) => {

        // ROW UTAMA
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${d.judul || "-"}</td>
            <td>${d.unitKerja || "-"}</td>
            <td>${d.kategori || "-"}</td>
            <td>
                <button onclick="toggleDetail('${id}')">
                    Detail
                </button>
            </td>
        `;

        tableData.appendChild(tr);

        // DETAIL ROW
        const detail = document.createElement("tr");
        detail.id = "detail-" + id;
        detail.style.display = "none";

        detail.innerHTML = `
            <td colspan="4" style="background:#fff8ef; padding:15px;">

                <strong>Nama:</strong> ${d.nama || "-"} <br><br>
                <strong>Unit Kerja:</strong> ${d.unitKerja || "-"} <br><br>
                <strong>Ketua Tim:</strong> ${d.ketuaTim || "-"} <br><br>

                <strong>Latar Belakang:</strong><br>
                ${d.latarBelakang || "-"} <br><br>

                <strong>Deskripsi:</strong><br>
                ${d.deskripsi || "-"} <br><br>

                <strong>Anggota:</strong><br>
                ${(d.anggota || []).join(", ") || "-"} <br><br>

                <strong>Dasar Hukum:</strong><br>
                ${(d.dasarHukum || []).join(", ") || "-"} <br><br>

                <strong>📎 Lampiran PDF:</strong><br>

                ${d.lampiran ? `
                    <div style="margin-top:10px;">

                        <!-- BUTTON OPEN -->
                        <a href="${d.lampiran}" target="_blank">
                            <button style="
                                background:linear-gradient(135deg,#ff8c42,#ffb703);
                                color:white;
                                border:none;
                                padding:10px 14px;
                                border-radius:10px;
                                cursor:pointer;
                                margin-bottom:10px;
                            ">
                                🔍 Buka PDF
                            </button>
                        </a>

                        <!-- PREVIEW PDF -->
                        <iframe
                            src="${d.lampiran}"
                            style="
                                width:100%;
                                height:400px;
                                border:1px solid #ddd;
                                border-radius:10px;
                            ">
                        </iframe>

                    </div>
                ` : "<span style='color:#999'>Tidak ada lampiran</span>"}

            </td>
        `;

        tableData.appendChild(detail);
    });
}

// =========================
// TOGGLE DETAIL
// =========================
function toggleDetail(id) {
    const row = document.getElementById("detail-" + id);
    if (!row) return;

    row.style.display =
        row.style.display === "none" ? "table-row" : "none";
}

// =========================
// SEARCH FUNCTION
// =========================
searchInput.addEventListener("input", () => {
    const q = searchInput.value.toLowerCase();

    const filtered = Object.fromEntries(
        Object.entries(allData).filter(([id, d]) =>
            (d.judul || "").toLowerCase().includes(q) ||
            (d.unitKerja || "").toLowerCase().includes(q) ||
            (d.kategori || "").toLowerCase().includes(q)
        )
    );

    renderTable(filtered);
});