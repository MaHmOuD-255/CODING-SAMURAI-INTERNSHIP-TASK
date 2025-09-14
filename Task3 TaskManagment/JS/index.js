document.getElementById('footerYear').textContent = new Date().getFullYear();

// dark mode toggle
        // Night mode toggle logic
        const darkModeToggle = document.getElementById('darkModeToggle');
        const darkModeIcon = document.getElementById('darkModeIcon');
        const root = document.documentElement;
        // Helper: set dark mode
        function setDarkMode(on) {
            if (on) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            if (darkModeIcon) {
                    darkModeIcon.innerHTML = '<circle cx="12" cy="12" r="5"></circle><path d="M12 1v2"></path><path d="M12 21v2"></path><path d="M4.22 4.22l1.42 1.42"></path><path d="M18.36 18.36l1.42 1.42"></path><path d="M1 12h2"></path><path d="M21 12h2"></path><path d="M4.22 19.78l1.42-1.42"></path><path d="M18.36 5.64l1.42-1.42"></path>';

            }
            } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            if (darkModeIcon) {
                darkModeIcon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 1 0 9.79 9.79z"></path>';

            }
            }
        }
        // On page load or when changing themes

        (function() {
            const theme = localStorage.getItem('theme');
            if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setDarkMode(true);
            } else {
            setDarkMode(false);
            }
        })();
        // Toggle on click
        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', () => {
            const isDark = root.classList.contains('dark');
            setDarkMode(!isDark);
            });
        }
// Main IIFE for Task Management
    (function () {
    'use strict';

    /* -------------------- Helpers -------------------- */
    function el(selector, parent = document) { return parent.querySelector(selector); }
    function els(selector, parent = document) { return Array.from(parent.querySelectorAll(selector)); }
    function safeGet(id) { return document.getElementById(id); }

    /* -------------------- Mobile Filter Toggle -------------------- */
    const mobileFilterBtn = safeGet('mobileFilterBtn');
    const mobileFilterMenu = safeGet('mobileFilterMenu');
    if (mobileFilterBtn && mobileFilterMenu) {
        mobileFilterBtn.addEventListener('click', () => {
        mobileFilterMenu.classList.toggle('hidden');
        });
    }

    /* -------------------- Drag to Delete (keeps as-is but safe) -------------------- */
    let draggedTaskId = null;
    let dragGhost = null;
    let dragOffset = { x: 0, y: 0 };

    window.onDragStart = function (event, taskId) {
        draggedTaskId = taskId;
        const card = document.getElementById('task-' + taskId);
        if (!card) return;

        dragGhost = card.cloneNode(true);
        dragGhost.style.position = 'fixed';
        dragGhost.style.pointerEvents = 'none';
        dragGhost.style.opacity = '0.85';
        dragGhost.style.zIndex = '9999';
        dragGhost.style.width = card.offsetWidth + 'px';
        dragGhost.classList.add('drag-ghost');
        document.body.appendChild(dragGhost);

        const rect = card.getBoundingClientRect();
        dragOffset.x = (event.clientX || (event.touches && event.touches[0].clientX)) - rect.left;
        dragOffset.y = (event.clientY || (event.touches && event.touches[0].clientY)) - rect.top;
        moveGhost(event);

        document.addEventListener('dragover', moveGhost);
        document.addEventListener('dragend', onDragEndAnim);
    };

    function moveGhost(e) {
        if (!dragGhost) return;
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        if (clientX == null || clientY == null) return;
        dragGhost.style.left = (clientX - dragOffset.x) + 'px';
        dragGhost.style.top  = (clientY - dragOffset.y) + 'px';
    }

    function onDragOver(e) { e.preventDefault(); }

    function onDropDelete(e) {
        e.preventDefault();
        if (dragGhost) { dragGhost.remove(); dragGhost = null; }
        if (draggedTaskId) { deleteTask(draggedTaskId); draggedTaskId = null; }
        document.removeEventListener('dragover', moveGhost);
        document.removeEventListener('dragend', onDragEndAnim);
    }
    window.onDropDelete = onDropDelete;

    function onDragEndAnim() {
        if (dragGhost) {
        dragGhost.style.transition = 'all 0.3s cubic-bezier(.4,2,.6,1)';
        const card = document.getElementById('task-' + draggedTaskId);
        if (card) {
            const rect = card.getBoundingClientRect();
            dragGhost.style.left = rect.left + 'px';
            dragGhost.style.top  = rect.top + 'px';
        }
        setTimeout(() => { if (dragGhost) dragGhost.remove(); dragGhost = null; }, 300);
        }
        draggedTaskId = null;
        document.removeEventListener('dragover', moveGhost);
        document.removeEventListener('dragend', onDragEndAnim);
    }

    /* -------------------- Delete All Modal -------------------- */
    const deleteAllBtn = safeGet('delete-all-btn');
    let deleteAllModal = null;
    if (deleteAllBtn) {
        deleteAllBtn.addEventListener('click', () => {
        showDeleteAllModal();
        });
    }

    function showDeleteAllModal() {
        if (!deleteAllModal) {
        deleteAllModal = document.createElement('div');
        deleteAllModal.id = 'delete-all-modal';
        deleteAllModal.innerHTML = `
            <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-xs text-center">
                <h2 class="text-lg font-semibold mb-4">Delete All Tasks?</h2>
                <p class="mb-6 text-sm text-gray-600 dark:text-gray-300">Are you sure you want to delete all tasks? This action cannot be undone.</p>
                <div class="flex justify-center gap-3">
                <button id="confirm-delete-all" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
                <button id="cancel-delete-all" class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600">Cancel</button>
                </div>
            </div>
            </div>`;
        document.body.appendChild(deleteAllModal);
        }
        deleteAllModal.style.display = 'flex';

        const confirmBtn = el('#confirm-delete-all', deleteAllModal);
        const cancelBtn  = el('#cancel-delete-all', deleteAllModal);

        const onConfirm = () => {
        tasks = [];
        saveTasks();
        renderTasks();
        updateStats();
        closeAndRemoveModal(deleteAllModal);
        showToast('All tasks deleted', 'success');
        confirmBtn.removeEventListener('click', onConfirm);
        cancelBtn.removeEventListener('click', onCancel);
        };
        const onCancel = () => {
        deleteAllModal.style.display = 'none';
        confirmBtn.removeEventListener('click', onConfirm);
        cancelBtn.removeEventListener('click', onCancel);
        };

        if (confirmBtn && cancelBtn) {
        confirmBtn.addEventListener('click', onConfirm);
        cancelBtn.addEventListener('click', onCancel);
        }
    }

    function closeAndRemoveModal(modal) {
        if (!modal) return;
        modal.style.display = 'none';
        setTimeout(() => { if (modal && modal.parentNode) modal.remove(); }, 300);
    }

    /* -------------------- Utilities: find main task modal (robust) -------------------- */
    function findTaskModal() {
        // Prefer modal that contains the form (#task-form) to avoid picking duplicate/unused markup
        const modals = Array.from(document.querySelectorAll('#task-modal, .modal'));
        for (const m of modals) {
        if (m.querySelector && m.querySelector('#task-form')) return m;
        }
        // fallback: first modal-like element
        if (modals.length) return modals[0];
        // last fallback
        return document.getElementById('task-modal');
    }

    /* -------------------- State -------------------- */
    let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    let currentFilter = 'all';
    let editingTaskId = null;

    /* -------------------- DOM Ready Init -------------------- */
    document.addEventListener('DOMContentLoaded', () => {
        // set up theme (if function exists elsewhere)
        if (typeof loadTheme === 'function') loadTheme();

        // attach core handlers that rely on modal elements
        attachModalFormHandlers();

        renderTasks();
        updateStats();
        checkDeadlines();
        setInterval(checkDeadlines, 60000);

        // Close modal when clicking overlay (applies to whichever modal exists)
        document.addEventListener('click', (ev) => {
        const modal = findTaskModal();
        if (!modal) return;
        // if click on the overlay (modal itself) -> close
        if (ev.target === modal) closeModal();
        });
    });

    /* -------------------- Modal Management (Open / Edit / Close) -------------------- */

    // expose globally to allow inline onclick in HTML
    window.openAddModal = function openAddModal() {
        editingTaskId = null;
        const modal = findTaskModal();
        if (!modal) {
        console.warn('Task modal not found in DOM.');
        return;
        }
        const form = modal.querySelector('#task-form');
        const title = modal.querySelector('#task-title');
        if (form) form.reset();
        if (modal.querySelector('#image-preview')) modal.querySelector('#image-preview').innerHTML = '';
        const modalTitle = modal.querySelector('#modal-title');
        if (modalTitle) modalTitle.textContent = 'Add New Task';
        // show modal
        modal.style.display = 'flex';
        modal.classList.add('active');
    };

    window.openEditModal = function openEditModal(taskId) {
        const t = tasks.find(x => x.id === taskId);
        if (!t) return;
        editingTaskId = taskId;
        const modal = findTaskModal();
        if (!modal) return;
        const modalTitle = modal.querySelector('#modal-title');
        if (modalTitle) modalTitle.textContent = 'Edit Task';

        const idInput = modal.querySelector('#task-id');
        const titleInput = modal.querySelector('#task-title');
        const descInput = modal.querySelector('#task-description');
        const priorityInput = modal.querySelector('#task-priority');
        const categoryInput = modal.querySelector('#task-category');
        const deadlineInput = modal.querySelector('#task-deadline');
        const linkInput = modal.querySelector('#task-link');
        const imagePreview = modal.querySelector('#image-preview');

        if (idInput) idInput.value = t.id;
        if (titleInput) titleInput.value = t.title || '';
        if (descInput) descInput.value = t.description || '';
        if (priorityInput) priorityInput.value = t.priority || 'medium';
        if (categoryInput) categoryInput.value = t.category || '';
        if (deadlineInput) deadlineInput.value = t.deadline || '';
        if (linkInput) linkInput.value = t.link || '';
        if (imagePreview) imagePreview.innerHTML = t.image ? `<img src="${t.image}" class="attachment-preview">` : '';

        modal.style.display = 'flex';
        modal.classList.add('active');
    };

    window.closeModal = function closeModal() {
        const modal = findTaskModal();
        if (!modal) return;
        // reset form inside modal
        const form = modal.querySelector('#task-form');
        if (form) form.reset();
        const preview = modal.querySelector('#image-preview');
        if (preview) preview.innerHTML = '';
        modal.classList.remove('active');
        modal.style.display = 'none';
        editingTaskId = null;
    };

    function attachModalFormHandlers() {
        const modal = findTaskModal();
        if (!modal) return;
        const form = modal.querySelector('#task-form');
        const imageInput = modal.querySelector('#task-image');

        // protect against multiple bindings
        if (form && !form.__bound) {
        form.__bound = true;
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // read fields from the modal (scoped)
            const idField = modal.querySelector('#task-id');
            const titleField = modal.querySelector('#task-title');
            const descField = modal.querySelector('#task-description');
            const priorityField = modal.querySelector('#task-priority');
            const categoryField = modal.querySelector('#task-category');
            const deadlineField = modal.querySelector('#task-deadline');
            const linkField = modal.querySelector('#task-link');
            const imageField = modal.querySelector('#task-image');

            const title = titleField ? titleField.value.trim() : '';
            const description = descField ? descField.value.trim() : '';
            const priority = priorityField ? priorityField.value : 'medium';
            const category = categoryField ? categoryField.value.trim() : '';
            const deadline = deadlineField ? deadlineField.value : '';
            const link = linkField ? linkField.value.trim() : '';
            const imageFile = imageField && imageField.files ? imageField.files[0] : null;

            if (editingTaskId && idField && idField.value) {
            // edit existing
            const idx = tasks.findIndex(t => t.id === editingTaskId || (idField && t.id === idField.value));
            if (idx !== -1) {
                tasks[idx] = {
                ...tasks[idx],
                title, description, priority, category, deadline, link,
                updatedAt: new Date().toISOString()
                };
                if (imageFile) {
                handleImageUpload(imageFile, (imgData) => {
                    tasks[idx].image = imgData;
                    saveTasks();
                    renderTasks();
                });
                } else {
                saveTasks();
                renderTasks();
                }
                showToast('Task updated', 'success');
            }
            } else {
            // add new
            const newTask = {
                id: Date.now().toString(),
                title, description, priority, category, deadline, link,
                completed: false,
                createdAt: new Date().toISOString()
            };
            if (imageFile) {
                handleImageUpload(imageFile, (imgData) => {
                newTask.image = imgData;
                tasks.unshift(newTask);
                saveTasks();
                renderTasks();
                });
            } else {
                tasks.unshift(newTask);
                saveTasks();
                renderTasks();
            }
            showToast('Task added', 'success');
            }
            closeModal();
            updateStats();
        });
        }

        if (imageInput && !imageInput.__bound) {
        imageInput.__bound = true;
        imageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            handleImageUpload(file, (data) => {
            const preview = modal.querySelector('#image-preview');
            if (preview) preview.innerHTML = `<img src="${data}" class="attachment-preview">`;
            });
        });
        }
    }

    /* -------------------- Image Upload helper -------------------- */
    function handleImageUpload(file, cb) {
        if (!(file && cb && typeof cb === 'function')) return;
        const reader = new FileReader();
        reader.onload = (ev) => cb(ev.target.result);
        reader.readAsDataURL(file);
    }

    /* -------------------- deleteTask (confirm modal) -------------------- */
    function deleteTask(taskId) {
        // create a unique modal each time to avoid stale references
        const modal = document.createElement('div');
        modal.className = 'delete-task-modal';
        modal.innerHTML = `
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-xs text-center">
            <h2 class="text-lg font-semibold mb-4">Delete Task?</h2>
            <p class="mb-6 text-sm text-gray-600 dark:text-gray-300">Are you sure you want to delete this task?</p>
            <div class="flex justify-center gap-3">
                <button id="confirm-delete-task" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
                <button id="cancel-delete-task" class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600">Cancel</button>
            </div>
            </div>
        </div>`;
        document.body.appendChild(modal);
        modal.style.display = 'flex';

        const confirmBtn = el('#confirm-delete-task', modal);
        const cancelBtn  = el('#cancel-delete-task', modal);

        const onConfirm = () => {
        tasks = tasks.filter(t => t.id !== taskId);
        saveTasks();
        renderTasks();
        updateStats();
        closeAndRemoveModal(modal);
        showToast('Task deleted', 'success');
        cleanup();
        };

        const onCancel = () => {
        closeAndRemoveModal(modal);
        cleanup();
        };

        function cleanup() {
        if (confirmBtn) confirmBtn.removeEventListener('click', onConfirm);
        if (cancelBtn) cancelBtn.removeEventListener('click', onCancel);
        }

        if (confirmBtn) confirmBtn.addEventListener('click', onConfirm);
        if (cancelBtn) cancelBtn.addEventListener('click', onCancel);
    }
    window.deleteTask = deleteTask; // expose if used inline

    /* -------------------- Save & Render -------------------- */
    function saveTasks() {
        try { localStorage.setItem('tasks', JSON.stringify(tasks)); } catch (e) { console.warn('Unable to save tasks', e); }
    }

    function renderTasks() {
        const container = safeGet('tasks-container');
        const emptyState = safeGet('empty-state');
        if (!container || !emptyState) return;

        let filtered = tasks;
        if (currentFilter === 'active') filtered = tasks.filter(t => !t.completed);
        else if (currentFilter === 'completed') filtered = tasks.filter(t => t.completed);

        if (!filtered.length) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        } else {
        emptyState.style.display = 'none';
        container.innerHTML = filtered.map(createTaskCard).join('');
        // recreate lucide icons (if used inside cards)
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            try { lucide.createIcons(); } catch (e) { /* ignore */ }
        }
        // re-attach draggable attributes (in case)
        els('.task-card', container).forEach(card => {
            // ensure draggable attribute set
            card.setAttribute('draggable', 'true');
        });
        }
        updateFilterCounts();
    }

    /* -------------------- createTaskCard -------------------- */
    function createTaskCard(task) {
        const isOverdue = task.deadline && new Date(task.deadline) < new Date() && !task.completed;
        const isDueSoon = task.deadline && new Date(task.deadline) < new Date(Date.now() + 24 * 60 * 60 * 1000) && !task.completed;
        // ensure the category span only has one class attribute
        const categorySpan = task.category ? `<span class="text-xs px-2 py-1 rounded bg-gray-100">${escapeHtml(task.category)}</span>` : '';
        return `
        <div class="task-card border priority-${escapeHtml(task.priority || 'medium')} ${isDueSoon ? 'deadline-warning' : ''}" id="task-${escapeHtml(task.id)}" draggable="true" ondragstart="onDragStart(event, '${escapeHtml(task.id)}')">
            <div class="flex justify-between items-start mb-2">
            <div class="flex-1">
                <h3 class="font-semibold text-lg ${task.completed ? 'line-through opacity-60' : ''}">${escapeHtml(task.title)}</h3>
                ${categorySpan}
            </div>
            <div class="flex gap-2">
                <button onclick="openEditModal('${escapeHtml(task.id)}')" class="text-sm" title="Edit">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                </button>
                <button onclick="deleteTask('${escapeHtml(task.id)}')" title="Delete">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
            </div>
            </div>
            ${task.description ? `<p class="text-sm mb-3">${escapeHtml(task.description)}</p>` : ''}
            ${task.deadline ? `<div class="flex items-center gap-2 mb-2 text-sm ${isOverdue ? 'text-red-500' : ''}"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>${escapeHtml(new Date(task.deadline).toLocaleString())}${isOverdue ? ' (Overdue!)' : isDueSoon ? ' (Due Soon!)' : ''}</div>` : ''}
            ${task.link ? `<div class="flex items-center gap-2 mb-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg><a href="${escapeHtml(task.link)}" target="_blank" class="text-sm underline">View Link</a></div>` : ''}
            <div class="flex items-center justify-between mt-4 pt-3" style="border-top:1px solid rgba(0,0,0,0.06);">
            <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleComplete('${escapeHtml(task.id)}')" class="w-4 h-4">
                <span class="text-sm">${task.completed ? 'Completed' : 'Mark as complete'}</span>
            </label>
            <span class="text-xs">Priority: ${escapeHtml(task.priority)}</span>
            </div>
        </div>
        `;
    }

    function escapeHtml(str) {
        if (str == null) return '';
        return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    /* -------------------- Filters & Counts -------------------- */
    function filterTasks(filter) {
        currentFilter = filter;
        // support .filter-btn or .filter-tab
        const tabs = document.querySelectorAll('.filter-btn, .filter-tab');
        tabs.forEach(tab => {
        const f = tab.dataset ? tab.dataset.filter : null;
        if (f != null) tab.classList.toggle('active', f === filter);
        });
        if (mobileFilterMenu && !mobileFilterMenu.classList.contains('hidden')) mobileFilterMenu.classList.add('hidden');
        renderTasks();
    }
    window.filterTasks = filterTasks; // expose for inline calls

    function updateFilterCounts() {
        const all = safeGet('filter-all');
        const activeEl = safeGet('filter-active');
        const completedEl = safeGet('filter-completed');
        if (all) all.textContent = tasks.length;
        if (activeEl) activeEl.textContent = tasks.filter(t => !t.completed).length;
        if (completedEl) completedEl.textContent = tasks.filter(t => t.completed).length;
    }

    function updateStats() {
        const total = tasks.length;
        const active = tasks.filter(t => !t.completed).length;
        const completed = tasks.filter(t => t.completed).length;
        const dueSoon = tasks.filter(t => {
        if (!t.deadline || t.completed) return false;
        const d = new Date(t.deadline);
        const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
        return d < tomorrow;
        }).length;

        const totalEl = safeGet('total-tasks');
        const activeEl = safeGet('active-tasks');
        const completedEl = safeGet('completed-tasks');
        const dueSoonEl = safeGet('due-soon');

        if (totalEl) totalEl.textContent = total;
        if (activeEl) activeEl.textContent = active;
        if (completedEl) completedEl.textContent = completed;
        if (dueSoonEl) dueSoonEl.textContent = dueSoon;
    }

    /* -------------------- Toggle complete -------------------- */
    window.toggleComplete = function toggleComplete(taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;
        task.completed = !task.completed;
        task.completedAt = task.completed ? new Date().toISOString() : null;
        saveTasks();
        renderTasks();
        updateStats();
    };

    /* -------------------- Deadlines & Notifications -------------------- */
    function checkDeadlines() {
        const now = new Date();
        const oneHour = 60 * 60 * 1000;
        tasks.forEach(task => {
        if (!task.completed && task.deadline) {
            const deadline = new Date(task.deadline);
            const timeDiff = deadline - now;
            if (timeDiff > 0 && timeDiff <= oneHour) {
            showNotification(`Task "${task.title}" is due in less than an hour!`);
            } else if (timeDiff < 0 && timeDiff > -oneHour) {
            showNotification(`Task "${task.title}" is overdue!`);
            }
        }
        });
    }

    function showNotification(message) {
        if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('TaskMaster Pro', { body: message, icon: '/favicon.ico' });
        } else if ('Notification' in window && Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
            new Notification('TaskMaster Pro', { body: message, icon: '/favicon.ico' });
            }
        });
        }
    }
    if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission();

    /* -------------------- Toast -------------------- */
    function showToast(message, type = 'success') {
        let toast = safeGet('toast-notification');
        if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-notification';
        toast.className = 'fixed top-6 left-1/2 z-[9999] -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg text-white text-sm font-semibold transition-all duration-300 opacity-0 pointer-events-none';
        document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.className =
        'fixed top-6 left-1/2 z-[9999] -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg text-white text-sm font-semibold transition-all duration-300 opacity-0 pointer-events-none ' +
        (type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : type === 'info' ? 'bg-blue-600' : 'bg-yellow-600');

        // ensure style changes take effect
        requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.pointerEvents = 'auto';
        });

        setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.pointerEvents = 'none';
        }, 1800);
    }
    window.showToast = showToast;

    /* -------------------- Small UI helpers -------------------- */
    function closeModalAndToast(modal, msg) {
        if (!modal) return;
        modal.style.display = 'none';
        setTimeout(() => { if (modal && modal.parentNode) modal.remove(); }, 300);
        if (msg) showToast(msg, 'success');
    }

    /* -------------------- Expose some functions globally (for inline attributes) -------------------- */
    window.filterTasks = window.filterTasks || filterTasks;
    window.openEditModal = window.openEditModal || window.openEditModal;
    window.openAddModal = window.openAddModal || window.openAddModal;
    window.closeModal = window.closeModal || window.closeModal;
    window.onDropDelete = window.onDropDelete || onDropDelete;

    // initial lucide (if available)
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
        try { lucide.createIcons(); } catch (e) { /* ignore */ }
    }

    /* -------------------- End IIFE -------------------- */
    })();
