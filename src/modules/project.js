import Logger from "./logger";

class Project {
  constructor(title, dueDate, todos) {
    this.title = title;
    this.dueDate = dueDate;
    this.todos = todos;
  }


  addTodo(todo){
    this.todos.push(todo);
    Logger.log(todo, this.todos);
  }
}

export default Project;
