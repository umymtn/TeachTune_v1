google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(drawCharts);

function drawCharts() {
  drawStudentAttendanceChart();
  drawTeacherAttendanceChart();
}

function drawStudentAttendanceChart() {
  var data = google.visualization.arrayToDataTable([
    ["Kehadiran", "Total"],
    ["Hadir", 345],
    ["Sakit", 8],
    ["Izin", 5],
    ["Alpha", 3],
  ]);

  var options = {
    is3D: true,
    backgroundColor: "transparent",
    chartArea: { left: 70, top: 10, width: "130%", height: "100%" },
  };

  var chart = new google.visualization.PieChart(document.getElementById("studentAttendanceChart"));
  chart.draw(data, options);
}

function drawTeacherAttendanceChart() {
  var data = google.visualization.arrayToDataTable([
    ["Kehadiran", "Total"],
    ["Hadir", 32],
    ["Sakit", 2],
    ["Izin", 2],
    ["Alpha", 0],
  ]);

  var options = {
    is3D: true,
    backgroundColor: "transparent",
    chartArea: { left: 70, top: 10, width: "100%", height: "100%" },
  };

  var chart = new google.visualization.PieChart(document.getElementById("teacherAttendanceChart"));
  chart.draw(data, options);
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("/api/data-guru");
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    console.log(data);
    document.getElementById("guru-name").innerText = data.Nama_Lengkap;

    const totalSiswa = await fetch("/api/totalsiswa");
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const dataSiswa = await totalSiswa.json();
    console.log(dataSiswa);
    document.getElementById("total-siswa").innerText = dataSiswa.total_active_siswa;
    document.getElementById("siswa-putra").innerText = dataSiswa.total_active_putra;
    document.getElementById("siswa-putri").innerText = dataSiswa.total_active_putri;

    const totalGuru = await fetch("/api/totalguru");
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const dataGuru = await totalGuru.json();
    console.log(dataGuru);
    document.getElementById("total-guru").innerText = dataGuru.total_active_guru;
    document.getElementById("guru-putra").innerText = dataGuru.total_active_putra;
    document.getElementById("guru-putri").innerText = dataGuru.total_active_putri;

    const totalTervalidasi = await fetch("/api/totaltervalidasi");
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const datamodul = await totalTervalidasi.json();
    console.log(datamodul);
    document.getElementById("total-validasi").innerText = datamodul.total_modul;

    const totalBelumValidasi = await fetch("/api/totalbelumvalidasi");
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const datamoduls = await totalBelumValidasi.json();
    console.log(datamoduls);
    document.getElementById("total-belum").innerText = datamoduls.total_modul;

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
