document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("/api/data-guru");
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    document.getElementById("guru-name").innerText = data.Nama_Lengkap;

    document.querySelector(".form-control-plaintext.nip").textContent = `: ${data.NIP}`;
    document.querySelector(".form-control-plaintext.nama").textContent = `: ${data.Nama_Lengkap}`;
    document.querySelector(".form-control-plaintext.pangkat").textContent = `: ${data.Pangkat_Gol}`;
    document.querySelector(".form-control-plaintext.jabatan").textContent = `: ${data.Jabatan}`;
    document.querySelector(".form-control-plaintext.mulai").textContent = `: ${data.Mulai_Kerja}`;
    document.querySelector(".form-control-plaintext.sejak").textContent = `: ${data.Di_Sini_Sejak}`;
    document.querySelector(".form-control-plaintext.nrg").textContent = `: ${data.NRG}`;
    document.querySelector(".form-control-plaintext.nuptk").textContent = `: ${data.NUPTK}`;
    document.querySelector(".form-control-plaintext.status").textContent = `: ${data.Status_Kepegawaian}`;
    document.querySelector(".form-control-plaintext.tl").textContent = `: ${data.Tempat_Lahir}`;
    document.querySelector(".form-control-plaintext.tgl").textContent = `: ${data.Tanggal_Lahir}`;
    document.querySelector(".form-control-plaintext.agama").textContent = `: ${data.Agama}`;
    document.querySelector(".form-control-plaintext.jk").textContent = `: ${data.Jenis_Kelamin}`;
    document.querySelector(".form-control-plaintext.wn").textContent = `: ${data.Warga_Negara}`;
    document.querySelector(".form-control-plaintext.npwp").textContent = `: ${data.NPWP}`;
    document.querySelector(".form-control-plaintext.nomor").textContent = `: ${data.No_Telp}`;
    document.querySelector(".form-control-plaintext.email").textContent = `: ${data.Email}`;
    document.querySelector(".form-control-plaintext.alamat").textContent = `: ${data.Alamat}`;
    document.querySelector(".form-control-plaintext.pend").textContent = `: ${data.Pendidikan}`;
    document.querySelector(".form-control-plaintext.ijazah").textContent = `: ${data.Tahun_Ijazah}`;

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
