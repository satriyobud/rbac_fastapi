
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
        // If no token, redirect to login page
        window.location.href = 'index.html';
        return;
    }

    // Example: Fetch sensitive report data
    try {
        const sensitiveData = await callApi('/reports/sensitive_data');
        console.log('Sensitive Report Data:', sensitiveData);
        // You can display this data on the dashboard
        const contentDiv = document.querySelector('.container-lg');
        if (contentDiv) {
            const p = document.createElement('p');
            p.textContent = `Protected Data: ${sensitiveData.message}`;
            contentDiv.appendChild(p);
        }
    } catch (error) {
        console.error('Error fetching sensitive data:', error);
        // Handle cases where user doesn't have permission
        const contentDiv = document.querySelector('.container-lg');
        if (contentDiv) {
            const p = document.createElement('p');
            p.textContent = `Could not load protected data: ${error.message}`;
            p.style.color = 'red';
            contentDiv.appendChild(p);
        }
    }
});
