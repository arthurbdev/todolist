import Todo from "./todo";
import Project from "./project";
import format from "date-fns/format";
import { differenceInCalendarDays, differenceInDays, isPast } from "date-fns";

import expandTodoListSvg from '../assets/icons/chevron-left.svg';
import editSvg from '../assets/icons/pencil.svg';
import addTodoSvg from '../assets/icons/pen-plus.svg';
import editTodoSvg from '../assets/icons/editTodo.svg';
import deleteSvg from '../assets/icons/delete-outline.svg';
import expandTodoSvg from '../assets/icons/information-outline.svg';
import checkmarkSvg from '../assets/icons/check-icn.svg';
import checkCircleSvg from '../assets/icons/check-circle-outline.svg';
import cancelSvg from '../assets/icons/cancel.svg';

class DisplayController {
  constructor(projects = [], todolist =[], dateFormat = "dd MMM yyyy"){
    this.projects = projects;
    this.todolist = todolist;
    this.dateFormat = dateFormat;

    document.addEventListener('mousedown', e => document.lastClick = e);
    this.addSideBarEventListeners();
  }

  addSideBarEventListeners(){
    document.getElementById('addProjectBtn').addEventListener('click', this.showAddProjectDialog)
    document.getElementById("sideBarOverdueTasks").addEventListener('click', e => this.displayTodoList());
  }

  displayTodoList(){
    const content = document.getElementById("content");
    content.innerHTML = "";
    content.dataset.state = "todolist";
    const todolist = this.createElement("div", "project");
    const header = this.createElement("header", ".todoListHeader")
    const list = this.createElement("div", "todoLlist")
    this.projects.forEach((proj, i) => {
      let overdue = proj.todos.filter(todo => {
        return differenceInCalendarDays(todo.dueDate, Date.now()) <= 1 && !todo.isComplete;
      })

      overdue.forEach((todo, k) => {
        let newtodo = this.createTodoElement(header,i, todo,k)
        setInterval(() => newtodo.classList.remove("added"), 100)
        list.appendChild(newtodo);
      })
    })
    header.textContent = "Todo List";
    todolist.appendChild(header);
    todolist.appendChild(list)
    content.appendChild(todolist);
  }

  addStylingToDueDate(dueDateElement, dueDate) {
    const ONE_DAY = 1000 * 60 * 60 * 24;
    const differenceMs = Math.abs(dueDate - Date.now());
    const daysLeft = Math.round(differenceMs / ONE_DAY)

    switch(true){
      case isPast(dueDate) || daysLeft <= 1:
        dueDateElement.style.backgroundColor = 'red';
        break;
      case daysLeft <= 7:
        dueDateElement.style.backgroundColor = 'yellow';
        break;
      case daysLeft <=30:
      default:
        dueDateElement.style.backgroundColor = 'lightgreen';
    }
  }

  displayOverDueProjects(){
    // document.getElementById("content");
    // content.innerHTML = "";
    const projList = this.projects.filter(proj => {
      return differenceInCalendarDays(proj.dueDate, Date.now()) <= 1;
    });
    this.displayProjects(projList, "overdue")
  }

  displayCompleteProjects(){
    const projList = this.projects.filter(proj => {
      return proj.checkCompletion();
    })

    this.displayProjects(projList, "complete");
  }

  updateSideBarProjectList(){
    const projectList = document.getElementById("sideBarProjectList");
    projectList.innerHTML = "";
    const projectsLink = this.createElement("a", "sideBarProjectLink", "Projects");
    const content = document.getElementById("content");
    projectList.appendChild(projectsLink);
    projectsLink.addEventListener('click', e => this.displayProjects());

    const overdue = this.createElement("li", "sideBarProject");
    overdue.appendChild(this.createElement("a", "sideBarProjectLink", "Overdue"));
    projectList.appendChild(overdue);
    overdue.addEventListener('click', e => this.displayOverDueProjects());

    const complete = this.createElement("li", "sideBarProject");
    complete.appendChild(this.createElement("a", "sideBarProjectLink", "Completed"))
    complete.addEventListener('click', e => this.displayCompleteProjects());
    projectList.appendChild(complete);

    this.projects.forEach((project, index) => {
      const li = this.createElement("li", "sideBarProject");
      const link = this.createElement("a", "sideBarProjectLink", project.title)
      link.addEventListener('click', e => {
        if(content.dataset.state !== "default") {
          this.displayProjects();
        }
        let el = document.getElementById("content").children[index];
        if(el.querySelector('.todoList').classList.contains("hidden")){ 
          this.expandTodoList(el);
        } 

        el.scrollIntoView({ behavior: 'smooth', block: 'center'});
        el.classList.add("highlight")
        setTimeout(() => el.classList.remove("highlight"), 2000);
      })
      li.appendChild(link);
      projectList.appendChild(li);
    })
  }

  addProject(project) {
    this.projects.push(project);
    this.displayProjects();
    this.expandTodoList(document.querySelectorAll('.project')[this.projects.length - 1]);
  }

  createElement(tag, className, textContent=null) {
    const element = document.createElement(tag);
    element.className = className;
    element.textContent = textContent;
    return element;
  }

  formatDate = date => format(date, this.dateFormat);
  

  updateProgressBar(projectElement) {
    const index = projectElement.dataset.index;
    const project = this.projects[index];
    const bar = projectElement.querySelector('.bar');
    const progress = projectElement.querySelector('.progress');
    bar.textContent = `${project.completed} / ${project.todos.length}`
    let percent = project.completed / project.todos.length * 100
    // if (percent) bar.innerHTML = percent + '%'
    bar.style.width = percent + '%'

    switch(true) {
      case percent === 0:
        bar.className = "bar";
        break;
      case percent <= 30: 
        bar.className = "bar";
        bar.classList.add("highPriority");
        break;
      case percent <= 99:
        bar.className = "bar";
        bar.classList.add("mediumPriority");
        break;
      case percent === 100:
        bar.className = "bar";
        bar.classList.add("lowPriority");
        break;
    }

  }

  displayProjects(projectList=this.projects, state = "default") {
    const content = document.getElementById("content");
    content.innerHTML = ''
    content.dataset.state = state;

    projectList.forEach((item, index) => {
      const project = this.createElement("div", "project")
      project.dataset.index = this.projects.indexOf(item);

      const projectTitle = this.createElement("header", "projectTitle", item.title);

      const progressText = this.createElement("p", "projectProgress", "Progress");

      const tableOfContentsSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      tableOfContentsSVG.setAttribute("viewBox", "0 0 24 24");
      tableOfContentsSVG.setAttribute("fill", "currentColor");
      tableOfContentsSVG.innerHTML = `<title>table-of-contents</title><path d="M3,9H17V7H3V9M3,13H17V11H3V13M3,17H17V15H3V17M19,17H21V15H19V17M19,7V9H21V7H19M19,13H21V11H19V13Z" />`;

      const projectDue = this.createElement("p", "projectDue")
      if(item.dueDate) projectDue.textContent = this.formatDate(item.dueDate);

      const projectNumOfTodos = this.createElement("p", "projectNumOfTodos",
      `${item.completed}/${item.todos.length}`);

      const progressBar = this.createElement("div", "progress");
      const bar = this.createElement("div", "bar");
      progressBar.appendChild(bar);

      const progressTextContainer = this.createElement("div", "progressTextContainer");
      progressTextContainer.append(tableOfContentsSVG, progressText,projectNumOfTodos)

      const icons = this.createElement("div", "projectIcons");
      const expandTodoList = new Image();
      expandTodoList.src = expandTodoListSvg;
      expandTodoList.classList.add("expandTodoListSvg")

      expandTodoList.addEventListener('click', e => this.expandTodoList(project));

      const addTodo = new Image();
      addTodo.src = addTodoSvg;
      addTodo.addEventListener('click', e => this.addTodo(project));

      const editProject = new Image();
      editProject.src = editSvg;
      editProject.addEventListener('click', e => this.showEditProjectDialog(e))

      icons.append(editProject, addTodo, expandTodoList);
 
      project.append(projectTitle,progressTextContainer, progressBar,
                     projectDue, icons);

      this.displayTodos(project);
      this.updateProgressBar(project);
      this.addStylingToDueDate(projectDue, item.dueDate);

      content.appendChild(project);

      project.classList.add("addedProjects")
      setInterval(() => { project.classList.remove("addedProjects")}, 50 * index)
    })
    this.updateSideBarProjectList();
  }

  createTodoElement(projectElement, projectIndex, todo, index){
      const todoElement= this.createElement("div", "todo");
      todoElement.dataset.index = index;
      todoElement.classList.add("added");

      const todoTitle = this.createElement("input", "todoTitle");
      todoTitle.type = "text";
      todoTitle.disabled = true;
      todoTitle.value = todo.title;
      todoTitle.addEventListener('focusout', e => { 
        if (document.lastClick.target === editTodoBtn) return;
        todoTitle.value = todo.title;
        todoTitle.disabled = true;
        editTodoBtn.src = editTodoSvg;
        todoTitle.dataset.state = "disabled";
      });
      todoTitle.addEventListener('keypress', e => {
        if(e.key === "Enter") editTodoBtn.click();
      })

      todoTitle.dataset.state = "disabled";

      const todoStatus = this.createElement("input", "todoStatus");
      todoStatus.id = `todoStatus${projectIndex}-${index}`
      todoStatus.type = "checkbox";
      if(todo.isComplete) {
        todoStatus.checked = true;
        todoTitle.classList.toggle('todoTitleComplete');
        todoElement.classList.toggle('todoComplete');
      }

      todoStatus.addEventListener('change', () => {
        todo.toggleCompletion();
        todoTitle.classList.toggle('todoTitleComplete');
        todoElement.classList.toggle('todoComplete');
        this.updateNumberOfTodos(projectElement);
        this.updateProgressBar(projectElement);
      })

      const deleteTodoBtn = new Image();
      deleteTodoBtn.src = deleteSvg;
      deleteTodoBtn.addEventListener('click', e => {
        todoElement.classList.toggle("removed");
        setTimeout(() => this.deleteTodo(e), 700);
      });

      const editTodoBtn = new Image();
      editTodoBtn.src = editTodoSvg;
      editTodoBtn.className = "editTodoBtn";
      editTodoBtn.addEventListener('click', e => {
        switch(todoTitle.dataset.state) {
          case 'disabled':
            todoTitle.disabled = false;
            todoTitle.focus();
            todoTitle.setSelectionRange(0, todoTitle.value.length);
            editTodoBtn.src = checkmarkSvg;
            todoTitle.dataset.state = 'edit';
            break;
          case 'edit':
            todo.title = todoTitle.value;
            editTodoBtn.src = editTodoSvg;
            todoTitle.dataset.state = "disabled";
            todoTitle.blur();
            break;
        }
      });

      const confirmEditTitleBtn = new Image();
      confirmEditTitleBtn.src = checkmarkSvg;

      const expandTodoBtn = new Image();
      expandTodoBtn.src = expandTodoSvg;
      expandTodoBtn.className = "expandTodoBtn";

      expandTodoBtn.addEventListener('click', e => this.expandTodo(todoElement));

      const todoDetails = this.createElement("div", "todoDetails");
      todoDetails.classList.add("hidden");

      const todoDueDate = this.createElement("input", "todoDueDate");
      // only display the due date if it is defined
      todoDueDate.type = "date";
      // todoDueDate.disabled = true;
      todoDueDate.addEventListener("change", e => {
        this.addStylingToDueDate(todoDueDate, new Date(todoDueDate.value));
      });
      if(todo.dueDate) {
       todoDueDate.value = format(todo.dueDate, "yyyy-MM-dd");
      }

      const todoPriority = this.createElement("div", "todoPriority");
      ["low", "medium", "high"].forEach((priority,i) => {
        const priorityElement = this.createElement("input", `${priority}Priority`);
        priorityElement.type = "radio";
        // priorityElement.value = priority;
        priorityElement.value = i + 1;
        priorityElement.name = `priority${projectIndex}-${index}`;
        priorityElement.id = `todo${priority}Priority${projectIndex}-${index}`;
        const priorityLabelElement = this.createElement("label", `${priority}PriorityLabel`);
        priorityLabelElement.textContent = priority;
        priorityLabelElement.htmlFor = priorityElement.id;

        if(todo.priority === priority) priorityElement.checked = true;

        priorityElement.addEventListener("change", e => {
          this.todoSetPriorityClass(todoElement, priority);
        })
        todoPriority.append(priorityElement,priorityLabelElement);
      }) 
      
      const todoDescription = this.createElement("textarea", "todoDescription", todo.description);
      todoDescription.rows = 3;

      const todoEditButtons = this.createElement("div", "todoEditButtons hidden")
      const todoCancelEditBtn = this.createElement("button", "todoCancelEditBtn", "Cancel");
      const todoConfirmEditBtn = this.createElement("button", "todoConfirmEditBtn", "Confirm Changes")

      const todoCancelSvg = new Image();
      todoCancelSvg.src = cancelSvg;
      todoCancelEditBtn.appendChild(todoCancelSvg)

      const todoConfirmSvg = new Image();
      todoConfirmSvg.src = checkCircleSvg;
      todoConfirmEditBtn.appendChild(todoConfirmSvg);

      todoEditButtons.append(todoCancelEditBtn, todoConfirmEditBtn);

      todoDetails.append(todoDescription, todoDueDate, todoPriority, todoEditButtons);

      todoDetails.querySelectorAll("input, textarea").forEach(elem => {
        elem.addEventListener('change', e=> {
          todoEditButtons.classList.remove("hidden");
        });
      })

      todoCancelEditBtn.addEventListener("click", e => {
        todoDescription.value = todo.description;
        this.todoSetPriorityClass(todoElement, todo.priority);
        if(todo.Duedate) {
          todoDueDate.value = format(todo.dueDate, "yyyy-MM-dd");
        }
        else todoDueDate.value = null;
        this.addStylingToDueDate(todoDueDate, todo.dueDate);
        for(let pr of todoPriority.children){
          if(todo.pr === parseInt(pr.value)) pr.checked = true; 
        }
        todoEditButtons.classList.add("hidden");
      })

      todoConfirmEditBtn.addEventListener("click", e => {
        todo.description = todoDescription.value;
        todo.dueDate = todoDueDate.value ? new Date(todoDueDate.value) : null;
        for(let pr of todoPriority.children) {
          if(pr.checked) todo.pr = parseInt(pr.value);
        }
        todoEditButtons.classList.add("hidden");
        this.todoSetPriorityClass(todoElement, todo.priority)
        // item.dueDate = todoDueDate.value;
      })

      todoElement.append(todoStatus, todoTitle,
        expandTodoBtn, editTodoBtn, deleteTodoBtn, todoDetails);

      todoElement.classList.add(`todo${todo.priority}Priority`);
      this.addStylingToDueDate(todoDueDate, todo.dueDate);
      return todoElement;
  }

  displayTodos(projectElement){
    const projectIndex = projectElement.dataset.index;

    // remove previous list of todos from display if it exists
    let l = projectElement.querySelector('.todoList');
    if(l) l.remove();

    const todoList = document.createElement('div');
    todoList.classList.add('hidden', 'todoList');
    projectElement.appendChild(todoList);

    this.projects[projectIndex].todos.forEach((item, index) => {
      let todo = this.createTodoElement(projectElement, projectIndex, item, this.projects[projectIndex].todos.indexOf(item));
      projectElement.querySelector('.todoList').appendChild(todo);
    })
  }

  todoSetPriorityClass(todoElement, priority) {
      todoElement.classList.forEach(classitem => {
        if(classitem.indexOf("Priority") > -1) todoElement.classList.remove(classitem);
      })
      todoElement.classList.add(`todo${priority}Priority`);
  }

  }

  expandTodoList(projectElement) {
    const todolist = projectElement.querySelector(".todoList");
    if(todolist.classList.contains("hidden")) {
      projectElement.querySelector(".expandTodoListSvg").classList.add("rotate");

      for(let i = 0; i < todolist.children.length; i++) {
        todolist.children[i].style.transitionDelay = `${200*i}ms`;
        todolist.children[i].classList.remove("added");
      }
    }
    else {
      projectElement.querySelector(".expandTodoListSvg").classList.remove("rotate");
      todolist.querySelectorAll('.todoDetails').forEach(el => {
        if(!el.classList.contains("hidden")) this.expandTodo(el.closest('.todo'));
      })
      let reversed = [...todolist.children].reverse();
      reversed.forEach((el, i) => {
        el.style.transitionDelay = `${100*i}ms`;
        el.classList.add("added");
      })
    }

    // reset the transition Delay after animations are done
    setTimeout(() => { 
        [...todolist.children].forEach(e => e.style.transitionDelay = `0ms`) }, 100*todolist.children.length)

    // if there are no todos in a project, hide the list
    if(!todolist.firstChild) {
      todolist.classList.add("hidden");
      return;
    }

    todolist.classList.toggle("hidden");
    
    if (todolist.style.maxHeight) {
      todolist.style.maxHeight = null;
    }
    else {
      todolist.style.maxHeight = `${500 * todolist.children.length}px`;
    }
  }

  deleteTodo(e){
    const todo = e.target.closest(".todo");
    todo.classList.toggle("removed");
    const todoList = todo.parentElement;
    const todoId = e.target.closest(".todo").dataset.index;
    const projectElement = e.target.closest(".project");
    const projectId = projectElement.dataset.index;

    this.projects[projectId].removeTodo(todoId);
    todoList.removeChild(todo);
  }

  updateNumberOfTodos(projectElement) {
    const projectId = projectElement.dataset.index;
    const project = this.projects[projectId];

    projectElement.querySelector(".projectNumOfTodos").textContent = 
      `${project.completed}/${project.todos.length}`
  }

  addModals() {
    const addProjectDialog = document.createElement('dialog');
    addProjectDialog.id = "addProjectDialog";
    addProjectDialog.innerHTML = `
      <form action="">
        <button type="button" class="closeDialogBtn">x</button>
        <header>Add new Project</header>
        <label >Title*:
          <input class="inputTitle" type="text" name="title" placeholder="Title" required>
        </label>
        <label >Date:
          <input type="date" class="inputDate" name="date">
        </label>
        <button class="submitBtn" type="submit">Add Project</button>
      </form>
`
    const addTodoDialog = document.createElement('dialog');
    addTodoDialog.id = "addTodoDialog";
    addTodoDialog.innerHTML = `
      <form action="">
        <button type="button" class="closeDialogBtn">x</button>
        <header>Add new Task</header>
        <label >Title*:
          <input class="inputTitle" type="text" name="title" placeholder="Title" required>
        </label>
        <label >Description*:
          <textarea name="description" rows="" cols="" class="inputDescription"></textarea>
        </label>
        <label >Date:
          <input type="date" class="inputDate" name="date">
        </label>
        <label class="priorityLabel">Priority:
          <input type="range" class="inputPriority" min="1" max="3"  value = "1" name="priority" list="values">
          <datalist id="values">
            <option value="1" label="low"></option>
            <option value="2" label="medium"></option>
            <option value="3" label="high"></option>
          </datalist>
        </label>
        <button class="submitBtn" type="submit">Add Task</button>
      </form>
`
    // clone the add task dialog and make a few changes
    const editTodoDialog = addTodoDialog.cloneNode(true);
    editTodoDialog.id = "editTodoDialog";
    editTodoDialog.querySelector('.submitBtn').textContent = "Save changes";
    editTodoDialog.querySelector('header').textContent = "Edit task";

    const editProjectDialog = addProjectDialog.cloneNode(true);
    editProjectDialog.id = "editProjectDialog";
    editProjectDialog.querySelector('.submitBtn').textContent = "Save changes";
    editProjectDialog.querySelector('header').textContent = "Edit project";

    const addProjectForm = addProjectDialog.querySelector('form');
    const editProjectForm = editProjectDialog.querySelector('form');
    const addTodoForm = addTodoDialog.querySelector('form');
    const editTodoForm = editTodoDialog.querySelector('form');

    document.body.append(addTodoDialog, editTodoDialog, addProjectDialog, editProjectDialog);

    addTodoForm.addEventListener('submit', e => {
      e.preventDefault();
      const index = addTodoDialog.dataset.index;
      const projectElement = document.querySelectorAll('.project')[index];
      let formData = Object.fromEntries(new FormData(addTodoForm));
      if(formData.date) formData.date = new Date(formData.date);
      this.projects[index].addTodo(new Todo(formData.title, 
        formData.description, formData.date, parseInt(formData.priority)));

      this.updateTodoList(projectElement);

      addTodoForm.reset();
      addTodoDialog.close();
    });

    addTodoDialog.addEventListener('close', () => addTodoForm.reset());

    addProjectForm.addEventListener('submit', e => {
      e.preventDefault();
      let formData = Object.fromEntries(new FormData(addProjectForm));
      console.log(formData.date)
      if(formData.date) formData.date = new Date(formData.date);
      this.addProject(new Project(formData.title, formData.date));

      addProjectForm.reset();
      addProjectDialog.close();

    });
    addProjectDialog.addEventListener('close', () => addTodoForm.reset());

    editProjectForm.addEventListener('submit', e => {
      e.preventDefault();
      let formData = Object.fromEntries(new FormData(editProjectForm));
      const index = editProjectDialog.dataset.index;
      const project = this.projects[index];

      project.title = formData.title;
      if(!formData.date) project.dueDate = null;
      else project.dueDate = new Date(formData.date);
      this.displayProjects();

      editProjectDialog.close();
    })

    editTodoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const projectIndex = editTodoDialog.dataset.projectIndex;
      const todoIndex = editTodoDialog.dataset.todoIndex;
      const formData = Object.fromEntries(new FormData(editTodoForm));
      let todo = this.projects[projectIndex].todos[todoIndex];

      todo.title = formData.title;
      todo.description = formData.description;
      // if inputfield has no date, reset the task due date, otherwise
      // set task date to inputfield date
      if(!formData.date) todo.dueDate = null;
      else todo.dueDate = new Date(formData.date);

      todo.priority = parseInt(formData.priority);

      const projectElement = document.querySelectorAll('.project')[projectIndex];
      this.updateTodoList(projectElement);
      
      editTodoDialog.close();
    });

    // each close button closes its repsective dialog
    document.querySelectorAll('.closeDialogBtn').forEach(button => {
      button.addEventListener('click', () => 
        button.closest('dialog').close());
    });
  }

  updateTodoList(projectElement) {
    this.displayTodos(projectElement);
    this.expandTodoList(projectElement);
    this.updateNumberOfTodos(projectElement);
    this.updateProgressBar(projectElement);
  }

  addTodo(projectElement) {
    const todolist = projectElement.querySelector(".todoList");
    const projIndex = projectElement.dataset.index;

    const newTodo = new Todo("New task", "", null);
    this.projects[projIndex].addTodo(newTodo);
    const newId = this.projects[projIndex].todos.length - 1;
    const newEl = this.createTodoElement(projectElement, projIndex, newTodo, newId)
    todolist.appendChild(newEl)
    if(!todolist.classList.contains("hidden")) this.expandTodoList(projectElement);
    this.expandTodoList(projectElement);
    setTimeout(() => newEl.scrollIntoView({behavior: 'smooth', block: 'center'}), 500);
    newEl.querySelector(".expandTodoBtn").click()
    newEl.querySelector(".editTodoBtn").click()
  }


  editTodo(e) {
    const dialog = document.getElementById("editTodoDialog");
    const todoIndex =  e.target.parentElement.dataset.index;
    const projectIndex = e.target.closest('.project').dataset.index;
    dialog.dataset.todoIndex = todoIndex;
    dialog.dataset.projectIndex = projectIndex;
    let todo = this.projects[projectIndex].todos[todoIndex];
    dialog.querySelector('.inputTitle').value = todo.title;
    dialog.querySelector('.inputDescription').value = todo.description;
    dialog.querySelector('.inputPriority').value = todo.pr;

    const date = dialog.querySelector('.inputDate');
    // if task has date, sets the date on the inputfield, otherwise
    // make the input field blank
    if (todo.dueDate) date.value = format(todo.dueDate, "yyyy-MM-dd");
    else date.value = null;


    // TODO: change the project of  a todo
    // const projectSelect = document.createElement('select');
    // this.projects.forEach((item, index) => {
    //   let option = document.createElement('option');
    //   option.textContent = item.title;
    //   option.value = index;
    //   projectSelect.appendChild(option);
    // })
    // dialog.appendChild(projectSelect)
    dialog.showModal();
  }

  showAddProjectDialog = e => document.getElementById("addProjectDialog").showModal();
  
  showEditProjectDialog(e){
    const dialog = document.getElementById("editProjectDialog");
    const projectIndex = parseInt(e.target.parentElement.dataset.index);

    const project = this.projects[projectIndex];
    dialog.dataset.index = projectIndex;

    const dateInput = dialog.querySelector('.inputDate');
    dialog.querySelector('.inputTitle').value = project.title;
    if (project.dueDate) dateInput.value = format(project.dueDate, "yyyy-MM-dd");
    else dateInput.value = null;

    dialog.showModal();
  }
}

export default DisplayController;
