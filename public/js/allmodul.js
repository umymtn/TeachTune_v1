document.addEventListener("DOMContentLoaded", async () => {
  loadSidebar();

  try {
    const gururesponse = await fetch("/api/data-guru");
    if (!gururesponse.ok) {
      throw new Error("Failed to fetch data");
    }
    const data1 = await gururesponse.json();
    document.getElementById("guru-name").innerText = data1.Nama_Lengkap; // Assuming data1 is an array
  } catch (error) {
    console.error("Error fetching modul ajar:", error);
  }

  await fetchAndDisplayModulAjar();

  async function fetchAndDisplayModulAjar() {
    const response = await fetch("/api/allmodul");
    if (!response.ok) {
      throw new Error("Failed to fetch modul ajar");
    }
    const modulAjar = await response.json();
    console.log(modulAjar);
    const tableBody = document.getElementById("modulAjarTableBody");
    tableBody.innerHTML = ""; // Clear existing table data

    modulAjar.forEach((item) => {
      const row = document.createElement("tr");

      let badgeClass = "bg-secondary"; // Default badge class
      switch (item.status) {
        case "Diajukan":
          badgeClass = "bg-warning text-dark";
          break;
        case "Diverifikasi":
          badgeClass = "bg-primary";
          break;
        case "Divalidasi":
          badgeClass = "bg-success";
          break;
        case "Ditolak":
          badgeClass = "bg-danger";
          break;
      }

      row.innerHTML = `
              <td style="font-size: 15px;"><span class="badge ${badgeClass}" style="border-radius: 3px;">${item.status}</span></td>
              <td>${item.id_mapel}</td>
              <td>${item.nama_kelas}</td>
              <td>${item.Bab}</td>
              <td>${item.judul}</td>
              <td>${item.formatted_date}</td>
              <td>${item.JP}</td>
              <td>${item.metode}</td>
              <td style="width:50px;">
              <a href="${item.url_file}" class="btn btn-success btn-sm" style="width: 100%;"><i class="fa-regular fa-file-pdf"></i></a>
              </td>
            `;

      tableBody.appendChild(row);
    });
  }
});
