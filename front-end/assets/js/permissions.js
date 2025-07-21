
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    const permissionTableBody = document.getElementById('permissionTableBody');
    const createPermissionForm = document.getElementById('createPermissionForm');
    const newPermissionNameInput = document.getElementById('newPermissionName');

    async function fetchPermissions() {
        try {
            const permissions = await getPermissions(); // From api.js
            permissionTableBody.innerHTML = ''; // Clear existing rows
            permissions.forEach(permission => {
                const row = permissionTableBody.insertRow();
                row.insertCell(0).textContent = permission.id;
                row.insertCell(1).textContent = permission.name;
            });
        } catch (error) {
            console.error('Error fetching permissions:', error);
            alert('Failed to load permissions: ' + error.message);
        }
    }

    if (createPermissionForm) {
        createPermissionForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const permissionName = newPermissionNameInput.value;

            try {
                await createPermission(permissionName); // From api.js
                alert('Permission created successfully!');
                newPermissionNameInput.value = '';
                fetchPermissions(); // Refresh the permission list
                // Close the modal
                const createPermissionModal = bootstrap.Modal.getInstance(document.getElementById('createPermissionModal'));
                if (createPermissionModal) {
                    createPermissionModal.hide();
                }
            } catch (error) {
                console.error('Error creating permission:', error);
                alert('Failed to create permission: ' + error.message);
            }
        });
    }

    // Initial fetch of permissions when the page loads
    fetchPermissions();
});
