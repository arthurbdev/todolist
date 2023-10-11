import Logger from "./logger";

class DisplayController {
  constructor(projects = []){
    this.projects = projects;

  }

  addProject(project) {
    this.projects.push(project);
    Logger.log(project, this.projects)
  }


export default DisplayController;
