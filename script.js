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

// Load todos from localStorage at startup
document.addEventListener('DOMContentLoaded', function() {
    var theme = getStoredTheme();
    applyTheme(theme);

    var todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.forEach(addItem);
});

document.getElementById('add-todo').addEventListener('click', function() {
    var value = document.getElementById('todo-input').value;
    if (value) {
        addItem(value);
        document.getElementById('todo-input').value = '';
        saveTodos();
    }
});

document.getElementById('theme-toggle').addEventListener('click', function() {
    var currentTheme = document.body.classList.contains('theme-light') ? 'light' : 'dark';
    var nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', nextTheme);
    applyTheme(nextTheme);
});

function addItem(text) {
    var list = document.getElementById('todo-list');

    var item = document.createElement('li');
    item.innerText = text;

    var deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.addEventListener('click', function() {
        list.removeChild(item);
        saveTodos();
    });

    item.appendChild(deleteButton);
    list.appendChild(item);
}

function saveTodos() {
    var todos = Array.from(document.getElementById('todo-list').children).map(function(item) {
        return item.innerText.replace('Delete', '');
    });
    localStorage.setItem('todos', JSON.stringify(todos));
}