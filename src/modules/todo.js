class Todo {
  constructor(title, description, dueDate, priority=1) {
    this.title = title;
    this.description = description;
    this.dueDate= dueDate;
    this.priority = priority;
    this.isComplete = false;
  }

  toggleCompletion() {
    this.isComplete = !this.isComplete;
  }
}

export default Todo;
