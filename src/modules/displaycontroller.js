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

      const projectName = document.createElement('h1');
      projectName.className = "projectName";
      projectName.textContent = item.name;

      const projectDue = document.createElement('p');
      projectDue.className = "projectDue";
      projectDue.textContent = item.dueDate;

      project.append(proj_name, proj_due);
      project.append(projectName, projectDue);
      content.appendChild(project);
    })
  }

}

export default DisplayController;
