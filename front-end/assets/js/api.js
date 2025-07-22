const API_BASE_URL = 'http://127.0.0.1:8000';

async function callApi(endpoint, method = 'GET', data = null) {
    const token = localStorage.getItem('access_token');
    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method: method,
        headers: headers,
    };

    if (data) {
        config.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Something went wrong');
        }
        return await response.json();
    } catch (error) {
        console.error(`API call to ${endpoint} failed:`, error);
        throw error;
    }
}

// User API calls
async function createUser(username, password) {
    return callApi('/users/', 'POST', { username, password });
}

async function getUsers() {
    return callApi('/admin/users/'); // Assuming an admin endpoint for listing users
}

async function updateUser(userId, userData) {
    return callApi(`/admin/users/${userId}`, 'PUT', userData);
}

async function deleteUser(userId) {
    return callApi(`/admin/users/${userId}`, 'DELETE');
}

// Role API calls
async function createRole(name) {
    return callApi('/roles/', 'POST', { name });
}

async function getRoles() {
    return callApi('/roles/');
}

async function assignRoleToUser(userId, roleId) {
    return callApi(`/admin/users/${userId}/roles/${roleId}`, 'POST');
}

// Permission API calls
async function createPermission(name) {
    return callApi('/permissions/', 'POST', { name });
}

async function getPermissions() {
    return callApi('/permissions/');
}

async function addPermissionOverride(userId, permissionId) {
    return callApi(`/admin/users/${userId}/permissions/${permissionId}/add`, 'POST');
}

async function revokePermissionOverride(userId, permissionId) {
    return callApi(`/admin/users/${userId}/permissions/${permissionId}/revoke`, 'POST');
}

// Audit Log API calls
async function getAuditLogs() {
    return callApi('/audit_logs/');
}
