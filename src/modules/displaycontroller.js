import Logger from "./logger";

class DisplayController {
  constructor(projects = []){
    this.projects = projects;

  }

  addProject(project) {
    this.projects.push(project);
    Logger.log(project, this.projects)

  createElement(tag, className, textContent=null) {
    const element = document.createElement(tag);
    element.className = className;
    element.textContent = textContent;
    return element;
  }

  displayProjects() {
    Logger.log(this);
    const content = document.getElementById("content");

    this.projects.forEach((item, index) => {
      const project = this.createElement("div", "project")

      const projectTitle = this.createElement("header", "projectTitle", item.title);

      const projectDue = this.createElement("p", "projectDue", item.dueDate);

      const projectNumOfTodos = this.createElement("p", "projectNumOfTodos", item.todos.length);

      const displayTodoBtn = this.createElement("button", "displayTodoBtn", "View Tasks");
      displayTodoBtn.addEventListener('click', () => this.expandTodoList(project));

      const addTodoBtn = this.createElement("button", "addTodoBtn", "Add Task");
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
      const todo = this.createElement("div", "todo");
      todo.dataset.index = index;

      const todoTitle = this.createElement("header", "todoTitle", item.title);

      const todoDescription = this.createElement("p", "todoDescription", item.description);

      const todoDueDate = this.createElement("p", "todoDueDate", item.dueDate);

      const todoStatus = this.createElement("p", "todoStatus");
      todoStatus.textContent = item.isComplete ? "complete" : "not complete";

      const deleteTodoBtn = this.createElement("button", "deleteTodoBtn", "Remove Task");
      deleteTodoBtn.addEventListener('click', this.deleteTodo.bind(this));

      todo.append(todoTitle, todoStatus, todoDueDate, todoDescription, deleteTodoBtn);
      todoList.appendChild(todo);
    })

    projectElement.appendChild(todoList);
  }

  expandTodoList(projectElement) {
    const todolist = projectElement.querySelector(".todoList");
    const displayTodoBtn = projectElement.querySelector(".displayTodoBtn");

    // if there are no todos in a project, hide the button and the list
    if(!todolist.firstChild) {
      displayTodoBtn.style.display = 'none';
      todolist.classList.add("hidden");
      return;
    }
    else displayTodoBtn.style.display = '';

    if(todolist.classList.value.includes("hidden")) {
      displayTodoBtn.textContent = "Hide tasks";
    }
    else {
      displayTodoBtn.textContent = "View tasks";
    }

    todolist.classList.toggle("hidden");
  }

  deleteTodo(e){
    const todoId = e.target.closest(".todo").dataset.index;
    const projectElement = e.target.closest(".project");
    const projectId = projectElement.dataset.index;

    // remove todo from project's list and update the display
    this.projects[projectId].removeTodo(todoId);
    this.updateTodoList(projectElement);
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

      this.updateTodoList(projectElement);

      form.reset();
      dialog.close();
    })

    closeBtn.addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => form.reset());

  updateTodoList(projectElement) {
    this.displayTodos(projectElement);
    this.expandTodoList(projectElement);
    this.updateNumberOfTodos(projectElement);
  }

  addTodo(e) {
    const dialog = document.getElementById("addTodoDialog");
    dialog.dataset.index = e.target.parentElement.dataset.index;
    dialog.showModal();
  }
}

export default DisplayController;
