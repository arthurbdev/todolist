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

  get priority(){
    switch (this.pr) {
      case 1: return 'low';
      case 2: return 'medium';
      case 3: return 'high';
      default: return null;
    }
  }

  set priority(pr) {
    this.pr = pr;
  }

}

export default Todo;
