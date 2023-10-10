import './styles/style.css';
import Logger from './modules/logger';
import Todo from './modules/todo';
import Project from './modules/project';

const testTodo = new Todo('name', 'desc', new Date(Date.now()), 1);
const testProject = new Project('Project1', new Date(Date.now()), []);
testProject.addTodo(testTodo);
Logger.log(testProject);
