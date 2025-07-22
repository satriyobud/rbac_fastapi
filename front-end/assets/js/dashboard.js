
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('access_token');

  const API_BASE_URL = 'http://127.0.0.1:8000';

  if (token) {
    fetch(`${API_BASE_URL}/api/dashboard/total-users`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      console.log('[Dashboard] Total users response status:', response.status);
      if (response.status === 403) {
        document.getElementById('total-users-card').innerText = 'Permission Denied';
        throw new Error('Permission Denied');
      }
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('[Dashboard] Total users data:', data);
      document.getElementById('total-users-card').innerText = data.total_users;
    })
    .catch(error => {
      console.error('Error fetching total users:', error);
      if (error.message !== 'Permission Denied') {
        document.getElementById('total-users-card').innerText = 'Error';
      }
    });

    console.log('[Dashboard] Fetching total permissions...');
    fetch(`${API_BASE_URL}/api/dashboard/total-permissions`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      console.log('[Dashboard] Total permissions response status:', response.status);
      if (response.status === 403) {
        document.getElementById('total-permissions-card').innerText = 'Permission Denied';
        throw new Error('Permission Denied');
      }
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('[Dashboard] Total permissions data:', data);
      document.getElementById('total-permissions-card').innerText = data.total_permissions;
    })
    .catch(error => {
      console.error('Error fetching total permissions:', error);
      if (error.message !== 'Permission Denied') {
        document.getElementById('total-permissions-card').innerText = 'Error';
      }
    });
  }
});
