document.addEventListener('DOMContentLoaded', () => {
    const userNameSpan = document.getElementById('user-name');
    // Suppose the user name is stored in localStorage
    const userName = localStorage.getItem('userName');
    userNameSpan.textContent = userName || 'User';
});
