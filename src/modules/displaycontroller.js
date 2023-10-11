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
      project.append(projectTitle, projectDue, projectNumOfTodos);
      content.appendChild(project);
    })
  }

}

export default DisplayController;
