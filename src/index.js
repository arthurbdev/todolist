import './styles/style.css';
import Logger from './modules/logger';
import Todo from './modules/todo';

const testTodo = new Todo('name', 'desc', Date.now(), 1)
Logger.log(testTodo);
