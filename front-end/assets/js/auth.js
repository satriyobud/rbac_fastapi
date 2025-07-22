
document.addEventListener('DOMContentLoaded', () => {
  const loginButton = document.getElementById('loginButton');
  if (loginButton) {
    loginButton.addEventListener('click', async () => {
      const username = document.getElementById('usernameInput').value;
      const password = document.getElementById('passwordInput').value;

      try {
        const response = await fetch('/api/auth/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            username: username,
            password: password,
          }),
        });

        if (!response.ok) {
          throw new Error('Login failed');
        }

        const data = await response.json();
        console.log('Login response:', data);
        localStorage.setItem('access_token', data.access_token);
        window.location.href = 'main_dashboard.html';
      } catch (error) {
        console.error('Login error:', error);
        // You can add some user-facing error message here
      }
    });
  }

  const passwordInput = document.getElementById('passwordInput');
  if (passwordInput) {
    passwordInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault(); // Prevent the default action (e.g., form submission)
        loginButton.click(); // Simulate a click on the login button
      }
    });
  }
});
