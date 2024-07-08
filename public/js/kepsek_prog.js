document.addEventListener("DOMContentLoaded", function () {
  const attendanceCtx = document.getElementById("attendanceChart").getContext("2d");
  const attendanceChart = new Chart(attendanceCtx, {
    type: "line",
    data: {
      labels: ["1", "2", "3", "4", "5"],
      datasets: [
        {
          label: "Hadir",
          data: [500, 500, 500, 550, 0],
          borderColor: "blue",
          backgroundColor: "blue",
          borderWidth: 2,
          fill: false,
          tension: 0.1,
        },
        {
          label: "Tidak Hadir",
          data: [10, 20, 15, 10, 0],
          borderColor: "red",
          backgroundColor: "red",
          borderWidth: 2,
          fill: false,
          tension: 0.1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: "Hari",
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Jumlah Siswa",
          },
        },
      },
      plugins: {
        legend: {
          display: true,
          position: "bottom",
        },
      },
    },
  });

  // Bar chart configuration
  const studentCtx = document.getElementById("studentChart").getContext("2d");
  const studentChart = new Chart(studentCtx, {
    type: "bar",
    data: {
      labels: ["2020", "2021", "2022", "2023", "2024"],
      datasets: [
        {
          label: "Siswa Lulus",
          data: [500, 500, 500, 500, 0],
          backgroundColor: "rgba(255, 87, 34, 1)",
          borderColor: "rgba(255, 87, 34, 1)",
          borderWidth: 1,
        },
        {
          label: "Siswa Tidak Lulus",
          data: [0, 1, 2, 0, 0],
          backgroundColor: "rgba(255, 128, 64, 1)",
          borderColor: "rgba(255, 128, 64, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 600,
        },
      },
      plugins: {
        title: {
          display: true,
        },
        legend: {
          position: "right",
          labels: {
            usePointStyle: true,
          },
        },
      },
    },
  });
});

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("/api/data-guru");
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    document.getElementById("guru-name").innerText = data.Nama_Lengkap;

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
