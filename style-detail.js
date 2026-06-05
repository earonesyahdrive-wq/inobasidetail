/* =========================
   DETAIL PAGE STYLE
   ========================= */

:root {
    --primary: #ff7a00;
    --primary-dark: #e86800;
    --secondary: #ff9f43;

    --bg: #f4f6fb;
    --card: #ffffff;

    --text: #2c3e50;
    --text-light: #7f8c8d;

    --border: #e6e9ef;

    --shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
}

/* RESET */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Poppins', sans-serif;
}

/* BODY */
body {
    background: var(--bg);
    color: var(--text);
    padding: 20px;
}

/* CONTAINER */
.container {
    max-width: 1100px;
    margin: auto;
}

/* HERO */
.hero {
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    color: white;
    padding: 25px;
    border-radius: 12px;
    box-shadow: var(--shadow);
    margin-bottom: 20px;
}

.hero h1 {
    font-size: 24px;
    margin-bottom: 5px;
}

.hero p {
    font-size: 14px;
    opacity: 0.9;
}

/* CARD */
.card {
    background: var(--card);
    padding: 20px;
    border-radius: 12px;
    box-shadow: var(--shadow);
    margin-bottom: 20px;
}

.card h2 {
    font-size: 18px;
    margin-bottom: 15px;
}

/* INPUT SEARCH */
input[type="text"] {
    width: 100%;
    padding: 12px 14px;
    border-radius: 8px;
    border: 1px solid var(--border);
    outline: none;
    font-size: 14px;
    transition: 0.2s;
}

input[type="text"]:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(255, 122, 0, 0.15);
}

/* TABLE */
table {
    width: 100%;
    border-collapse: collapse;
    background: white;
    border-radius: 10px;
    overflow: hidden;
}

thead {
    background: var(--primary);
    color: white;
}

th, td {
    padding: 12px;
    text-align: left;
    font-size: 14px;
    border-bottom: 1px solid var(--border);
}

tbody tr:hover {
    background: #fff6ee;
}

/* BUTTON */
button {
    border: none;
    padding: 7px 12px;
    border-radius: 6px;
    font-size: 13px;
    cursor: pointer;
    transition: 0.2s;
}

button:hover {
    transform: scale(1.05);
}

button:first-child {
    background: var(--secondary);
    color: white;
}

button:last-child {
    background: #e74c3c;
    color: white;
}

/* RESPONSIVE */
@media (max-width: 768px) {
    th, td {
        font-size: 12px;
        padding: 10px;
    }

    .hero h1 {
        font-size: 20px;
    }
}