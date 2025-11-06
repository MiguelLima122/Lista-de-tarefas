const input_lista = document.getElementById("lista");

if (input_lista) {
        nput_lista.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            adicionar_tarefas();
        }
    });
}

function adicionar_tarefas() {
    let input_field = document.getElementById("lista");
    let container = document.getElementById("container");

    if (input_field.value.trim() === "") {
        input_field.focus();
        return;
    }

    const task = {
        id: Date.now(),
        text: input_field.value,
        completed: false
    };

    createTaskElement(task, container);
    
    salvarTarefasLocalStorage(task);

    input_field.value = "";
    input_field.focus();
}

function createTaskElement(task, container) {
    const taskDiv = document.createElement("div");
    taskDiv.className = "task-item";
    taskDiv.dataset.taskId = task.id;

    if (task.completed) {
        taskDiv.classList.add("completed");
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.id = `task-${task.id}`;
    checkbox.onchange = function() {
        task.completed = checkbox.checked;
        taskDiv.classList.toggle("completed", checkbox.checked);
        atualizarEOrdenarTarefas();
    };

    const label = document.createElement("label");
    label.textContent = task.text;
    label.htmlFor = checkbox.id;

    const taskContent = document.createElement('div');
    taskContent.className = 'task-content';
    taskContent.appendChild(checkbox);
    taskContent.appendChild(label);

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remover";
    removeBtn.className = "remove-btn";
    removeBtn.onclick = function() {
        container.removeChild(taskDiv);
        removerTarefaLocalStorage(task.id);
    };

    taskDiv.appendChild(taskContent);
    taskDiv.appendChild(removeBtn);

    if (task.completed) {
        container.appendChild(taskDiv);
    } else {
        container.insertBefore(taskDiv, container.querySelector('.completed'));
    }
}

function salvarTarefasLocalStorage(tarefa) {
    let tarefas = localStorage.getItem('tarefas') ? JSON.parse(localStorage.getItem('tarefas')) : [];
    tarefas.push(tarefa);
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

function carregarTarefasLocalStorage() {
    let tarefas = localStorage.getItem('tarefas') ? JSON.parse(localStorage.getItem('tarefas')) : [];
    let container = document.getElementById("container");
    
    tarefas.sort((a, b) => a.completed - b.completed);

    tarefas.forEach(function(tarefa) {
        createTaskElement(tarefa, container);
    });
}

function atualizarEOrdenarTarefas() {
    const container = document.getElementById("container");
    const tasks = [];
    document.querySelectorAll('.task-item').forEach(taskDiv => {
        const id = Number(taskDiv.dataset.taskId);
        const checkbox = taskDiv.querySelector('input[type="checkbox"]');
        tasks.push({
            id: id,
            text: taskDiv.querySelector('label').textContent,
            completed: checkbox.checked
        });
        container.removeChild(taskDiv);
    });

    tasks.sort((a, b) => a.completed - b.completed);

    tasks.forEach(task => {
        createTaskElement(task, container);
    });

    localStorage.setItem('tarefas', JSON.stringify(tasks));
}


function removerTarefaLocalStorage(taskId) {
    let tarefas = localStorage.getItem('tarefas') ? JSON.parse(localStorage.getItem('tarefas')) : [];
    tarefas = tarefas.filter(t => t.id !== taskId);
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

document.addEventListener('DOMContentLoaded', carregarTarefasLocalStorage);