import Logger from "./logger";

class Project {
  constructor(title, dueDate, todos = []) {
    this.title = title;
    this.dueDate = dueDate;
    this.todos = todos;
  }

  checkCompletion(){
    let c = true;
    this.todos.forEach(todo => {
      if(!todo.isComplete) c = false;
    });
    return c;
  }

  //how many tasks are done
  get completed() {
    return this.todos.reduce((count, todo) => {
      if(todo.isComplete) return count + 1;
      return count;
    }, 0);
  }

  // how many tasks are not done
  get incomplete() {
    return this.todos.length - this.completed;
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
