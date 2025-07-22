async function loadTemplate(elementId, templatePath) {
    try {
        const response = await fetch(templatePath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const templateContent = await response.text();
        document.getElementById(elementId).innerHTML = templateContent;

        // If the loaded template is the sidebar, add a class to the body
        if (elementId === 'sidebar-placeholder') {
            document.body.classList.add('has-sidebar');
        } else if (elementId === 'header-placeholder') {
            // Initialize logout button after header is loaded
            if (typeof initializeLogoutButton === 'function') {
                initializeLogoutButton();
            }
            if (typeof initColorModes === 'function') {
                initColorModes();
            }
        }
    } catch (error) {
        console.error(`Could not load template from ${templatePath}:`, error);
    }
}

async function loadAllTemplatesAndInitialize() {
    console.log('[TemplateLoader] loadAllTemplatesAndInitialize called.');
    await loadTemplate('sidebar-placeholder', '_sidebar.html');
    await loadTemplate('header-placeholder', '_header.html');
    await loadTemplate('footer-placeholder', '_footer.html');
}