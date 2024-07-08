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
      option.value = classItem.id_ruangkelas;
      option.textContent = classItem.nama_kelas;
      classDropdown.appendChild(option);
    });

    if (classDropdown.options.length > 0) {
      const initialClassId = classDropdown.options[classDropdown.selectedIndex].value;
      const initialClassName = classDropdown.options[classDropdown.selectedIndex].textContent;
      await fetchAndUpdateCharts(initialClassId, initialClassName);

      classDropdown.addEventListener("change", async () => {
        const selectedClassId = classDropdown.options[classDropdown.selectedIndex].value;
        const selectedClassName = classDropdown.options[classDropdown.selectedIndex].textContent;
        await fetchAndUpdateCharts(selectedClassId, selectedClassName);
      });
    } else {
      console.error("No classes available in the dropdown.");
    }

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

async function fetchAndUpdateCharts(id_rk, className) {
  try {
    const response = await fetch(`/api/nilai/${id_rk}`);

    if (!response.ok) {
      throw new Error("Failed to fetch class data");
    }

    const data = await response.json();
    updateCharts(data.gradesData, data.attendanceActivityData, className);
  } catch (error) {
    console.error("Error fetching or updating charts:", error);
  }
}

function updateCharts(gradesData, attendanceActivityData, className) {
  const gradesLabels = gradesData.map((item) => item.Bab);
  const avg_nilai = gradesData.map((item) => item.avg_nilai);

  const gradesDataConfig = {
    labels: gradesLabels,
    datasets: [
      {
        label: "Rata-Rata Nilai",
        data: avg_nilai,
        backgroundColor: "#FEBB29",
      },
    ],
  };

  const attendanceLabels = attendanceActivityData.map((item) => {
    const date = new Date(item.tanggal);
    return `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  });

  const activeData = attendanceActivityData.map((item) => item.active_count);
  const inactiveData = attendanceActivityData.map((item) => item.inactive_count);
  const presentData = attendanceActivityData.map((item) => item.present_count);
  const absentData = attendanceActivityData.map((item) => item.absent_count);

  const activityDataConfig = {
    labels: attendanceLabels,
    datasets: [
      {
        label: "Aktif",
        data: activeData,
        borderColor: "blue",
        backgroundColor: "blue",
        fill: false,
        tension: 0.3,
      },
      {
        label: "Tidak Aktif",
        data: inactiveData,
        borderColor: "orange",
        backgroundColor: "orange",
        fill: false,
        tension: 0.3,
      },
    ],
  };

  const attendanceDataConfig = {
    labels: attendanceLabels,
    datasets: [
      {
        label: "Hadir",
        data: presentData,
        borderColor: "blue",
        backgroundColor: "blue",
        fill: false,
        tension: 0.3,
      },
      {
        label: "Tidak Hadir",
        data: absentData,
        borderColor: "orange",
        backgroundColor: "orange",
        fill: false,
        tension: 0.3,
      },
    ],
  };

  // Update chart headers
  document.getElementById("activityHeader").innerText = `Grafik Keaktifan Siswa Kelas ${className}`;
  document.getElementById("attendanceHeader").innerText = `Grafik Kehadiran Siswa Kelas ${className}`;
  document.getElementById("gradesHeader").innerText = `Grafik Nilai Siswa Kelas ${className}`;

  if (window.activityChart && typeof window.activityChart.destroy === "function") {
    window.activityChart.destroy();
  }
  window.activityChart = new Chart(document.getElementById("activityChart"), {
    type: "line",
    data: activityDataConfig,
  });

  if (window.attendanceChart && typeof window.attendanceChart.destroy === "function") {
    window.attendanceChart.destroy();
  }
  window.attendanceChart = new Chart(document.getElementById("attendanceChart"), {
    type: "line",
    data: attendanceDataConfig,
  });

  if (window.gradesChart && typeof window.gradesChart.destroy === "function") {
    window.gradesChart.destroy();
  }
  window.gradesChart = new Chart(document.getElementById("gradesChart"), {
    type: "bar",
    data: gradesDataConfig,
    options: {
      maintainAspectRatio: false,
    },
  });
}
