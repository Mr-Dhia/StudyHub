loadFiles();
const uploadBtn = document.getElementById("uploadBtn");
const fileInput = document.getElementById("fileInput");
uploadBtn.addEventListener("click", () => {
    fileInput.click();
});

fileInput.addEventListener("change", async () => {
    const file = fileInput.files[0];

    const formData = new FormData();
    formData.append("file", file);
    const type=document.getElementById("page-tag").textContent;
    const res = await fetch(`http://localhost:3000/auth/upload?type=${type}`, {
        method: "POST",
        body: formData
    });

    const data = await res.json();
    console.log(data);

    loadFiles(); 
});

async function loadFiles() {
    let type=document.getElementById("page-tag").textContent;
    const res = await fetch(`http://localhost:3000/auth/files?type=${type}`);
    const data = await res.json();
    const files=data.files;
    type+="s";
    const grid = document.getElementById("documents-grid");
    grid.innerHTML = "";

    files.forEach(file => {
        const div = document.createElement("div");
        div.classList.add("doc-card");
        
        div.innerHTML = `
    <div class="doc-card">
        <div class="doc-icon">📄</div>
        
        <div class="doc-info">
            <p class="doc-name">${file.originalname}</p>
        </div>

        <a class="doc-open" href="http://localhost:3000/uploads/${type}/${file.filename}" target="_blank">
            Ouvrir
        </a>
    </div>
`;

        grid.appendChild(div);
    });
}

