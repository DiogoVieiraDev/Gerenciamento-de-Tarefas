function addTask(task, description) {
const taskList = document.getElementById('task-list');

const li = document.createElement('li');
li.classList.add('task-item');

const taskText = document.createElement('div');
taskText.classList.add('task-text');
taskText.textContent = task;
li.appendChild(taskText);

const descriptionText = document.createElement('div');
descriptionText.classList.add('description-text');
descriptionText.textContent = description;
li.appendChild(descriptionText);

const taskActions = document.createElement('div');
taskActions.classList.add('task-actions');
li.appendChild(taskActions);

const editButton = document.createElement('button');
editButton.classList.add('task-edit-button');
editButton.textContent = 'Editar';
taskActions.appendChild(editButton);

const deleteButton = document.createElement('button');
deleteButton.classList.add('task-delete-button');
deleteButton.textContent = 'Excluir';
taskActions.appendChild(deleteButton);

const completedCheckbox = document.createElement('input');
completedCheckbox.type = 'checkbox';
completedCheckbox.classList.add('task-completed-checkbox');
li.appendChild(completedCheckbox);

const completedLabel = document.createElement('span');
completedLabel.classList.add('task-completed-label');
completedLabel.textContent = 'Marcar como concluída';
li.appendChild(completedLabel);

taskList.appendChild(li);
}

function filterTasks(filter) {
const taskItems = document.querySelectorAll('.task-item');

taskItems.forEach(function (item) {
item.style.display = 'block';

if (filter === 'pending' && item.classList.contains('completed')) {
item.style.display = 'none';
} else if (filter === 'completed' && !item.classList.contains('completed')) {
item.style.display = 'none';
}
});
}

function saveTasks() {
const taskItems = document.querySelectorAll('.task-item');
const tasks = [];

taskItems.forEach(function (item) {
const taskText = item.querySelector('.task-text').textContent;
const descriptionText = item.querySelector('.description-text').textContent;
const completed = item.classList.contains('completed');

tasks.push({ task: taskText, description: descriptionText, completed });
});

localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
const tasks = JSON.parse(localStorage.getItem('tasks'));

if (tasks) {
tasks.forEach(function (task) {
addTask(task.task, task.description);

const taskItem = document.querySelector('.task-item:last-child');
if (task.completed) {
taskItem.classList.add('completed');
taskItem.querySelector('.task-completed-checkbox').checked = true;
taskItem.querySelector('.task-completed-label').style.opacity = 0;
}
});
}
}

function checkIfTaskCompleted(taskItem) {
if (taskItem.classList.contains('completed')) {
alert('Não é possível editar uma tarefa já completada.');
return false;
} else {
return true;
}
}

function editTask(taskItem) {
if (!checkIfTaskCompleted(taskItem)) {
return;
}

const taskText = taskItem.querySelector('.task-text');
const descriptionText = taskItem.querySelector('.description-text');
const completedCheckbox = taskItem.querySelector('.task-completed-checkbox');
const completedLabel = taskItem.querySelector('.task-completed-label');

if (taskItem.classList.contains('editing')) {
const newTaskName = taskText.querySelector('input').value.trim();
const newDescription = descriptionText.querySelector('textarea').value.trim();

if (newTaskName !== '') {
taskText.textContent = newTaskName;
descriptionText.textContent = newDescription;
saveTasks();
}

taskItem.classList.remove('editing');
taskItem.querySelector('.task-edit-button').textContent = 'Editar';
completedLabel.style.opacity = completedCheckbox.checked ? 0 : 1;
} else {
const taskName = taskText.textContent;
const description = descriptionText.textContent;

taskText.innerHTML = '<input type="text" value="' + taskName + '">';
descriptionText.innerHTML = '<textarea>' + description + '</textarea>';

taskItem.classList.add('editing');
taskItem.querySelector('.task-edit-button').textContent = 'Salvar';
completedLabel.style.opacity = 0;
}
}

document.addEventListener('DOMContentLoaded', function () {
const filterButtons = document.querySelectorAll('.filter-button');

filterButtons.forEach(function (button) {
button.addEventListener('click', function () {
const filter = button.getAttribute('data-filter');
filterTasks(filter);
});
});

document.getElementById('task-form').addEventListener('submit', function (e) {
e.preventDefault();

const taskInput = document.getElementById('task-input');
const descriptionInput = document.getElementById('description-input');

const task = taskInput.value.trim();
const description = descriptionInput.value.trim();

if (task !== '') {
addTask(task, description);
saveTasks();
taskInput.value = '';
descriptionInput.value = '';
}
});

document.getElementById('task-list').addEventListener('click', function (e) {
if (e.target.matches('.task-edit-button')) {
const taskItem = e.target.closest('.task-item');
editTask(taskItem);
} else if (e.target.matches('.task-delete-button')) {
const taskItem = e.target.closest('.task-item');
taskItem.remove();
saveTasks();
} else if (e.target.matches('.task-completed-checkbox')) {
const taskItem = e.target.closest('.task-item');
taskItem.classList.toggle('completed');
saveTasks();
}
});

loadTasks();
});