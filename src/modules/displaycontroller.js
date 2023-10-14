import Logger from "./logger";

class DisplayController {
  constructor(projects = []){
    this.projects = projects;

  }

  addProject(project) {
    this.projects.push(project);
    Logger.log(project, this.projects)
  }

  displayProjects() {
    Logger.log(this);
    const content = document.getElementById('content');

    this.projects.forEach((item, index) => {
      const project = document.createElement('div');
      project.className = "project";

      const projectTitle = document.createElement('header');
      projectTitle.className = "projectTitle";
      projectTitle.textContent = item.title;

      const projectDue = document.createElement('p');
      projectDue.className = "projectDue";
      projectDue.textContent = item.dueDate;

      const projectNumOfTodos = document.createElement('p');
      projectNumOfTodos.className = "projectNumOfTodos";
      projectNumOfTodos.textContent = item.todos.length;

      const displayTodoBtn = document.createElement('button');
      displayTodoBtn.textContent = "View Tasks";
      displayTodoBtn.className = "displayTodoBtn";
      displayTodoBtn.addEventListener('click', this.expandTodo);

      const addTodoBtn = document.createElement('button');
      addTodoBtn.className = "addTodoBtn";
      addTodoBtn.textContent = "Add Task";
      addTodoBtn.addEventListener('click', this.addTodo.bind(this));

      project.dataset.index = index;

      project.append(projectTitle, projectDue, projectNumOfTodos,
                     displayTodoBtn, addTodoBtn);

      this.displayTodos(project);


      content.appendChild(project);
    })
  }

  displayTodos(projectElement){
    const projectIndex = projectElement.dataset.index;

    // remove previous list of todos from display if it exists
    let l = projectElement.querySelector('.todoList');
    if(l) l.remove();

    const todoList = document.createElement('div');
    todoList.classList.add('hidden', 'todoList');

    this.projects[projectIndex].todos.forEach((item, index) => {
      const todo = document.createElement('div');
      todo.className = "todo";
      todo.dataset.index = index;

      const todoTitle = document.createElement('header');
      todoTitle.className = "todoTitle";
      todoTitle.textContent = item.title;

      const todoDescription = document.createElement('p');
      todoDescription.className = "todoDescription";
      todoDescription.textContent = item.description;

      const todoDueDate = document.createElement('p');
      todoDueDate.className = "todoDueDate";
      todoDueDate.textContent = item.dueDate;

      const todoStatus = document.createElement('p');
      todoStatus.className = "todoStatus";
      todoStatus.textContent = item.isComplete ? "complete" : "not complete";

      const deleteTodoBtn = document.createElement('button');
      deleteTodoBtn.className = "deleteTodoBtn";
      deleteTodoBtn.textContent = "Remove Task";
      deleteTodoBtn.addEventListener('click', this.deleteTodo.bind(this));

      todo.append(todoTitle, todoStatus, todoDueDate, todoDescription, deleteTodoBtn);
      todoList.appendChild(todo);
    })

    projectElement.appendChild(todoList);
  }

  expandTodo(e) {
    const todolist = e.target.parentElement.querySelector(".todoList");
    if(todolist.classList.value.includes("hidden")) {
      e.target.textContent = "Hide tasks";
    }
    else {
      e.target.textContent = "View tasks";
    }

    todolist.classList.toggle("hidden");
  }

  deleteTodo(e){
    const todoId = e.target.closest(".todo").dataset.index;
    const projectElement = e.target.closest(".project");
    const projectId = projectElement.dataset.index;

    // remove todo from project's list and update the display
    this.projects[projectId].removeTodo(todoId);
    this.displayTodos(projectElement);

    // simulate the click of 'view tasks' button so that the view 
    // doesn't collapse when user deletes a task
    projectElement.querySelector(".displayTodoBtn").click();

    this.updateNumberOfTodos(projectElement);
  }

  updateNumberOfTodos(projectElement) {
    const projectId = projectElement.dataset.index;

    projectElement.querySelector(".projectNumOfTodos").textContent = 
      this.projects[projectId].todos.length;
  }

  addModals() {
    const dialog = document.createElement('dialog');
    dialog.id = "addTodoDialog";
    dialog.innerHTML = `
      <form action="">
        <button type="button" id="closeDialogBtn">x</button>
        <header>Add new Task</header>
        <label for="todoTitle">Title*:</label>
        <input id="todoTitle" type="text" name="title" placeholder="Title" required>
        <label for="todoDescription">Description*:</label>
        <textarea rows="" cols="" id="todoDescription"></textarea>
        <label for="todoDate">Date:</label>
        <input type="date" id="todoDate" name="date">
        <label for="todoPriority">Priority:</label>
        <input type="range" id="todoPriority" name="priority">
        <button type="submit">Add Task</button>
      </form>
`
    document.body.appendChild(dialog);
    const closeBtn = document.getElementById("closeDialogBtn");
    const form = dialog.querySelector('form');

    form.addEventListener('submit', e => {
      e.preventDefault();
      let index = dialog.dataset.index;
      let projectElement = document.querySelectorAll('.project')[index];
      let formData = Object.fromEntries(new FormData(form));
      this.projects[index].addTodo(new Todo(formData.title, formData.description, formData.date, formData.priority));
      this.displayTodos(projectElement)
      this.updateNumberOfTodos(projectElement)
      projectElement.querySelector(".displayTodoBtn").click();

      form.reset();
      dialog.close();
    })

    closeBtn.addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => form.reset());
  }

  addTodo(e) {
    const dialog = document.getElementById("addTodoDialog");
    dialog.dataset.index = e.target.parentElement.dataset.index;
    dialog.showModal();
  }
}

export default DisplayController;
