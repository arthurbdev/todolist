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

      project.append(proj_name, proj_due);
      project.append(projectName, projectDue);
      project.append(projectTitle, projectDue);
      content.appendChild(project);
    })
  }

}

export default DisplayController;
