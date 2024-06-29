import "./style.css";
import { domGenerator } from "./domGenerator";
import { screenController } from "./screenController";
import Project from "./project";
import Todo from "./todo";
import { format } from "date-fns";

class App {
  #projects = {};
  #projectList;
  #itemList;
  constructor() {
    //if no existing data, seed intial data
    if (localStorage.length === 0) {
      this.#projectList = [];
      this.#itemList = [];
      this.createProject("All");
      this.createProject("Today");
      this.createProject("Personal");
      this.createItem(
        "Welcome to your todo...",
        "Placeholder Text",
        "",
        "Low",
        "Not Started",
        ""
      );
      this.createItem(
        "The home for all your todo's.",
        "Placeholder Text",
        "",
        "Medium",
        "In Progress",
        ""
      );
      this.createItem(
        "Try it out for yourself!",
        "Placeholder Text",
        format(new Date(), "yyyy-MM-dd"),
        "High",
        "Complete",
        ""
      );
      // this.updateToday();
    } else {
      //load in existing data
      this.#projectList = JSON.parse(localStorage.getItem("projectList"));
      this.#itemList = JSON.parse(localStorage.getItem("itemList"));
      for (let projectId of this.#projectList) {
        const project = JSON.parse(localStorage.getItem(projectId));
        this.createProject(
          project.title,
          project.colorOne,
          project.colorTwo,
          project.id
        );
      }
      for (let itemId of this.#itemList) {
        const item = JSON.parse(localStorage.getItem(itemId));
        this.createItem(
          item.title,
          item.description,
          item.dueDate,
          item.priority,
          item.status,
          item.project,
          item.id
        );
      }
    }
    //set initial screen to all project
    screenController.setProjectScreen("All");
  }
  createProject(title, colorOne, colorTwo, id) {
    const newProject = new Project(title, colorOne, colorTwo, id);
    //add project to application project array
    this.#projects[title] = newProject;
    //create dom for project
    domGenerator.createProject(newProject);
    //save to localStorage
    this.saveProject(newProject);
  }
  createItem(name, description, date, priority, status, project, id) {
    const newTodo = new Todo(
      name,
      description,
      date,
      priority,
      status,
      project,
      id
    );
    this.#projects["All"].addTodo(newTodo);
    domGenerator.createItem(newTodo, "All");
    //save to localStorage
    this.saveItem(newTodo);
    // if project is due today, assign to today project
    if (date === format(new Date(), "yyyy-MM-dd")) {
      this.#projects["Today"].addTodo(newTodo);
      domGenerator.createItem(newTodo, "Today");
    }
    //if project was assigned add todo to said project
    if (project !== "All" && project !== "") {
      this.#projects[project].addTodo(newTodo);
      domGenerator.createItem(newTodo, project);
    }
  }
  editItem(
    todo,
    newTitle,
    newDescription,
    newDate,
    newPriority,
    newStatus,
    newProject
  ) {
    const oldProject = todo.getProject();
    const oldDate = todo.getDate();
    const today = format(new Date(), "yyyy-MM-dd");
    todo.setTitle(newTitle);
    todo.setDescription(newDescription);
    todo.setDate(newDate);
    todo.setPriority(newPriority);
    todo.setStatus(newStatus);
    todo.setProject(newProject);
    //if project was changed
    if (oldProject !== newProject) {
      //had no project before, but now it does
      if (oldProject === "" && newProject !== "") {
        this.#projects[newProject].addTodo(todo);
        domGenerator.createItem(todo, newProject);
      } else if (oldProject !== "" && newProject === "") {
        //had project before, but now no project
        this.#projects[oldProject].removeTodo(todo);
        domGenerator.removeItem(todo.getId(), oldProject);
      } else {
        //project swap
        this.#projects[oldProject].removeTodo(todo);
        this.#projects[newProject].addTodo(todo);
        domGenerator.moveItem(todo.getId(), oldProject, newProject);
      }
    }
    // if date was changed
    if (oldDate !== newDate) {
      if (oldDate !== today && newDate === today) {
        this.#projects["Today"].addTodo(todo);
        domGenerator.createItem(todo, "Today");
      } else if (oldDate === today && newDate !== today) {
        this.#projects["Today"].removeTodo(todo);
        domGenerator.removeItem(todo.getId(), "Today");
      }
    }
    //edit todoDiv in active projects
    domGenerator.editItem(todo, "All");
    if (newProject !== "") domGenerator.editItem(todo, newProject);
    if (todo.getDate() === today) domGenerator.editItem(todo, "Today");
    //update item in localStorage
    this.saveItem(todo);
  }
  deleteItem(todo) {
    const today = format(new Date(), "yyyy-MM-dd");
    //delete from all project
    this.#projects["All"].removeTodo(todo);
    domGenerator.removeItem(todo.getId(), "All");
    //delete from today
    if (todo.getDate() === today) {
      this.#projects["Today"].removeTodo(todo);
      domGenerator.removeItem(todo.getId(), "Today");
    }
    //delete from other project
    if (todo.getProject() !== "") {
      this.#projects[todo.getProject()].removeTodo(todo);
      domGenerator.removeItem(todo.getId(), todo.getProject());
    }
    //delete from localStorage
    this.unsaveItem(todo);
  }
  editProject(project, newTitle, newColorOne, newColorTwo) {
    const oldTitle = project.getTitle();
    project.setTitle(newTitle);
    project.setColorOne(newColorOne);
    project.setColorTwo(newColorTwo);
    // if title was changed
    if (oldTitle !== newTitle) {
      delete this.#projects[oldTitle];
      this.#projects[newTitle] = project;
      screenController.updateProjectScreen(oldTitle, newTitle);
      for (let item of this.#projects[newTitle].getItems()) {
        item.setProject(newTitle);
        this.saveItem(item);
      }
    }
    domGenerator.editProject(oldTitle, project);
    this.saveProject(project);
  }
  deleteProject(projectName) {
    //delete from localStorage
    this.unsaveProject(projectName);
    //remove project from all assigned todos
    for (let item of this.#projects[projectName].getItems()) {
      item.setProject("");
      this.saveItem(item);
    }
    //delete from current instance
    delete this.#projects[projectName];
    domGenerator.removeProject(projectName);
    screenController.removeProjectScreen(projectName);
  }
  updateToday() {
    //clear today project
    this.#projects["Today"].clearTodos();
    domGenerator.clearItems("Today");
    //repopulate today project
    const today = format(new Date(), "yyyy-MM-dd");
    const todos = this.#projects["All"].getItems();
    for (const todo of todos) {
      if (todo.getDate() === today) {
        this.#projects["Today"].addTodo(todo);
        domGenerator.createItem(todo, "Today");
      }
    }
  }
  saveProject(project) {
    if (!localStorage.getItem(project.getId())) {
      this.#projectList.push(project.getId());
      localStorage.setItem("projectList", JSON.stringify(this.#projectList));
    }
    //
    localStorage.setItem(
      project.getId(),
      JSON.stringify({
        title: project.getTitle(),
        colorOne: project.getColorOne(),
        colorTwo: project.getColorTwo(),
        id: project.getId(),
      })
    );
  }
  saveItem(item) {
    if (!localStorage.getItem(item.getId())) {
      this.#itemList.push(item.getId());
      localStorage.setItem("itemList", JSON.stringify(this.#itemList));
    }

    localStorage.setItem(
      item.getId(),
      JSON.stringify({
        title: item.getTitle(),
        description: item.getDescription(),
        dueDate: item.getDate(),
        priority: item.getPriority(),
        status: item.getStatus(),
        project: item.getProject(),
        id: item.getId(),
      })
    );
  }
  unsaveProject(projectName) {
    //remove from localStorage
    const projectId = this.#projects[projectName].getId();
    localStorage.removeItem(projectId);
    //update projectList
    for (let i = 0; i < this.#projectList.length; i++) {
      if (this.#projectList[i] === projectId) {
        this.#projectList.splice(i, 1);
        localStorage.setItem("projectList", JSON.stringify(this.#projectList));
        return;
      }
    }
  }
  unsaveItem(item) {
    //remove from local storage
    localStorage.removeItem(item.getId());
    //update itemList
    for (let i = 0; i < this.#itemList.length; i++) {
      if (this.#itemList[i] === item.getId()) {
        this.#itemList.splice(i, 1);
        localStorage.setItem("itemList", JSON.stringify(this.#itemList));
        return;
      }
    }
  }
}
const app = new App();

export { app };
