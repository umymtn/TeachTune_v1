document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("/api/data-guru");
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data1 = await response.json();
    document.getElementById("guru-name").innerText = data1.Nama_Lengkap;

    const dataresponse = await fetch("/api/dataguru");
    const dataguru = await dataresponse.json();
    console.log(dataguru);
    const tableBody = document.getElementById("dataguruTableBody");
    let number = 0;

    dataguru.forEach((item) => {
      number++;
      const date = new Date(item.Di_Sini_Sejak);
      const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getFullYear()).slice(-2)}`;

      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${number}</td>
          <td>${item.NIP}</td>
          <td>${item.Nama_Lengkap}</td>
          <td>${item.Pangkat_Gol}</td>
          <td>${item.Jabatan}</td>
          <td>${formattedDate}</td>
          <td>${item.NRG}</td>
          <td>${item.NUPTK}</td>
          <td>${item.Status_Kepegawaian}</td>
          <td>${item.Email}</td>
          <td>${item.No_Telp}</td>
        `;
      tableBody.appendChild(row);
    });

    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
      logoutButton.addEventListener("click", (e) => {
        e.preventDefault();
        fetch("/api/logout", {
          method: "POST",
          credentials: "include",
        })
          .then((response) => {
            if (response.ok) {
              window.location.href = "/login";
            } else {
              console.error("Failed to logout");
            }
          })
          .catch((error) => console.error("Error:", error));
      });
    }
  } catch (error) {
    console.error("Error:", error);
  }
});
