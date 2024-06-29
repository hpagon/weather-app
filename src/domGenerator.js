import { screenController } from "./screenController";
import DomHandler, { domHandler } from "./domHandler";
export { DomGenerator as default, domGenerator };
import { format } from "date-fns";
import closeIcon from "./close.svg";
import editIcon from "./edit.svg";

class DomGenerator {
  #projectList;
  #projectContentList;
  #selectedProjectName;

  constructor() {
    this.#projectList = document.querySelector("#projects");
    this.#projectContentList = [];
  }
  //creates dom elements for projects
  createProject(project) {
    //create elements
    const sidebarLabel = document.createElement("li");
    const projectContainer = document.createElement("div");
    const banner = document.createElement("div");
    const bannerHeader = document.createElement("h2");
    const itemsContainer = document.createElement("div");
    const listViewTableHeader = document.createElement("div");
    const tableHeaderLeftDiv = document.createElement("div");
    const tableHeaderRightDiv = document.createElement("div");
    const nameHeader = document.createElement("p");
    const dateHeader = document.createElement("p");
    const priorityHeader = document.createElement("p");
    const statusHeader = document.createElement("p");
    const itemListContainer = document.createElement("div");
    const bannerOptionsDiv = document.createElement("div");
    const editIconImg = document.createElement("img");
    const projectIcon = document.createElement("div");
    const sidebarLabelText = document.createElement("p");
    const emptyMessage = document.createElement("h3");
    //add classes/ids
    //give project tab selected styles if all
    if (project.getTitle() === "All") {
      sidebarLabel.classList.add("selected-project-tab");
      this.#selectedProjectName = "All";
    }
    projectContainer.id = "project-container";
    listViewTableHeader.id = "list-header";
    itemsContainer.id = "items-container";
    banner.id = "banner";
    bannerOptionsDiv.id = "banner-options";
    itemListContainer.id = "item-list";
    //add content
    sidebarLabelText.textContent = project.getTitle();
    bannerHeader.textContent = project.getTitle();
    nameHeader.textContent = "Todo";
    dateHeader.textContent = "Date";
    priorityHeader.textContent = "Priority";
    statusHeader.textContent = "Status";
    editIconImg.src = editIcon;
    emptyMessage.textContent = "No todos.";
    //add styles
    banner.style.background = `linear-gradient(${project.getColorOne()}, ${project.getColorTwo()})`;
    projectIcon.style.background = `linear-gradient(${project.getColorOne()}, ${project.getColorTwo()})`;
    //add event listeners
    DomHandler.setProjectTabEvent(sidebarLabel);
    domHandler.setShowProjectEditFormEvent(editIconImg, project);
    //add to dom
    sidebarLabel.append(projectIcon, sidebarLabelText);
    if (project.getTitle() === "All" || project.getTitle() === "Today") {
      document.querySelector("#default-project-list").appendChild(sidebarLabel);
    } else {
      this.#projectList.appendChild(sidebarLabel);
    }
    bannerOptionsDiv.append(editIconImg);
    banner.append(bannerHeader, bannerOptionsDiv);
    tableHeaderLeftDiv.append(nameHeader);
    tableHeaderRightDiv.append(dateHeader, priorityHeader, statusHeader);
    listViewTableHeader.append(tableHeaderLeftDiv, tableHeaderRightDiv);
    itemListContainer.appendChild(emptyMessage);
    itemsContainer.append(listViewTableHeader, itemListContainer);
    projectContainer.append(banner, itemsContainer);
    //add content to local div storage array
    this.#projectContentList.push([projectContainer, sidebarLabel]);
    //create project tag in dialog
    this.createProjectDialogOption(project.getTitle());
    //add project to project screen list in screen controller
    screenController.addProjectScreen(projectContainer, project.getTitle());
  }
  createProjectDialogOption(title) {
    if (title === "All" || title === "Today") return;
    const addFormProjectOption = document.createElement("option");
    const editFormProjectOption = document.createElement("option");
    addFormProjectOption.setAttribute("value", title);
    editFormProjectOption.setAttribute("value", title);
    addFormProjectOption.textContent = title;
    editFormProjectOption.textContent = title;
    document
      .querySelector("#add-todo-form #project-select")
      .appendChild(addFormProjectOption);
    document
      .querySelector("#edit-todo-form #project-select")
      .appendChild(editFormProjectOption);
    this.#projectContentList[this.#projectContentList.length - 1].push(
      addFormProjectOption
    );
    this.#projectContentList[this.#projectContentList.length - 1].push(
      editFormProjectOption
    );
  }
  createItem(todo, project) {
    const length = this.#projectContentList.length;
    for (let i = 0; i < length; i++) {
      if (this.#projectContentList[i][1].textContent === project) {
        //create elements
        const todoDiv = document.createElement("div");
        const completeButton = document.createElement("button");
        const todoName = document.createElement("p");
        const date = document.createElement("p");
        const priority = document.createElement("div");
        const status = document.createElement("div");
        const closeIconImg = document.createElement("img");
        const tagContainer = document.createElement("div");
        const leftContainer = document.createElement("div");
        //add content
        todoName.textContent = todo.getTitle();
        date.textContent =
          todo.getDate() === ""
            ? todo.getDate()
            : format(todo.getDate().replace(/-/g, "/"), "MMM dd, yyyy");
        priority.textContent = todo.getPriority();
        status.textContent = todo.getStatus();
        closeIconImg.src = closeIcon;
        closeIconImg.style.display = "none";
        //add class/attributes
        this.setPriorityClass(priority);
        todoDiv.setAttribute("data-todo-id", todo.getId());
        //insert elements in place
        leftContainer.append(completeButton, todoName);
        tagContainer.append(date, priority, status, closeIconImg);
        todoDiv.append(leftContainer, tagContainer);
        //add to correct project container
        this.#projectContentList[i][0].children[1].children[1].appendChild(
          todoDiv
        );
        //signal that item list is no longer empty
        this.#projectContentList[i][0].children[1].children[1].classList.add(
          "not-empty"
        );
        //trigger events for intialization
        this.setStatusStyles(todoDiv);
        //add events
        DomHandler.setCompleteButtonEvent(completeButton, todo);
        domHandler.setTodoClickEvent(todoDiv, todo);
        domHandler.setDeleteTodoEvent(closeIconImg, todo);
        domHandler.setTodoDivHoverEvent(todoDiv, closeIconImg);
      }
    }
  }
  findAndGetItem(todoId, projectName) {
    for (let project of this.#projectContentList) {
      if (project[1].textContent === projectName) {
        for (let item of project[0].children[1].children[1].children) {
          if (item.getAttribute("data-todo-id") === todoId) return item;
        }
      }
    }
    return null;
  }
  //removes item from project in dom
  removeItem(todoId, projectName) {
    this.findAndGetItem(todoId, projectName).remove();
    this.checkIfEmpty(projectName);
  }
  //edits existing todo dom
  editItem(todo, projectName) {
    const item = this.findAndGetItem(todo.getId(), projectName);

    item.children[0].children[1].textContent = todo.getTitle();
    item.children[1].children[0].textContent =
      todo.getDate() === ""
        ? todo.getDate()
        : format(todo.getDate().replace(/-/g, "/"), "MMM d, yyyy");
    item.children[1].children[1].textContent = todo.getPriority();
    this.setPriorityClass(item.children[1].children[1]);
    item.children[1].children[2].textContent = todo.getStatus();
    //set status styles in change they were changed
    this.setStatusStyles(item);
  }
  moveItem(todoId, oldProject, newProject) {
    const item = this.findAndGetItem(todoId, oldProject);
    for (const project of this.#projectContentList) {
      if (project[1].textContent === newProject) {
        project[0].children[1].children[1].appendChild(item);
      }
    }
    this.checkIfEmpty(oldProject);
    this.checkIfEmpty(newProject);
  }
  checkIfEmpty(projectName) {
    const index = this.findProjectIndex(projectName);
    if (
      this.#projectContentList[index][0].children[1].children[1].children
        .length === 1
    ) {
      this.#projectContentList[
        index
      ][0].children[1].children[1].classList.remove("not-empty");
    } else {
      this.#projectContentList[index][0].children[1].children[1].classList.add(
        "not-empty"
      );
    }
  }
  clearItems(projectName) {
    for (const project of this.#projectContentList) {
      if (project[1].textContent === projectName) {
        for (const todo of project[0].children[1].children[1].children) {
          todo.remove();
        }
      }
    }
  }
  findProjectIndex(projectName) {
    for (let i = 0; i < this.#projectContentList.length; i++) {
      if (this.#projectContentList[i][1].textContent === projectName) return i;
    }
    return -1;
  }
  editProject(projectName, project) {
    const index = this.findProjectIndex(projectName);
    const projectBanner = this.#projectContentList[index][0].children[0];
    const projectIcon = this.#projectContentList[index][1].children[0];
    //change title
    projectBanner.children[0].textContent = project.getTitle();
    this.#projectContentList[index][1].textContent = project.getTitle();
    if (projectName !== "All" && projectName !== "Today") {
      this.#projectContentList[index][2].textContent = project.getTitle();
      this.#projectContentList[index][2].value = project.getTitle();
      this.#projectContentList[index][3].textContent = project.getTitle();
      this.#projectContentList[index][3].value = project.getTitle();
    }
    if (this.#selectedProjectName === projectName)
      this.#selectedProjectName = project.getTitle();
    //change colors
    projectBanner.style.background = `linear-gradient(${project.getColorOne()}, ${project.getColorTwo()})`;
    this.#projectContentList[index][1].prepend(projectIcon);
    projectIcon.style.background = `linear-gradient(${project.getColorOne()}, ${project.getColorTwo()})`;
  }
  removeProject(projectName) {
    const index = this.findProjectIndex(projectName);
    //remove project container
    this.#projectContentList[index][0].remove();
    //remove project listing
    this.#projectContentList[index][1].remove();
    //remove project dialog options
    this.#projectContentList[index][2].remove();
    this.#projectContentList[index][3].remove();
    //remove from project entries in dom memory
    this.#projectContentList.splice(index, 1);
    //move screen back to all
    screenController.setProjectScreen("All");
    //if selected project, reset selected project to All
    this.#selectedProjectName = "All";
  }
  //fills in info from todo that was clicked
  fillInTodoDetails(todo) {
    const form = document.querySelector("#edit-todo-form");

    form.children[0].value = todo.getTitle();
    form.children[1].value = todo.getDescription();
    // if (todo.getDate() !== "") {
    form.children[2].children[1].value = todo.getDate();
    // }
    form.children[3].children[1].value = todo.getPriority();
    form.children[4].children[1].value = todo.getStatus();
    form.children[5].children[1].value = todo.getProject();
  }
  fillInProjectDetails(project) {
    document.querySelector("#edit-project-form").children[1].value =
      project.getTitle();
    document.querySelector("#edit-project-form").children[2].children[1].value =
      project.getColorOne();
    document.querySelector("#edit-project-form").children[3].children[1].value =
      project.getColorTwo();
  }
  setPriorityClass(priority) {
    priority.classList.remove(
      "low-priority",
      "medium-priority",
      "high-priority"
    );
    switch (priority.textContent) {
      case "Low":
        priority.classList.add("low-priority");
        break;
      case "Medium":
        priority.classList.add("medium-priority");
        break;
      case "High":
        priority.classList.add("high-priority");
        break;
    }
  }
  setStatusStyles(todoDiv) {
    todoDiv.classList.remove("not-started", "in-progress", "complete");
    switch (todoDiv.children[1].children[2].textContent) {
      case "Not Started":
        todoDiv.classList.add("not-started");
        break;
      case "In Progress":
        todoDiv.classList.add("in-progress");
        break;
      case "Complete":
        todoDiv.classList.add("complete");
        break;
    }
  }
  completeButtonClickEvent(button, todo) {
    const today = format(new Date(), "yyyy-MM-dd");
    const allItem = this.findAndGetItem(todo.getId(), "All");
    const todayItem =
      todo.getDate() === today
        ? this.findAndGetItem(todo.getId(), "Today")
        : null;
    const projectItem =
      todo.getProject() === ""
        ? null
        : this.findAndGetItem(todo.getId(), todo.getProject());
    if (
      todo.getStatus() === "Not Started" ||
      todo.getStatus() === "In Progress"
    ) {
      todo.setStatus("Complete");
      allItem.children[1].children[2].textContent = "Complete";
      if (todayItem !== null)
        todayItem.children[1].children[2].textContent = "Complete";
      if (projectItem !== null)
        projectItem.children[1].children[2].textContent = "Complete";
    } else {
      todo.setStatus("Not Started");
      allItem.children[1].children[2].textContent = "Not Started";
      if (todayItem !== null)
        todayItem.children[1].children[2].textContent = "Not Started";
      if (projectItem !== null)
        projectItem.children[1].children[2].textContent = "Not Started";
    }
    this.setStatusStyles(allItem);
    if (todayItem !== null) this.setStatusStyles(todayItem);
    if (projectItem !== null) this.setStatusStyles(projectItem);
  }
  todoHoverEnterEvent(todoDiv, closeIconImg) {
    closeIconImg.style.display = "block";
  }
  todoHoverLeaveEvent(todoDiv, closeIconImg) {
    closeIconImg.style.display = "none";
  }
  updateSelectedProject(projectTab) {
    const index = this.findProjectIndex(this.#selectedProjectName);
    this.#projectContentList[index][1].classList.remove("selected-project-tab");
    projectTab.classList.add("selected-project-tab");
    this.#selectedProjectName = projectTab.textContent;
  }
  clearModal(modalNum) {
    document.querySelector(`dialog:nth-child(${modalNum + 1}) form`).reset();
  }
  //pre selects values for add todo form depending on the current selected project
  updateSelectedProjectOption() {
    if (
      this.#selectedProjectName !== "All" &&
      this.#selectedProjectName !== "Today"
    ) {
      document.querySelector("#add-todo-form").children[5].children[1].value =
        this.#selectedProjectName;
    }
    if (this.#selectedProjectName === "Today") {
      document.querySelector("#add-todo-form").children[2].children[1].value =
        format(new Date(), "yyyy-MM-dd");
    }
  }
  //Hides options for pinned projects in edit project form
  toggleBulletedProjectEditOptions() {
    if (
      this.#selectedProjectName === "All" ||
      this.#selectedProjectName === "Today"
    ) {
      document.querySelector("#edit-project-form").children[1].disabled = true;
      document.querySelector(
        "#edit-project-form"
      ).children[4].children[0].style.display = "none";
    } else {
      document.querySelector("#edit-project-form").children[1].disabled = false;
      document.querySelector(
        "#edit-project-form"
      ).children[4].children[0].style.display = "inline";
    }
  }
  toggleMenu() {
    document.querySelector("#container").classList.toggle("menu-hidden");
  }
}

const domGenerator = new DomGenerator();
