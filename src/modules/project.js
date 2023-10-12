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

  removeTodo(index){
    this.todos.splice(index, 1);
    Logger.log(this.todos)
  }
}

export default Project;
