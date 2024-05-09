document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.token) {
            localStorage.setItem('token', data.token);  // Save token to local storage
            window.location.href = 'dashboard.html';    // Redirect to the dashboard
        } else {
            throw new Error('Failed to receive token');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error logging in. Please try again later.');
    });
});
