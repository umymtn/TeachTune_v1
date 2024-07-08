document.getElementById("ajukan-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const gururesponse = await fetch("/api/data-guru");
  if (!gururesponse.ok) {
    throw new Error("Failed to fetch data");
  }
  const data1 = await gururesponse.json();

  const formData = new FormData(event.target);
  const kelasSelect = document.getElementById("kelas");
  const selectedKelas = kelasSelect.options[kelasSelect.selectedIndex].text;
  const babJudulDropdown = document.getElementById("babJudul");
  const selectedBabJudul = babJudulDropdown.options[babJudulDropdown.selectedIndex].value;
  const [Bab, judul] = selectedBabJudul.split("-");

  try {
    // Fetch ajarId
    const ajarResponse = await fetch(`/api/ajarId`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_mapel: formData.get("mapel"),
        nip: data1.NIP,
        kelas: selectedKelas,
      }),
    });

    const ajarData = await ajarResponse.json();
    if (!ajarResponse.ok) {
      throw new Error(ajarData.error || "Failed to fetch ajarId");
    }

    const ajarId = ajarData.ajarId;

    // Append ajarId, Bab, and judul to the formData
    formData.append("ajarId", ajarId);
    formData.append("Bab", Bab.trim());
    formData.append("judul", judul.trim());

    const response = await fetch("/api/ajukan", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    if (response.ok) {
      // alert(result.message);
      swal({
        title: "Good job!",
        text: result.message,
        icon: "success",
        button: "OK",
      }).then(() => {
        // Close the modal
        const modal = bootstrap.Modal.getInstance(document.getElementById("tambahModal"));
        modal.hide();
        // Refresh the page
        location.reload();
      });
    } else {
      swal({
        title: "Error!",
        text: result.error,
        icon: "error",
        button: "Try Again",
      });
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    swal({
      title: "Error!",
      text: error.message,
      icon: "error",
      button: "Try Again",
    });
  }
});

async function fetchAndDisplayModulAjar() {
  const response = await fetch("/api/modul_ajar");
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
        <td style="width:90px;">
        <a href="${item.url_file}" class="btn btn-success btn-sm"><i class="fa-regular fa-file-pdf"></i></a>
        <a href="#" class="btn btn-warning btn-sm edit-btn" data-id="${item.id_modul_ajar}" data-item='${JSON.stringify(item)}'><i class="fa-regular fa-pen-to-square"></i></a>
        </td>
      `;

    tableBody.appendChild(row);
  });

  document.querySelectorAll(".edit-btn").forEach((button) => {
    button.addEventListener("click", async (_event) => {
      const id = button.getAttribute("data-id");
      console.log(id);
      try {
        const response = await fetch(`/api/modul_ajar/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch modul ajar by id");
        }
        const item = await response.json();
        openEditModal(item);
      } catch (error) {
        console.error(error.message);
        console.log(error);
      }
    });
  });
}

function openEditModal(item) {
  const modal = new bootstrap.Modal(document.getElementById("editModal"), {
    backdrop: "static",
    keyboard: false,
  });

  document.getElementById("edit_id_modul_ajar").value = item.id_modul_ajar;
  document.getElementById("edit_mapel").value = item.id_mapel;
  document.getElementById("edit_kelas").value = item.nama_kelas;
  document.getElementById("edit_babJudul").value = `${item.Bab}-${item.judul}`;

  if (item.formatted_date) {
    const formattedDate = item.formatted_date.split("/").reverse().join("-");
    document.getElementById("edit_tanggal").value = formattedDate;
  } else {
    document.getElementById("edit_tanggal").value = "";
  }

  document.getElementById("edit_JP").value = item.JP;
  document.getElementById("edit_metode").value = item.metode;

  const existingFileInfo = document.getElementById("existing-file-info");
  if (item.url_file) {
    const fileName = item.url_file.split("/").pop();
    existingFileInfo.textContent = `File yang diunggah sebelumnya: ${fileName}`;
    document.getElementById("existing_file").value = item.url_file; // Set the hidden input
  } else {
    existingFileInfo.textContent = "";
    document.getElementById("existing_file").value = "";
  }

  modal.show();
}

document.addEventListener("DOMContentLoaded", async () => {
  loadSidebar();

  try {
    const gururesponse = await fetch("/api/data-guru");
    if (!gururesponse.ok) {
      throw new Error("Failed to fetch data");
    }
    const data1 = await gururesponse.json();
    document.getElementById("guru-name").innerText = data1.Nama_Lengkap;

    const mapelSelect = document.getElementById("mapel");
    const kelasSelect = document.getElementById("kelas");

    const mapelDropdown = document.getElementById("edit_mapel");
    const kelasDropdown = document.getElementById("edit_kelas");

    const mapelResponse = await fetch("/api/mapel");
    const mapelData = await mapelResponse.json();
    mapelData.forEach((mapel) => {
      const option = document.createElement("option");
      option.value = mapel.id_mapel;
      option.text = mapel.id_mapel;
      mapelSelect.appendChild(option);
    });

    mapelData.forEach((mapel) => {
      const option = document.createElement("option");
      option.value = mapel.id_mapel;
      option.text = mapel.id_mapel;
      mapelDropdown.appendChild(option);
    });

    const kelasResponse = await fetch("/api/kelas");
    const kelasData = await kelasResponse.json();
    kelasData.kelas.forEach((kelas) => {
      const option = document.createElement("option");
      option.value = kelas.tingkat;
      option.text = kelas.nama_kelas;
      kelasSelect.appendChild(option);
    });

    kelasData.kelas.forEach((kelas) => {
      const option = document.createElement("option");
      option.value = kelas.tingkat;
      option.text = kelas.nama_kelas;
      kelasDropdown.appendChild(option);
    });

    kelasSelect.addEventListener("change", async () => {
      const selectedTingkat = kelasSelect.options[kelasSelect.selectedIndex].value;
      await fetchAndPopulateMateri(data1.id_mapel, selectedTingkat);
      console.log(selectedTingkat);
    });

    // Initially populate materi for the first class if available
    if (kelasSelect.options.length > 0) {
      const initialClassId = kelasSelect.options[0].value;
      await fetchAndPopulateMateri(data1.id_mapel, initialClassId);
    }

    kelasDropdown.addEventListener("change", async () => {
      const selectedtingkat = kelasDropdown.options[kelasDropdown.selectedIndex].value;
      await fetchAndPopulateMateri(data1.id_mapel, selectedtingkat);
      console.log(selectedtingkat);
    });

    // Initially populate materi for the first class if available
    if (kelasDropdown.options.length > 0) {
      const initialkelasId = kelasDropdown.options[0].value;
      await fetchAndPopulateMateri(data1.id_mapel, initialkelasId);
    }
  } catch (error) {
    console.error("Error fetching modul ajar:", error);
  }

  await fetchAndDisplayModulAjar();

  // Event listener to submit button in edit modal
  document.getElementById("edit-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const gururesponse = await fetch("/api/data-guru");
    if (!gururesponse.ok) {
      throw new Error("Failed to fetch data");
    }
    const data1 = await gururesponse.json();

    const formData = new FormData(event.target);
    const kelasOption = document.getElementById("edit_kelas");
    const selectedKelas = kelasOption.options[kelasOption.selectedIndex].text;
    const babJudulDropdown = document.getElementById("edit_babJudul");
    const selectedBabJudul = babJudulDropdown.options[babJudulDropdown.selectedIndex].value;
    const [Bab, judul] = selectedBabJudul.split("-");

    const ajarResponse = await fetch(`/api/ajarId`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_mapel: formData.get("mapel"),
        nip: data1.NIP,
        kelas: selectedKelas,
      }),
    });

    const ajarData = await ajarResponse.json();
    if (!ajarResponse.ok) {
      throw new Error(ajarData.error || "Failed to fetch ajarId");
    }

    const ajarId = ajarData.ajarId;

    formData.append("ajarId", ajarId);
    formData.append("Bab", Bab.trim());
    formData.append("judul", judul.trim());

    try {
      const response = await fetch("/api/update-modul-ajar", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      console.log(result);
      if (response.ok) {
        swal({
          title: "Good job!",
          text: result.message,
          icon: "success",
          button: "OK",
        }).then(async () => {
          const modal = bootstrap.Modal.getInstance(document.getElementById("editModal"));
          modal.hide();
          await fetchAndDisplayModulAjar(); // Refresh table data
        });
      } else {
        swal({
          title: "Error!",
          text: result.error,
          icon: "error",
          button: "Try Again",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      swal({
        title: "Error!",
        text: error.message,
        icon: "error",
        button: "Try Again",
      });
    }
  });
});
async function fetchAndPopulateMateri(Id_mapel, tingkat) {
  try {
    const response = await fetch(`/api/materi?Id_mapel=${Id_mapel}&&tingkat=${tingkat}`);
    console.log(response);
    if (!response.ok) {
      throw new Error("Failed to fetch materi");
    }

    const materiData = await response.json();
    console.log(materiData);
    const babJudulDropdown = document.getElementById("babJudul");
    const babJudulOptions = document.getElementById("edit_babJudul");
    babJudulDropdown.innerHTML = "";
    babJudulOptions.innerHTML = "";

    materiData.forEach((materi) => {
      const option = document.createElement("option");
      option.value = `${materi.bab}-${materi.judul}`;
      option.textContent = `${materi.bab} - ${materi.judul}`;
      babJudulDropdown.appendChild(option);
    });

    materiData.forEach((materi) => {
      const option = document.createElement("option");
      option.value = `${materi.bab}-${materi.judul}`;
      option.textContent = `${materi.bab} - ${materi.judul}`;
      babJudulOptions.appendChild(option);
    });
  } catch (error) {
    console.error("Error fetching materi:", error);
  }
}
