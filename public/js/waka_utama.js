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

window.onload = async () => {
  try {
    const gururesponse = await fetch("/api/data-guru");
    if (!gururesponse.ok) {
      throw new Error("Failed to fetch data");
    }
    const data1 = await gururesponse.json();
    document.getElementById("guru-name").innerText = data1.Nama_Lengkap;

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
    console.error("Error setting up logout button:", error);
  }

  // Declare variables in the global scope
  currentMonth = new Date().getMonth();
  currentYear = new Date().getFullYear();
  renderCalendar(currentMonth, currentYear);

  // Add event listeners for calendar navigation buttons
  document.getElementById("prev-month").addEventListener("click", showPreviousMonth);
  document.getElementById("next-month").addEventListener("click", showNextMonth);
};
