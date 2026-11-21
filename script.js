(function () {
  'use strict';

  // ---- Settings and DOM references ----
  var STORAGE_KEY = 'project02_todo_tasks';

  var taskInput = document.getElementById('task-input');
  var addBtn = document.getElementById('add-btn');
  var errorMessage = document.getElementById('error-message');
  var taskList = document.getElementById('task-list');
  var emptyState = document.getElementById('empty-state');
  var taskCount = document.getElementById('task-count');
  var clearCompletedBtn = document.getElementById('clear-completed');
  var filterButtons = document.querySelectorAll('.filter-btn');

  // ---- State ----
  var tasks = loadTasks();
  var currentFilter = 'all';

  // ---- LocalStorage helpers ----
  function loadTasks() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(parsed)) { return []; }
      return parsed.filter(function (task) {
        return task && typeof task.id === 'string' && typeof task.text === 'string';
      }).map(function (task) {
        return { id: task.id, text: task.text, completed: Boolean(task.completed) };
      });
    } catch (error) {
      return [];
    }
  }

  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      showError('Could not save tasks in this browser.');
    }
  }

  // ---- Actions ----
  function addTask() {
    var text = taskInput.value.trim();

    if (text === '') {
      showError('Please type a task first.');
      taskInput.focus();
      return;
    }

    tasks.push({
      id: Date.now().toString() + Math.random().toString(16).slice(2, 8),
      text: text,
      completed: false
    });

    taskInput.value = '';
    showError('');
    saveTasks();
    render();
    taskInput.focus();
  }

  function toggleTask(id) {
    tasks.forEach(function (task) {
      if (task.id === id) { task.completed = !task.completed; }
    });
    saveTasks();
    render();
  }

  function deleteTask(id) {
    tasks = tasks.filter(function (task) { return task.id !== id; });
    saveTasks();
    render();
  }

  function clearCompleted() {
    tasks = tasks.filter(function (task) { return !task.completed; });
    saveTasks();
    render();
  }

  function setFilter(filter) {
    currentFilter = filter;
    filterButtons.forEach(function (btn) {
      btn.classList.toggle('is-active', btn.dataset.filter === filter);
    });
    render();
  }

  function showError(message) {
    errorMessage.textContent = message;
  }

  // ---- Rendering (DOM manipulation) ----
  function getVisibleTasks() {
    if (currentFilter === 'active') {
      return tasks.filter(function (task) { return !task.completed; });
    }
    if (currentFilter === 'completed') {
      return tasks.filter(function (task) { return task.completed; });
    }
    return tasks;
  }

  function createTaskElement(task) {
    var item = document.createElement('li');
    item.className = 'task-item' + (task.completed ? ' is-done' : '');
    item.dataset.id = task.id;

    var label = document.createElement('label');
    label.className = 'task-label';

    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;

    var text = document.createElement('span');
    text.className = 'task-text';
    text.textContent = task.text; // textContent keeps user input safe

    label.appendChild(checkbox);
    label.appendChild(text);

    var deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.setAttribute('aria-label', 'Delete task: ' + task.text);

    item.appendChild(label);
    item.appendChild(deleteBtn);
    return item;
  }

  function render() {
    var visible = getVisibleTasks();
    taskList.innerHTML = '';

    visible.forEach(function (task) {
      taskList.appendChild(createTaskElement(task));
    });

    emptyState.style.display = visible.length === 0 ? 'block' : 'none';

    var remaining = tasks.filter(function (task) { return !task.completed; }).length;
    taskCount.textContent = remaining + (remaining === 1 ? ' task left' : ' tasks left');

    var hasCompleted = tasks.some(function (task) { return task.completed; });
    clearCompletedBtn.disabled = !hasCompleted;
    clearCompletedBtn.style.opacity = hasCompleted ? '1' : '0.4';
  }

  // ---- Event listeners ----
  addBtn.addEventListener('click', addTask);

  taskInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      addTask();
    }
  });

  taskInput.addEventListener('input', function () {
    if (taskInput.value.trim() !== '') { showError(''); }
  });

  // One listener on the list handles every task (event delegation)
  taskList.addEventListener('click', function (event) {
    var item = event.target.closest('.task-item');
    if (!item) { return; }

    if (event.target.closest('.delete-btn')) {
      deleteTask(item.dataset.id);
    }
  });

  taskList.addEventListener('change', function (event) {
    var item = event.target.closest('.task-item');
    if (item && event.target.type === 'checkbox') {
      toggleTask(item.dataset.id);
    }
  });

  clearCompletedBtn.addEventListener('click', clearCompleted);

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () { setFilter(btn.dataset.filter); });
  });

  // ---- Start ----
  render();
})();
