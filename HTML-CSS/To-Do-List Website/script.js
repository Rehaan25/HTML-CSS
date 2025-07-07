const taskForm = document.getElementById('task-form');
const taskName = document.getElementById('task-name');
const taskStatus = document.getElementById('task-status');
const taskPriority = document.getElementById('task-priority');
const taskDueDate = document.getElementById('task-due-date');
const tableBody = document.getElementById('task-table-body');

const sortDueBtn = document.getElementById('sort-due-date');
const sortPriorityBtn = document.getElementById('sort-priority');
const filterOpenBtn = document.getElementById('filter-open');
const clearFiltersBtn = document.getElementById('clear-filters');

let tasks = [];
let sortBy = null;
let filterBy = null;
let selected = new Set();

// ✅ If no tasks saved yet, preload with your JSON!
if (!localStorage.getItem('tasks')) {
  const initialTasks = [
    { "id": 1, "name": "Design Landing Page", "status": "Open", "priority": "High", "dueDate": "2025-07-15" },
    { "id": 2, "name": "Implement Authentication", "status": "In Progress", "priority": "Medium", "dueDate": "2025-07-10" },
    { "id": 3, "name": "Write Unit Tests", "status": "Closed", "priority": "Low", "dueDate": "2025-07-05" },
    { "id": 4, "name": "Set Up CI/CD Pipeline", "status": "Open", "priority": "High", "dueDate": "2025-07-20" },
    { "id": 5, "name": "Update Documentation", "status": "In Progress", "priority": "Low", "dueDate": "2025-07-12" },
    { "id": 6, "name": "Refactor Codebase", "status": "Open", "priority": "Medium", "dueDate": "2025-07-18" },
    { "id": 7, "name": "User Feedback Survey", "status": "Closed", "priority": "Medium", "dueDate": "2025-07-08" },
    { "id": 8, "name": "Performance Optimization", "status": "In Progress", "priority": "High", "dueDate": "2025-07-22" },
    { "id": 9, "name": "Set Up Monitoring", "status": "Open", "priority": "High", "dueDate": "2025-07-25" },
    { "id": 10, "name": "Finalize Release Notes", "status": "Closed", "priority": "Low", "dueDate": "2025-07-03" }
  ];
  localStorage.setItem('tasks', JSON.stringify(initialTasks));
}

load();

taskForm.addEventListener('submit', e => {
  e.preventDefault();

  const task = {
    id: Date.now(),
    name: taskName.value.trim(),
    status: taskStatus.value,
    priority: taskPriority.value,
    dueDate: taskDueDate.value
  };

  tasks.push(task);
  save();
  render();
  taskForm.reset();
});

function render() {
  tableBody.innerHTML = '';

  let view = [...tasks];

  if (filterBy === 'Open') {
    view = view.filter(task => task.status === 'Open');
  }

  if (sortBy === 'DueDate') {
    view.sort((a,b) => new Date(a.dueDate) - new Date(b.dueDate));
  }

  if (sortBy === 'Priority') {
    const order = { High: 3, Medium: 2, Low: 1 };
    view.sort((a,b) => order[b.priority] - order[a.priority]);
  }

  view.forEach(task => {
    const row = document.createElement('tr');

    const selectCell = document.createElement('td');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = selected.has(task.id);
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) selected.add(task.id);
      else selected.delete(task.id);
      save();
    });
    selectCell.appendChild(checkbox);

    row.appendChild(selectCell);
    row.innerHTML += `
      <td>${task.name}</td>
      <td>${task.status}</td>
      <td>${task.priority}</td>
      <td>${task.dueDate}</td>
    `;

    tableBody.appendChild(row);
  });
}

sortDueBtn.addEventListener('click', () => {
  sortBy = 'DueDate';
  save();
  render();
});

sortPriorityBtn.addEventListener('click', () => {
  sortBy = 'Priority';
  save();
  render();
});

filterOpenBtn.addEventListener('click', () => {
  filterBy = 'Open';
  save();
  render();
});

clearFiltersBtn.addEventListener('click', () => {
  sortBy = null;
  filterBy = null;
  save();
  render();
});

function save() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  localStorage.setItem('sortBy', sortBy);
  localStorage.setItem('filterBy', filterBy);
  localStorage.setItem('selected', JSON.stringify([...selected]));
}

function load() {
  const savedTasks = localStorage.getItem('tasks');
  const savedSort = localStorage.getItem('sortBy');
  const savedFilter = localStorage.getItem('filterBy');
  const savedSelected = localStorage.getItem('selected');

  if (savedTasks) tasks = JSON.parse(savedTasks);
  if (savedSort) sortBy = savedSort;
  if (savedFilter) filterBy = savedFilter;
  if (savedSelected) selected = new Set(JSON.parse(savedSelected));

  render();
}
