document.getElementById('register-form').addEventListener('submit', function(event) {
    // Prevent default form submission
    event.preventDefault();
    
    // Basic validation
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const role = document.getElementById('role').value.trim();

    if (!firstName || !lastName || !email || !password || !role) {
        alert('Semua bidang wajib diisi.');
        return;
    }

    if (password.length < 6) {
        alert('Kata sandi harus memiliki minimal 6 karakter.');
        return;
    }

    // Here you can add AJAX request to send form data to the server

    alert('Form submitted successfully!');
});
