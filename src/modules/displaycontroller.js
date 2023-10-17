import Logger from "./logger";

class DisplayController {
  constructor(projects = [], dateFormat = "dd MMM yyyy"){
    this.projects = projects;
    this.dateFormat = dateFormat;

    const btn = document.createElement('button')
    btn.textContent = "add project";
    document.body.appendChild(btn)
    btn.addEventListener('click', this.showAddProjectDialog)
  }

  addProject(project) {
    this.projects.push(project);
    this.displayProjects();
    this.expandTodoList(document.querySelectorAll('.project')[this.projects.length - 1]);
  }

  createElement(tag, className, textContent=null) {
    const element = document.createElement(tag);
    element.className = className;
    element.textContent = textContent;
    return element;
  }

  formatDate = date => format(date, this.dateFormat);
  

  updateProgressBar(projectElement) {
    const index = projectElement.dataset.index;
    const project = this.projects[index];
    const bar = projectElement.querySelector('.bar');
    let percent = project.completed / project.todos.length * 100
    // bar.innerHTML = `${project.completed} / ${project.todos.length}`
    if (percent) bar.innerHTML = percent + '%'
    bar.style.width = percent + '%'

    switch(true) {
      case percent <= 30: 
        bar.style.backgroundColor = 'red';
        break;
      case percent <= 99:
        bar.style.backgroundColor = 'yellow';
        break;
      case percent === 100:
        bar.style.backgroundColor = 'lightgreen';
        break;
    }

  }

  displayProjects() {
    Logger.log(this);
    const content = document.getElementById("content");
    content.innerHTML = ''

    this.projects.forEach((item, index) => {
      const project = this.createElement("div", "project")
      project.dataset.index = index;

      const projectTitle = this.createElement("header", "projectTitle", item.title);


      const projectDue = this.createElement("p", "projectDue")
      if(item.dueDate) projectDue.textContent = this.formatDate(item.dueDate);

      const projectNumOfTodos = this.createElement("p", "projectNumOfTodos",
      `${item.completed}/${item.todos.length}`);

      const displayTodoBtn = this.createElement("button", "displayTodoBtn", "View Tasks");
      displayTodoBtn.addEventListener('click', () => this.expandTodoList(project));

      const progress = this.createElement("div", "progress");
      const bar = this.createElement("div", "bar");
      progress.appendChild(bar);

      const addTodoBtn = this.createElement("button", "addTodoBtn", "Add Task");

      addTodoBtn.addEventListener('click', this.addTodo.bind(this));

      const editProjectBtn = this.createElement("button", "editProjectBtn", "Edit project");
      editProjectBtn.addEventListener('click', this.showEditProjectDialog.bind(this));

 
      project.append(projectTitle, projectDue, projectNumOfTodos,
                     progress, displayTodoBtn, addTodoBtn, editProjectBtn);

      this.displayTodos(project);
      this.updateProgressBar(project);

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
      todoStatus.addEventListener('click', () => {
        item.toggleCompletion();
        this.updateNumberOfTodos(projectElement);
        this.updateProgressBar(projectElement);
        todoStatus.textContent = item.isComplete ? "complete" : "not complete";
      })

      // todoTitle.addEventListener('click', () => {
      //   this.updateNumberOfTodos(projectElement);
      //   item.toggleCompletion();
      //   todoStatus.textContent = item.isComplete ? "complete" : "not complete";
      // })
      //

      const todoPriority = this.createElement("p", "todoPriority", item.priority); 

      const deleteTodoBtn = this.createElement("button", "deleteTodoBtn", "Remove Task");
      deleteTodoBtn.addEventListener('click', this.deleteTodo.bind(this));

      const editTodoBtn = this.createElement("button", "editTodoBtn", "Edit Task");
      editTodoBtn.addEventListener('click', this.editTodo.bind(this));

      todo.append(todoTitle, todoStatus, todoDueDate, todoDescription, 
                  todoPriority, deleteTodoBtn, editTodoBtn);
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
    const project = this.projects[projectId];

    projectElement.querySelector(".projectNumOfTodos").textContent = 
      `${project.completed}/${project.todos.length}`
  }

  addModals() {
    const addProjectDialog = document.createElement('dialog');
    addProjectDialog.id = "addProjectDialog";
    addProjectDialog.innerHTML = `
      <form action="">
        <button type="button" class="closeDialogBtn">x</button>
        <header>Add new Project</header>
        <label >Title*:
          <input class="inputTitle" type="text" name="title" placeholder="Title" required>
        </label>
        <label >Date:
          <input type="date" class="inputDate" name="date">
        </label>
        <button class="submitBtn" type="submit">Add Project</button>
      </form>
`
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
        <label class="priorityLabel">Priority:
          <input type="range" class="inputPriority" min="1" max="3"  value = "1" name="priority" list="values">
          <datalist id="values">
            <option value="1" label="low"></option>
            <option value="2" label="medium"></option>
            <option value="3" label="high"></option>
          </datalist>
        </label>
        <button class="submitBtn" type="submit">Add Task</button>
      </form>
`
    // clone the add task dialog and make a few changes
    const editTodoDialog = addTodoDialog.cloneNode(true);
    editTodoDialog.id = "editTodoDialog";
    editTodoDialog.querySelector('.submitBtn').textContent = "Save changes";
    editTodoDialog.querySelector('header').textContent = "Edit task";

    const editProjectDialog = addProjectDialog.cloneNode(true);
    editProjectDialog.id = "editProjectDialog";
    editProjectDialog.querySelector('.submitBtn').textContent = "Save changes";
    editProjectDialog.querySelector('header').textContent = "Edit project";

    const addProjectForm = addProjectDialog.querySelector('form');
    const editProjectForm = editProjectDialog.querySelector('form');
    const addTodoForm = addTodoDialog.querySelector('form');
    const editTodoForm = editTodoDialog.querySelector('form');

    document.body.append(addTodoDialog, editTodoDialog, addProjectDialog, editProjectDialog);

    addTodoForm.addEventListener('submit', e => {
      e.preventDefault();
      const index = addTodoDialog.dataset.index;
      const projectElement = document.querySelectorAll('.project')[index];
      let formData = Object.fromEntries(new FormData(addTodoForm));
      if(formData.date) formData.date = new Date(formData.date);
      this.projects[index].addTodo(new Todo(formData.title, 
        formData.description, formData.date, parseInt(formData.priority)));

      this.updateTodoList(projectElement);

      addTodoForm.reset();
      addTodoDialog.close();
    });

    addTodoDialog.addEventListener('close', () => addTodoForm.reset());

    addProjectForm.addEventListener('submit', e => {
      e.preventDefault();
      let formData = Object.fromEntries(new FormData(addProjectForm));
      console.log(formData.date)
      if(formData.date) formData.date = new Date(formData.date);
      this.addProject(new Project(formData.title, formData.date));

      addProjectForm.reset();
      addProjectDialog.close();

    });
    addProjectDialog.addEventListener('close', () => addTodoForm.reset());

    editProjectForm.addEventListener('submit', e => {
      e.preventDefault();
      let formData = Object.fromEntries(new FormData(editProjectForm));
      const index = editProjectDialog.dataset.index;
      const project = this.projects[index];

      project.title = formData.title;
      if(!formData.date) project.dueDate = null;
      else project.dueDate = new Date(formData.date);
      this.displayProjects();

      editProjectDialog.close();
    })

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

      todo.priority = parseInt(formData.priority);

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
    this.updateProgressBar(projectElement);
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
    dialog.querySelector('.inputPriority').value = todo.pr;

    const date = dialog.querySelector('.inputDate');
    // if task has date, sets the date on the inputfield, otherwise
    // make the input field blank
    if (todo.dueDate) date.value = format(todo.dueDate, "yyyy-MM-dd");
    else date.value = null;


    // TODO: change the project of  a todo
    // const projectSelect = document.createElement('select');
    // this.projects.forEach((item, index) => {
    //   let option = document.createElement('option');
    //   option.textContent = item.title;
    //   option.value = index;
    //   projectSelect.appendChild(option);
    // })
    // dialog.appendChild(projectSelect)
    dialog.showModal();
  }

  showAddProjectDialog = e => document.getElementById("addProjectDialog").showModal();
  
  showEditProjectDialog(e){
    const dialog = document.getElementById("editProjectDialog");
    const projectIndex = parseInt(e.target.parentElement.dataset.index);

    const project = this.projects[projectIndex];
    dialog.dataset.index = projectIndex;

    const dateInput = dialog.querySelector('.inputDate');
    dialog.querySelector('.inputTitle').value = project.title;
    if (project.dueDate) dateInput.value = format(project.dueDate, "yyyy-MM-dd");
    else dateInput.value = null;

    dialog.showModal();
  }
}

export default DisplayController;
