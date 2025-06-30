const form = document.getElementById('todo-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

let tasks = [];

window.addEventListener('DOMContentLoaded', () => {
  const savedTasks = localStorage.getItem('tasks');
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
    tasks.forEach(task => renderTask(task));
  }
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const taskText = taskInput.value.trim();
  if (taskText === '') return;

  const task = {
    id: Date.now(),
    text: taskText,
    completed: false
  };

  tasks.push(task);
  saveTasks();
  renderTask(task);
  taskInput.value = '';
});

function renderTask(task) {
  const li = document.createElement('li');
  li.dataset.id = task.id;
  li.className = task.completed ? 'completed' : '';

  li.innerHTML = `
    <span>${task.text}</span>
    <button class="delete-btn">&#10008;</button>
  `;

  taskList.appendChild(li);
}

taskList.addEventListener('click', (e) => {
  const li = e.target.closest('li');
  const id = Number(li.dataset.id);

  if (e.target.classList.contains('delete-btn')) {
    tasks = tasks.filter(task => task.id !== id);
    li.remove();
  } else {
    tasks = tasks.map(task => {
      if (task.id === id) task.completed = !task.completed;
      return task;
    });
    li.classList.toggle('completed');
  }

  saveTasks();
});

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}