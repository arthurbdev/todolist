import Logger from "./logger";

class Project {
  constructor(name, dueDate, todos) {
    this.name = name;
    this.dueDate = dueDate;
    this.todos = todos;
  }


  addTodo(todo){
    this.todos.push(todo);
    Logger.log(todo, this.todos);
  }
}

export default Project;
