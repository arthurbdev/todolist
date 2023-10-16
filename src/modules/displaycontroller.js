import Logger from "./logger";

class DisplayController {
  constructor(projects = [], dateFormat = "dd MMM yyyy"){
    this.projects = projects;
    this.dateFormat = dateFormat;
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

  formatDate = date => format(date, this.dateFormat);
  

  displayProjects() {
    Logger.log(this);
    const content = document.getElementById("content");

    this.projects.forEach((item, index) => {
      const project = this.createElement("div", "project")

      const projectTitle = this.createElement("header", "projectTitle", item.title);

      const projectDue = this.createElement("p", "projectDue", this.formatDate(item.dueDate));

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

      const todoDueDate = this.createElement("p", "todoDueDate");
      // only display the due date if it is defined
      if(item.dueDate) {
       todoDueDate.textContent = this.formatDate(item.dueDate);
      }

      const todoStatus = this.createElement("p", "todoStatus");
      todoStatus.textContent = item.isComplete ? "complete" : "not complete";

      const deleteTodoBtn = this.createElement("button", "deleteTodoBtn", "Remove Task");
      deleteTodoBtn.addEventListener('click', this.deleteTodo.bind(this));

      const editTodoBtn = this.createElement("button", "editTodoBtn", "Edit Task");
      editTodoBtn.addEventListener('click', this.editTodo.bind(this));

      todo.append(todoTitle, todoStatus, todoDueDate, todoDescription, 
                  deleteTodoBtn, editTodoBtn);
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
    const addTodoDialog = document.createElement('dialog');
    addTodoDialog.id = "addTodoDialog";
    addTodoDialog.innerHTML = `
      <form action="">
        <button type="button" class="closeDialogBtn">x</button>
        <header>Add new Task</header>
        <label >Title*:
          <input class="inputTitle" type="text" name="title" placeholder="Title" required>
        </label>
        <label >Description*:
          <textarea name="description" rows="" cols="" class="inputDescription"></textarea>
        </label>
        <label >Date:
          <input type="date" class="inputDate" name="date">
        </label>
        <label >Priority:
          <input type="range" class="inputPriority" name="priority">
        </label>
        <button class="submitBtn" type="submit">Add Task</button>
      </form>
`
    // clone the add task dialog and make a few changes
    const editTodoDialog = addTodoDialog.cloneNode(true);
    editTodoDialog.id = "editTodoDialog";
    editTodoDialog.querySelector('.submitBtn').textContent = "Save changes";
    editTodoDialog.querySelector('header').textContent = "Edit task";

    const addTodoForm = addTodoDialog.querySelector('form');
    const editTodoForm = editTodoDialog.querySelector('form');

    document.body.append(addTodoDialog, editTodoDialog);

    addTodoForm.addEventListener('submit', e => {
      e.preventDefault();
      const index = addTodoDialog.dataset.index;
      const projectElement = document.querySelectorAll('.project')[index];
      let formData = Object.fromEntries(new FormData(addTodoForm));
      if(formData.date) formData.date = new Date(formData.date);
      this.projects[index].addTodo(new Todo(formData.title, 
        formData.description, formData.date, formData.priority));

      this.updateTodoList(projectElement);

      addTodoForm.reset();
      addTodoDialog.close();
    });

    addTodoDialog.addEventListener('close', () => addTodoForm.reset());

    editTodoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const projectIndex = editTodoDialog.dataset.projectIndex;
      const todoIndex = editTodoDialog.dataset.todoIndex;
      const formData = Object.fromEntries(new FormData(editTodoForm));
      let todo = this.projects[projectIndex].todos[todoIndex];

      todo.title = formData.title;
      todo.description = formData.description;
      // if inputfield has no date, reset the task due date, otherwise
      // set task date to inputfield date
      if(!formData.date) todo.dueDate = null;
      else todo.dueDate = new Date(formData.date);

      // todo.completion = formData.completion;
      // todo.priority = formData.priority;

      const projectElement = document.querySelectorAll('.project')[projectIndex];
      this.updateTodoList(projectElement);
      
      editTodoDialog.close();
    });

    // each close button closes its repsective dialog
    document.querySelectorAll('.closeDialogBtn').forEach(button => {
      button.addEventListener('click', () => 
        button.closest('dialog').close());
    });
  }

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

  editTodo(e) {
    const dialog = document.getElementById("editTodoDialog");
    const todoIndex =  e.target.parentElement.dataset.index;
    const projectIndex = e.target.closest('.project').dataset.index;
    dialog.dataset.todoIndex = todoIndex;
    dialog.dataset.projectIndex = projectIndex;
    let todo = this.projects[projectIndex].todos[todoIndex];
    dialog.querySelector('.inputTitle').value = todo.title;
    dialog.querySelector('.inputDescription').value = todo.description;

    const date = dialog.querySelector('.inputDate');
    // if task has date, sets the date on the inputfield, otherwise
    // make the input field blank
    if (todo.dueDate) date.value = format(todo.dueDate, "yyyy-MM-dd");
    else date.value = null;

  }
}

export default DisplayController;
