document.addEventListener("DOMContentLoaded", async () => {
  const response = await fetch("/api/data-guru");
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  const data1 = await response.json();
  document.getElementById("guru-name").innerText = data1.Nama_Lengkap;

  const scheduleGrid = document.getElementById("scheduleGrid");
  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];

  days.forEach((day) => {
    const column = document.createElement("div");
    column.className = "day-column";
    const dayHeader = document.createElement("h3");
    dayHeader.innerText = day;
    column.appendChild(dayHeader);
    scheduleGrid.appendChild(column);
  });

  try {
    const response = await fetch("/api/jadwal");
    const schedule = await response.json();

    schedule.forEach((item) => {
      const dayColumn = scheduleGrid.children[days.indexOf(item.hari)];
      const scheduleItem = document.createElement("div");
      scheduleItem.className = "schedule-item";

      const rowNumber = parseInt(item.id_jampel.match(/\d+$/)[0], 10);

      scheduleItem.style.gridRow = `${rowNumber + 1}`;

      scheduleItem.innerHTML = `
            <div class="time">${item.mulai} - ${item.selesai}</div>
            <div class="class">${item.mapel}</div>
            <div class="classroom">${item.kelas}</div>
          `;
      dayColumn.appendChild(scheduleItem);
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
    console.error("Error fetching schedule:", error);
  }
});
