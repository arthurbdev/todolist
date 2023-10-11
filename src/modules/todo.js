class Todo {
  constructor(title, description, dueDate, priority, project=null) {
    this.title = title;
    this.description = description;
    this.dueDate= dueDate;
    this.priority = priority;
    this.project = project;
    this.isComplete = false;
  }

  toggleCompletion() {
    this.isComplete = !this.isComplete;
  }
}

export default Todo;
