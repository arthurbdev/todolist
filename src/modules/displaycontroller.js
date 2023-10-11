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

      const projectTitle = document.createElement('h1');
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
      displayTodoBtn.addEventListener('click', this.displayTodos.bind(this));

      project.dataset.index = index;

      project.append(projectTitle, projectDue, projectNumOfTodos,
                     displayTodoBtn);

      content.appendChild(project);
    })
  }


  displayTodos(e){
    Logger.log(e.target.parentElement.dataset.index);
    const projectIndex = parseInt(e.target.parentElement.dataset.index);
    const todoList = document.createElement('div');
    todoList.className = "todoList";
    this.projects[projectIndex].todos.forEach(item => {
      Logger.log(item);
      const todo = document.createElement('div');
      todo.className = "todo";

      const todoTitle = document.createElement('h1');
      todoTitle.className = "todoTitle";
      todoTitle.textContent = item.title;

      const todoDescription = document.createElement('p');
      todoDescription.className = "todoDescription";
      todoDescription.textContent = item.description;

      const todoDueDate = document.createElement('p');
      todoDueDate.className = "todoDueDate";
      todoDueDate.textContent = item.dueDate;

      const todoStatus = document.createElement('p');
      todoStatus.className = "todoStatus"
      todoStatus.textContent = item.isComplete ? "complete" : "not complete";

      todo.append(todoTitle, todoStatus, todoDueDate, todoDescription);
      todoList.appendChild(todo);
    })
    e.target.parentElement.appendChild(todoList);
  }

}

export default DisplayController;
