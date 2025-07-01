const form = document.getElementById('todo-form');
const taskInput = document.getElementById('task-input');
const upcomingList = document.getElementById('upcoming-list');
const ongoingList = document.getElementById('ongoing-list');
const completedList = document.getElementById('completed-list');
const starredList = document.getElementById('starred-list');

const navItems = document.querySelectorAll('.nav-item');
const allSections = document.querySelectorAll('.task-section');
const starredSection = document.getElementById('starred-section');

// Mobile menu toggle
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.querySelector('.sidebar');

menuToggle.addEventListener('click', () => {
  sidebar.classList.toggle('open');
});

let tasks = [];

// Load tasks
window.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('tasks');
  if (saved) {
    tasks = JSON.parse(saved);
    renderTasks();
  }
});

// Add new task
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = taskInput.value.trim();
  if (!text) return;

  const task = {
    id: Date.now(),
    text,
    status: 'upcoming',
    starred: false
  };

  tasks.push(task);
  saveTasks();
  renderTasks();
  taskInput.value = '';
});

// Render tasks
function renderTasks() {
  upcomingList.innerHTML = '';
  ongoingList.innerHTML = '';
  completedList.innerHTML = '';

  tasks.forEach(task => {
    const li = document.createElement('li');

    const left = document.createElement('div');
    left.className = 'task-left';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.status === 'completed';
    checkbox.addEventListener('change', () => toggleComplete(task.id));

    const text = document.createElement('span');
    text.textContent = task.text;

    left.appendChild(checkbox);
    left.appendChild(text);

    const actions = document.createElement('div');
    actions.className = 'task-actions';

    if (task.status === 'upcoming') {
      const startBtn = document.createElement('button');
      startBtn.className = 'start-btn';
      startBtn.textContent = '▶️';
      startBtn.addEventListener('click', () => moveToOngoing(task.id));
      actions.appendChild(startBtn);
    }

    const starBtn = document.createElement('button');
    starBtn.className = 'star-btn';
    starBtn.innerHTML = task.starred ? '⭐' : '☆';
    starBtn.addEventListener('click', () => toggleStar(task.id));

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '❌';
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    actions.appendChild(starBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(left);
    li.appendChild(actions);

    if (task.status === 'upcoming') upcomingList.appendChild(li);
    else if (task.status === 'ongoing') ongoingList.appendChild(li);
    else completedList.appendChild(li);
  });
}

// Tabs
navItems.forEach(nav => {
  nav.addEventListener('click', () => {
    navItems.forEach(n => n.classList.remove('active'));
    nav.classList.add('active');

    if (nav.dataset.tab === 'starred') {
      allSections.forEach(sec => sec.style.display = 'none');
      starredSection.style.display = 'block';
      renderStarred();
    } else {
      allSections.forEach(sec => sec.style.display = 'block');
      starredSection.style.display = 'none';
    }

    // Auto close sidebar on mobile
    sidebar.classList.remove('open');
  });
});

function renderStarred() {
  starredList.innerHTML = '';
  tasks.filter(t => t.starred).forEach(task => {
    const li = document.createElement('li');
    li.textContent = task.text;
    starredList.appendChild(li);
  });
}

function toggleComplete(id) {
  tasks = tasks.map(task => {
    if (task.id === id) {
      if (task.status === 'completed') {
        task.status = 'ongoing';
      } else {
        task.status = 'completed';
      }
    }
    return task;
  });
  saveTasks();
  renderTasks();
}

function moveToOngoing(id) {
  tasks = tasks.map(task => {
    if (task.id === id) task.status = 'ongoing';
    return task;
  });
  saveTasks();
  renderTasks();
}

function toggleStar(id) {
  tasks = tasks.map(task => {
    if (task.id === id) {
      task.starred = !task.starred;
      if (task.starred) {
        alert('Reminder: Do you want to repeat this task tomorrow?');
      }
    }
    return task;
  });
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  const task = tasks.find(task => task.id === id);
  if (task.starred) {
    alert('Please unstar this task before deleting.');
    return;
  }
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}
