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

      const proj_name = document.createElement('h1');
      proj_name.className = "projectName";
      proj_name.textContent = item.name;

      const proj_due = document.createElement('p');
      proj_due.className = "projDue";
      proj_due.textContent = item.dueDate;

      project.append(proj_name, proj_due);
      content.appendChild(project);
    })
  }

}

export default DisplayController;
