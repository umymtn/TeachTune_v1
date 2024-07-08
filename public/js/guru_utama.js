async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch data from ${url}:`, error);
    return null;
  }
}

function createCanvas(containerId, chartIdPrefix, gaugeIdPrefix, count, headers) {
  const container = document.getElementById(containerId);
  container.innerHTML = ""; // Menghapus elemen sebelumnya

  for (let i = 0; i < count; i++) {
    const row = document.createElement("div");
    row.className = "row grafik";

    // Buat kolom untuk line chart
    const col1 = document.createElement("div");
    col1.className = "col-md-6 card chart-container";
    const header1 = document.createElement("h2");
    header1.textContent = `${headers[i].headerText1} ${headers[i].nama_kelas}`;
    col1.appendChild(header1);
    const canvas1 = document.createElement("canvas");
    canvas1.id = `${chartIdPrefix}${i + 1}`;
    col1.appendChild(canvas1);
    row.appendChild(col1);

    // Buat kolom untuk gauge chart
    const col2 = document.createElement("div");
    col2.className = "col-md-6 card gauge-container";
    const header2 = document.createElement("h2");
    header2.textContent = `${headers[i].headerText2} ${headers[i].nama_kelas}`;
    col2.appendChild(header2);
    const canvas2 = document.createElement("canvas");
    canvas2.id = `${gaugeIdPrefix}${i + 1}`;
    col2.appendChild(canvas2);
    row.appendChild(col2);

    container.appendChild(row);
  }
}

// Fungsi untuk membuat grafik garis
function createLineChart(ctx, labels, data, label, color) {
  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: label,
          data: data,
          borderColor: color,
          pointBackgroundColor: "white",
          pointBorderColor: color,
          pointHoverBackgroundColor: color,
          pointHoverBorderColor: "white",
          pointRadius: 5,
          pointHoverRadius: 7,
          tension: 0.3,
          fill: false,
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: false,
          min: 0,
          max: 100,
          grid: {
            color: "rgba(200, 200, 200, 0.2)",
          },
          title: {
            display: true,
            text: "Rata-Rata",
            font: {
              size: 12,
              weight: "bold",
            },
          },
        },
        x: {
          grid: {
            display: false,
          },
          title: {
            display: true,
            text: "Bab",
            font: {
              size: 11,
              weight: "bold",
            },
          },
        },
      },
      plugins: {
        legend: {
          display: true,
          position: "top",
          labels: {
            font: {
              size: 12,
            },
          },
        },
        tooltip: {
          enabled: true,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          titleFont: {
            size: 14,
            weight: "bold",
          },
          bodyFont: {
            size: 12,
          },
          callbacks: {
            label: function (context) {
              let label = context.dataset.label || "";
              if (label) {
                label += ": ";
              }
              if (context.parsed.y !== null) {
                label += context.parsed.y;
              }
              return label;
            },
          },
        },
      },
    },
  });
}

// Fungsi untuk membuat grafik gauge
function createGaugeChart(ctx, value, color) {
  const roundedValue = parseFloat(value).toFixed(2);

  new Chart(ctx, {
    type: "doughnut",
    data: {
      datasets: [
        {
          data: [roundedValue, 100 - roundedValue],
          backgroundColor: [color, "#e9ecef"],
          borderWidth: 0,
        },
      ],
      labels: ["Materi", "Pembelajaran"],
    },
    options: {
      responsive: true,
      cutout: "70%",
      plugins: {
        doughnutlabel: {
          labels: [
            {
              text: `${roundedValue}%`,
              font: {
                size: "20",
                weight: "bold",
              },
              color: color,
            },
          ],
        },
      },
      rotation: -90,
      circumference: 180,
    },
  });
}

// Fungsi untuk merender kalender
function renderCalendar(month, year) {
  const calendarBody = document.getElementById("calendar-body");
  calendarBody.innerHTML = ""; // Clear previous cells

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let date = 1;
  for (let i = 0; i < 6; i++) {
    const row = document.createElement("tr");
    for (let j = 0; j < 7; j++) {
      const cell = document.createElement("td");
      if (i === 0 && j < firstDay) {
        const cellText = document.createTextNode("");
        cell.appendChild(cellText);
      } else if (date > daysInMonth) {
        break;
      } else {
        const cellText = document.createTextNode(date);
        cell.appendChild(cellText);
        if (date === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) {
          cell.classList.add("today");
        }
        date++;
      }
      row.appendChild(cell);
    }
    calendarBody.appendChild(row);
  }

  // Update the calendar header
  const calendarHeader = document.querySelector(".calendar-header h2");
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  calendarHeader.textContent = `${monthNames[month]} ${year}`;
}

// Fungsi untuk menampilkan bulan sebelumnya di kalender
function showPreviousMonth() {
  if (currentMonth === 0) {
    currentMonth = 11;
    currentYear--;
  } else {
    currentMonth--;
  }
  renderCalendar(currentMonth, currentYear);
}

// Fungsi untuk menampilkan bulan berikutnya di kalender
function showNextMonth() {
  if (currentMonth === 11) {
    currentMonth = 0;
    currentYear++;
  } else {
    currentMonth++;
  }
  renderCalendar(currentMonth, currentYear);
}

// Fungsi utama yang akan dijalankan saat halaman dimuat
window.onload = async () => {
  try {
    const trendKemajuanData = await fetchData("/api/kemajuan/trend-kemajuan");
    const progresData = await fetchData("/api/kemajuan/progres");

    if (!trendKemajuanData || !progresData) {
      throw new Error("One or more data fetches failed");
    }

    const { data: trendKemajuan, guruName } = trendKemajuanData;

    // Group data by ruangkelas
    const trendDataByRuangKelas = trendKemajuan.reduce((acc, item) => {
      if (!acc[item.id_ruangkelas]) {
        acc[item.id_ruangkelas] = [];
      }
      acc[item.id_ruangkelas].push(item);
      return acc;
    }, {});

    const progresDataByRuangKelas = progresData.reduce((acc, item) => {
      acc[item.id_ruangkelas] = item.progress_percentage;
      return acc;
    }, {});

    // Update nama guru
    document.getElementById("guru-name").innerText = guruName;

    // Buat elemen canvas secara dinamis untuk line chart dan gauge chart
    const headers = Object.keys(trendDataByRuangKelas).map((id_ruangkelas) => {
      const kelas = trendDataByRuangKelas[id_ruangkelas];
      const namaKelas = kelas[0].nama_kelas;
      return {
        headerText1: `Grafik Tren Kemajuan Siswa Kelas`,
        headerText2: `Progres Pengajaran Kelas`,
        nama_kelas: namaKelas,
      };
    });

    const numClasses = headers.length;
    createCanvas("grafik-container", "chart", "gaugeChart", numClasses, headers);

    // Render chart untuk setiap kelas
    let classIndex = 0;
    for (const id_ruangkelas in trendDataByRuangKelas) {
      const kelas = trendDataByRuangKelas[id_ruangkelas];
      const labels = kelas.map((item) => item.Bab);
      const overallData = kelas.map((item) => item.overall_avg);

      const ctx = document.getElementById(`chart${classIndex + 1}`).getContext("2d");
      createLineChart(ctx, labels, overallData, `Rata-rata`, "blue");

      const gaugeCtx = document.getElementById(`gaugeChart${classIndex + 1}`).getContext("2d");
      createGaugeChart(gaugeCtx, progresDataByRuangKelas[id_ruangkelas], "orange");
      classIndex++;

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
    }
  } catch (error) {
    console.error("Error fetching statistik data:", error);
  }

  // Render kalender
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  renderCalendar(currentMonth, currentYear);

  // Tambahkan event listener untuk tombol navigasi bulan
  document.getElementById("prev-month").addEventListener("click", showPreviousMonth);
  document.getElementById("next-month").addEventListener("click", showNextMonth);
};
