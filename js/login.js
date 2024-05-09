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
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        if (data.token) {
            console.log(data.token);
            localStorage.setItem('token', data.token);  // Save the JWT token to local storage
            alert('Login successful!');
            window.location.href = 'dashboard.html';  // Redirect to the dashboard page
        } else {
            throw new Error('Token not received');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error logging in. Please try again later.');
    });
});
