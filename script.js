function getStoredTheme() {
    var savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
    }

    return 'dark';
}

function applyTheme(theme) {
    document.body.classList.toggle('theme-light', theme === 'light');
    document.body.classList.toggle('theme-dark', theme === 'dark');
    document.body.style.backgroundColor = theme === 'light' ? '#fbeeff' : '#121212';
    document.body.style.color = theme === 'light' ? '#1f1f1f' : '#f5f5f5';

    var toggleButton = document.getElementById('theme-toggle');
    if (toggleButton) {
        toggleButton.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
    }
}

function updateEmptyState() {
    var todoList = document.getElementById('todo-list');
    var emptyState = document.getElementById('empty-state');
    if (!todoList || !emptyState) return;

    emptyState.classList.toggle('visible', todoList.children.length === 0);
}

function normalizeTodos(rawTodos) {
    if (!Array.isArray(rawTodos)) {
        return [];
    }

    return rawTodos.map(function(todo) {
        if (typeof todo === 'string') {
            return { text: todo, done: false };
        }

        return {
            text: todo && todo.text ? todo.text : '',
            done: !!(todo && todo.done)
        };
    }).filter(function(todo) {
        return todo.text.trim().length > 0;
    });
}

function renderTodoList() {
    var todoList = document.getElementById('todo-list');
    if (!todoList) return;

    todoList.innerHTML = '';

    var todos = normalizeTodos(JSON.parse(localStorage.getItem('todos')) || []);
    todos.forEach(function(todo) {
        addItem(todo.text, todo.done);
    });

    updateEmptyState();
}

function addItem(text, done) {
    var list = document.getElementById('todo-list');
    if (!list) return;

    var item = document.createElement('li');
    item.className = done ? 'done' : '';

    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = !!done;
    checkbox.addEventListener('change', function() {
        item.classList.toggle('done', checkbox.checked);
        saveTodos();
    });

    var label = document.createElement('span');
    label.textContent = text;

    var deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.addEventListener('click', function() {
        list.removeChild(item);
        saveTodos();
        updateEmptyState();
    });

    item.appendChild(checkbox);
    item.appendChild(label);
    item.appendChild(deleteButton);
    list.appendChild(item);
}

function saveTodos() {
    var todoList = document.getElementById('todo-list');
    if (!todoList) return;

    var todos = Array.from(todoList.children).map(function(item) {
        var checkbox = item.querySelector('input[type="checkbox"]');
        var text = item.querySelector('span');
        return {
            text: text ? text.textContent : '',
            done: checkbox ? checkbox.checked : false
        };
    });

    localStorage.setItem('todos', JSON.stringify(todos));
    updateEmptyState();
}

function addTodoFromInput() {
    var input = document.getElementById('todo-input');
    var value = input.value.trim();
    if (!value) {
        input.focus();
        return;
    }

    addItem(value, false);
    input.value = '';
    saveTodos();
    input.focus();
    updateEmptyState();
}

// Load todos from localStorage at startup
document.addEventListener('DOMContentLoaded', function() {
    var theme = getStoredTheme();
    applyTheme(theme);

    renderTodoList();

    var input = document.getElementById('todo-input');
    var addButton = document.getElementById('add-todo');
    var clearCompletedButton = document.getElementById('clear-completed');
    var themeToggle = document.getElementById('theme-toggle');

    addButton.addEventListener('click', addTodoFromInput);
    clearCompletedButton.addEventListener('click', function() {
        var items = Array.from(document.querySelectorAll('#todo-list li'));
        items.forEach(function(item) {
            var checkbox = item.querySelector('input[type="checkbox"]');
            if (checkbox && checkbox.checked) {
                item.remove();
            }
        });
        saveTodos();
    });
    themeToggle.addEventListener('click', function() {
        var currentTheme = document.body.classList.contains('theme-light') ? 'light' : 'dark';
        var nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', nextTheme);
        applyTheme(nextTheme);
    });

    input.addEventListener('input', function() {
        addButton.disabled = input.value.trim().length === 0;
    });

    input.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            addTodoFromInput();
        }
    });

    addButton.disabled = input.value.trim().length === 0;
    input.focus();
    updateEmptyState();
});

function getStoredTheme() {
    var savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
    }

    return 'dark';
}
