import { v4 as uuidv4 } from "uuid";

export default class Todo {
  #title;
  #description;
  #dueDate;
  #priority;
  #status;
  #project;
  #id;

  constructor(
    title,
    description,
    dueDate,
    priority,
    status,
    project,
    id = uuidv4()
  ) {
    this.#title = title;
    this.#description = description;
    this.#dueDate = dueDate;
    this.#priority = priority;
    this.#status = status;
    this.#project = project;
    this.#id = id;
  }
  //getters
  getTitle() {
    return this.#title;
  }
  getDescription() {
    return this.#description;
  }
  getDate() {
    return this.#dueDate;
  }
  getPriority() {
    return this.#priority;
  }
  getStatus() {
    return this.#status;
  }
  getProject() {
    return this.#project;
  }
  getId() {
    return this.#id;
  }
  //setters
  setTitle(newTitle) {
    this.#title = newTitle;
  }
  setDescription(newDescription) {
    this.#description = newDescription;
  }
  setDate(newDate) {
    this.#dueDate = newDate;
  }
  setPriority(newPriority) {
    this.#priority = newPriority;
  }
  setStatus(newStatus) {
    this.#status = newStatus;
  }
  setProject(newProject) {
    this.#project = newProject;
  }
}
