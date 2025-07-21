document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    const userTableBody = document.getElementById('userTableBody');
    const createUserForm = document.getElementById('createUserForm');
    const newUsernameInput = document.getElementById('newUsername');
    const newPasswordInput = document.getElementById('newPassword');
    const newRoleSelect = document.getElementById('newRole');
    const permissionsChecklistDiv = document.getElementById('permissionsChecklist');

    // Edit User Modal Elements
    const editUserModal = new coreui.Modal(document.getElementById('editUserModal'));
    const editUserIdInput = document.getElementById('editUserId');
    const editUsernameInput = document.getElementById('editUsername');
    const editPasswordInput = document.getElementById('editPassword');
    const editIsActiveCheckbox = document.getElementById('editIsActive');
    const saveUserChangesButton = document.getElementById('saveUserChanges');

    async function fetchUsers() {
        try {
            const users = await getUsers(); // From api.js
            userTableBody.innerHTML = ''; // Clear existing rows
            users.forEach(user => {
                const row = userTableBody.insertRow();
                row.insertCell(0).textContent = user.id;
                row.insertCell(1).textContent = user.username;
                row.insertCell(2).textContent = user.is_active ? 'Active' : 'Inactive';

                const actionsCell = row.insertCell(3);

                const editButton = document.createElement('button');
                editButton.className = 'btn btn-sm btn-info me-2';
                editButton.textContent = 'Edit';
                editButton.addEventListener('click', () => handleEditUser(user));
                actionsCell.appendChild(editButton);

                const deleteButton = document.createElement('button');
                deleteButton.className = 'btn btn-sm btn-danger';
                deleteButton.textContent = user.is_active ? 'Deactivate' : 'Activate';
                deleteButton.addEventListener('click', () => handleDeleteUser(user));
                actionsCell.appendChild(deleteButton);
            });
        } catch (error) {
            console.error('Error fetching users:', error);
            alert('Failed to load users: ' + error.message);
        }
    }

    async function populateRolesDropdown() {
        try {
            const roles = await getRoles(); // From api.js
            newRoleSelect.innerHTML = ''; // Clear existing options
            roles.forEach(role => {
                const option = document.createElement('option');
                option.value = role.id;
                option.textContent = role.name;
                newRoleSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error fetching roles:', error);
            alert('Failed to load roles for dropdown: ' + error.message);
        }
    }

    async function populatePermissionsChecklist() {
        try {
            const permissions = await getPermissions(); // From api.js
            permissionsChecklistDiv.innerHTML = ''; // Clear existing checkboxes
            permissions.forEach(permission => {
                const div = document.createElement('div');
                div.className = 'form-check';

                const input = document.createElement('input');
                input.className = 'form-check-input';
                input.type = 'checkbox';
                input.value = permission.id;
                input.id = `perm-${permission.id}`;
                input.dataset.permissionName = permission.name; // Store name for logging/display

                const label = document.createElement('label');
                label.className = 'form-check-label';
                label.htmlFor = `perm-${permission.id}`;
                label.textContent = permission.name;

                div.appendChild(input);
                div.appendChild(label);
                permissionsChecklistDiv.appendChild(div);
            });
        } catch (error) {
            console.error('Error fetching permissions:', error);
            alert('Failed to load permissions for checklist: ' + error.message);
        }
    }

    async function handleEditUser(user) {
        editUserIdInput.value = user.id;
        editUsernameInput.value = user.username;
        editPasswordInput.value = ''; // Password is not pre-filled for security
        editIsActiveCheckbox.checked = user.is_active;
        editUserModal.show();
    }

    async function handleDeleteUser(user) {
        const action = user.is_active ? 'deactivate' : 'activate';
        if (confirm(`Are you sure you want to ${action} user ${user.username}?`)) {
            try {
                await updateUser(user.id, { is_active: !user.is_active }); // Toggle active status
                alert(`User ${user.username} has been ${action}d.`);
                fetchUsers(); // Refresh the list
            } catch (error) {
                console.error(`Error ${action}ing user:`, error);
                alert(`Failed to ${action} user: ` + error.message);
            }
        }
    }

    if (createUserForm) {
        createUserForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const username = newUsernameInput.value;
            const password = newPasswordInput.value;
            const roleId = newRoleSelect.value;

            // Get selected permissions
            const selectedPermissions = Array.from(permissionsChecklistDiv.querySelectorAll('input[type="checkbox"]:checked'))
                                            .map(checkbox => ({ id: checkbox.value, name: checkbox.dataset.permissionName }));

            try {
                const newUser = await createUser(username, password); // From api.js
                await assignRoleToUser(newUser.id, roleId); // From api.js

                for (const perm of selectedPermissions) {
                    await addPermissionOverride(newUser.id, perm.id);
                    console.log(`Added override for user ${newUser.username}, permission ${perm.name}`);
                }

                alert('User created, role assigned, and permissions overridden successfully!');
                newUsernameInput.value = '';
                newPasswordInput.value = '';
                newRoleSelect.value = ''; // Reset dropdown
                // Uncheck all permissions
                permissionsChecklistDiv.querySelectorAll('input[type="checkbox"]').forEach(checkbox => checkbox.checked = false);
                fetchUsers(); // Refresh the user list
                // Close the modal
                const createUserModal = bootstrap.Modal.getInstance(document.getElementById('createUserModal'));
                if (createUserModal) {
                    createUserModal.hide();
                }
            } catch (error) {
                console.error('Error creating user or assigning role/permissions:', error);
                alert('Failed to create user or assign role/permissions: ' + error.message);
            }
        });
    }

    if (saveUserChangesButton) {
        saveUserChangesButton.addEventListener('click', async () => {
            const userId = editUserIdInput.value;
            const userData = {};
            if (editUsernameInput.value) {
                userData.username = editUsernameInput.value;
            }
            if (editPasswordInput.value) {
                userData.password = editPasswordInput.value;
            }
            userData.is_active = editIsActiveCheckbox.checked;

            try {
                await updateUser(userId, userData);
                alert('User updated successfully!');
                editUserModal.hide();
                fetchUsers(); // Refresh the user list
            } catch (error) {
                console.error('Error updating user:', error);
                alert('Failed to update user: ' + error.message);
            }
        });
    }

    // Initial fetches when the page loads
    fetchUsers();
    populateRolesDropdown();
    populatePermissionsChecklist();
});