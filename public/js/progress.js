document.addEventListener("DOMContentLoaded", async () => {
  loadSidebar();
  try {
    const gururesponse = await fetch("/api/data-guru");
    if (!gururesponse.ok) {
      throw new Error("Failed to fetch data");
    }
    const data1 = await gururesponse.json();
    document.getElementById("guru-name").innerText = data1.Nama_Lengkap;

    // Fetch tingkat from ruang_kelas
    const tingkatResponse = await fetch(`/api/distinct_tingkat`);
    if (!tingkatResponse.ok) {
      throw new Error("Failed to fetch tingkat data");
    }
    const tingkatData = await tingkatResponse.json();

    // Fetch all mapel
    const mapelResponse = await fetch(`/api/all_mapel`);
    if (!mapelResponse.ok) {
      throw new Error("Failed to fetch mapel data");
    }
    const mapelData = await mapelResponse.json();

    // Fetch all progress data
    const progressResponse = await fetch(`/api/progress`);
    if (!progressResponse.ok) {
      throw new Error("Failed to fetch progress data");
    }
    const progressData = await progressResponse.json();

    const kelasTabs = document.getElementById("kelasTabs");
    const kelasTabsContent = document.getElementById("kelasTabsContent");

    tingkatData.forEach((tingkat, index) => {
      // Create tab
      const tab = document.createElement("li");
      tab.classList.add("nav-item");
      tab.innerHTML = `
        <a class="nav-link ${index === 0 ? "active" : ""}" id="kelas-${tingkat}-tab" data-bs-toggle="tab" href="#kelas-${tingkat}" role="tab" aria-controls="kelas-${tingkat}" aria-selected="${index === 0}">Kelas ${tingkat}</a>
      `;
      kelasTabs.appendChild(tab);

      // Create tab pane
      const tabPane = document.createElement("div");
      tabPane.classList.add("tab-pane", "fade", "mt-4");
      tabPane.id = `kelas-${tingkat}`;
      tabPane.role = "tabpanel";
      tabPane.ariaLabelledby = `kelas-${tingkat}-tab`;

      // Create cards for each mapel
      mapelData.forEach((mapel) => {
        const card = document.createElement("div");
        card.classList.add("card", "mt-2");
        card.innerHTML = `
          <div class="card-body">
            <h5 class="card-title">${mapel.nama_mapel}</h5>
            <div class="progress-bars" id="progress-bars-${tingkat}-${mapel.id_mapel}">
              <!-- Progress bars will be dynamically inserted here -->
            </div>
          </div>
        `;
        tabPane.appendChild(card);
      });

      kelasTabsContent.appendChild(tabPane);
    });

    // Fetch and display progress data
    await fetchAndDisplayProgress(progressData, tingkatData, mapelData);
  } catch (error) {
    console.error("Error:", error);
  }
});

async function fetchAndDisplayProgress(progressData, tingkatData, mapelData) {
  try {
    const kelasResponse = await fetch(`/api/all_kelas`);
    if (!kelasResponse.ok) {
      throw new Error("Failed to fetch kelas data");
    }
    const kelasData = await kelasResponse.json();

    tingkatData.forEach((tingkat) => {
      mapelData.forEach((mapel) => {
        const kelasForTingkat = kelasData.kelas.filter((kelas) => kelas.tingkat === tingkat);
        kelasForTingkat.forEach((kelas) => {
          const progressBarContainer = document.getElementById(`progress-bars-${tingkat}-${mapel.id_mapel}`);
          if (progressBarContainer) {
            const title = document.createElement("div");
            title.style.marginBottom = "5px"; // Add some space below the title
            title.textContent = kelas.nama_kelas;
            progressBarContainer.appendChild(title);

            const barContainer = document.createElement("div");
            barContainer.id = `progress-bar-${mapel.id_mapel}-${kelas.nama_kelas}`;
            barContainer.style.marginBottom = "20px"; // Increase margin to avoid overlap
            progressBarContainer.appendChild(barContainer);

            const progressItem = progressData.find((data) => data.id_mapel === mapel.id_mapel && data.nama_kelas === kelas.nama_kelas);

            const bar = new ProgressBar.Line(barContainer, {
              strokeWidth: 1,
              easing: "easeInOut",
              duration: 1400,
              color: "#FFEA82",
              trailColor: "#eee",
              trailWidth: 1,
              svgStyle: { width: "100%", height: "100%" },
              text: {
                style: {
                  color: "#999",
                  right: "0",
                  padding: 0,
                  margin: 0,
                  transform: null,
                },
                autoStyleContainer: false,
              },
              from: { color: "#FFEA82" },
              to: { color: "#ED6A5A" },
              step: (state, bar) => {
                bar.setText(`${Math.round(bar.value() * 100)} %`);
              },
            });
            const progressValue = progressItem ? progressItem.progress_percentage / 100 : 0;
            bar.animate(progressValue);
          }
        });
      });
    });
  } catch (error) {
    console.error("Error fetching progress:", error);
  }
}
