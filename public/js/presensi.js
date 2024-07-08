document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("/api/data-guru");
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data1 = await response.json();
    document.getElementById("guru-name").innerText = data1.Nama_Lengkap;

    const kelasResponse = await fetch("/api/kelas");
    if (!kelasResponse.ok) {
      throw new Error("Failed to fetch class list");
    }

    const kelasData = await kelasResponse.json();
    const classDropdown = document.getElementById("classDropdown");

    kelasData.kelas.forEach((classItem) => {
      const option = document.createElement("option");
      option.value = classItem.tingkat;
      option.textContent = classItem.nama_kelas;
      classDropdown.appendChild(option);
    });

    classDropdown.addEventListener("change", async () => {
      const selectedTingkat = classDropdown.options[classDropdown.selectedIndex].value;
      await fetchAndPopulateMateri(data1.id_mapel, selectedTingkat);
      console.log(selectedTingkat);
    });

    // Initially populate materi for the first class if available
    if (classDropdown.options.length > 0) {
      const initialClassId = classDropdown.options[0].value;
      await fetchAndPopulateMateri(data1.id_mapel, initialClassId);
    }

    document.getElementById("progres-form").addEventListener("submit", async (event) => {
      event.preventDefault();
      const gururesponse = await fetch("/api/data-guru");
      if (!gururesponse.ok) {
        throw new Error("Failed to fetch data");
      }
      const data1 = await gururesponse.json();

      const formData = new FormData(event.target);
      const kelasSelect = document.getElementById("classDropdown");
      const selectedKelas = kelasSelect.options[kelasSelect.selectedIndex].text;
      const babJudulDropdown = document.getElementById("babJudul");
      const selectedBabJudul = babJudulDropdown.options[babJudulDropdown.selectedIndex].value;
      const [Bab, judul] = selectedBabJudul.split("-");
      const id_progres = formData.get("id_progres");

      formData.append("Bab", Bab.trim());
      formData.append("judul", judul.trim());
      formData.append("classDropdownText", selectedKelas); // Ensure this is appended to formData

      try {
        const ajarResponse = await fetch(`/api/ajarId`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_mapel: data1.id_mapel,
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

        const response = await fetch("/api/progres", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        if (response.ok) {
          swal({
            title: "Good job!",
            text: result.message,
            icon: "success",
            button: "OK",
          }).then(() => {
            const modal = bootstrap.Modal.getInstance(document.getElementById("progresModal"));
            modal.hide();
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

    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
      logoutButton.addEventListener("click", (e) => {
        e.preventDefault();
        fetch("/api/logout", {
          method: "POST",
          credentials: "include", // Include credentials to ensure cookies are sent
        })
          .then((response) => {
            if (response.ok) {
              window.location.href = "/login"; // Redirect to the login page or any other page
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
    babJudulDropdown.innerHTML = "";

    materiData.forEach((materi) => {
      const option = document.createElement("option");
      option.value = `${materi.bab}-${materi.judul}`;
      option.textContent = `${materi.bab} - ${materi.judul}`;
      babJudulDropdown.appendChild(option);
    });
  } catch (error) {
    console.error("Error fetching materi:", error);
  }
}
