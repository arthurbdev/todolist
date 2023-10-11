import './styles/style.css';
import Logger from './modules/logger';
import Todo from './modules/todo';
import Project from './modules/project';
import DisplayController from './modules/displaycontroller';

const testTodo = new Todo('name', 'desc', new Date(Date.now()), 1);
const testProject = new Project('Project1', new Date(Date.now()), []);
testProject.addTodo(testTodo);
Logger.log(testProject);
const displayController = new DisplayController();
displayController.addProject(testProject);

for(let i = 0; i < 5; i++) {
  displayController.addProject(new Project(`Project ${i}`, new Date(Date.now()), []));
}
Logger.log(displayController);

displayController.displayProjects();
