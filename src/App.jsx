import React from "react";
import "./App.css";
import Task from "./Task";
import searchIcon from "./loupe.svg";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      title: "",
      description: "",
      importance: "",
      showIncompleteOnly: false,
      searchText: "",
      titleError: "",
      descriptionError: "",
      selectedImportance: {
        notImportant: false,
        medium: false,
        important: false,
      },
    };

    this.titleInput = React.createRef();
    this.descriptionInput = React.createRef();
  }

  componentDidMount() {
    console.log("Компонент смонтирован");
    // Здесь можно выполнить действия, такие как загрузка данных
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.tasks.length !== this.state.tasks.length) {
      console.log("Количество задач изменилось:", this.state.tasks.length);
    }
  }

  componentWillUnmount() {
    console.log("Компонент будет размонтирован");
    // Здесь можно выполнить очистку, если это необходимо
  }

  handleTitleChange = (e) => {
    this.setState({ title: e.target.value, titleError: "" });
  };

  handleDescriptionChange = (e) => {
    this.setState({ description: e.target.value, descriptionError: "" });
  };

  handleImportanceChange = (importance) => {
    this.setState({ importance });
  };

  handleSearchChange = (e) => {
    this.setState({ searchText: e.target.value });
  };

  handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (e.target.name === "title") {
        this.descriptionInput.current.focus();
        e.preventDefault();
      } else if (e.target.name === "description") {
        this.addTask();
      }
    }
  };

  addTask = () => {
    const { title, description, importance } = this.state;

    let titleError = "";
    let descriptionError = "";

    if (title.trim() === "" || title.startsWith(" ") || title.endsWith(" ")) {
      titleError =
        "The task cannot be empty, start with a space and end with it.";
    }

    if (titleError || descriptionError) {
      this.setState({ titleError, descriptionError });
      return;
    }

    const newTask = {
      id: Date.now(),
      title,
      description,
      importance,
      completed: false,
      createdAt: new Date().toLocaleString(),
    };

    this.setState(
      (prevState) => ({
        tasks: [...prevState.tasks, newTask],
        title: "",
        description: "",
        importance: "",
        titleError: "",
        descriptionError: "",
      }),
      () => {
        this.titleInput.current.focus();
      }
    );
  };

  generateTasks = (count) => {
    const newTasks = Array.from({ length: count }, (_, index) => ({
      id: Date.now() + index,
      title: `Task ${index + 1}`,
      description: `Description for task ${index + 1}`,
      importance: ["notImportant", "medium", "important"][
        Math.floor(Math.random() * 3)
      ],
      completed: false,
      createdAt: new Date().toLocaleString(),
    }));

    this.setState((prevState) => ({
      tasks: [...prevState.tasks, ...newTasks],
    }));
  };

  add1000Tasks = () => {
    this.generateTasks(1000);
  };

  updateTask = (id, title, description) => {
    this.setState((prevState) => ({
      tasks: prevState.tasks.map((task) =>
        task.id === id ? { ...task, title, description } : task
      ),
    }));
  };

  taskIsCompleted = (id) => {
    this.setState((prevState) => ({
      tasks: prevState.tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      ),
    }));
  };

  deleteTask = (id) => {
    this.setState((prevState) => ({
      tasks: prevState.tasks.filter((task) => task.id !== id),
    }));
  };

  toggleShowIncomplete = () => {
    this.setState((prevState) => ({
      showIncompleteOnly: !prevState.showIncompleteOnly,
    }));
  };

  handleImportanceFilterChange = (importance) => {
    this.setState((prevState) => ({
      selectedImportance: {
        ...prevState.selectedImportance,
        [importance]: !prevState.selectedImportance[importance],
      },
    }));
  };

  render() {
    const {
      tasks,
      title,
      description,
      titleError,
      descriptionError,
      showIncompleteOnly,
      searchText,
      selectedImportance,
    } = this.state;

    const filteredTasks = tasks.filter((task) =>
      task.title.toLowerCase().includes(searchText.toLowerCase())
    );

    const incompleteTasks = filteredTasks.filter((task) => !task.completed);
    const completedTasks = filteredTasks.filter((task) => task.completed);

    const hasSelectedImportance =
      Object.values(selectedImportance).some(Boolean);

    const displayTasks = filteredTasks.filter((task) => {
      const matchesImportance = hasSelectedImportance
        ? selectedImportance[task.importance]
        : true;

      return showIncompleteOnly
        ? !task.completed && matchesImportance
        : matchesImportance;
    });

    const completedCount = completedTasks.length;

    return (
      <div className="todo-app">
        <div className="task-container">
          <div className="tasks">
            <h1>TODO LIST</h1>

            <div className="completed-count">
              Completed tasks: {completedCount}
            </div>

            <div className="filter-button">
              <button onClick={this.toggleShowIncomplete}>
                {showIncompleteOnly ? "Show all" : "Show incomplete"}
              </button>
            </div>

            <h4>Filter by importance</h4>
            <div className="importance-filters">
              <label>
                Not important
                <input
                  type="checkbox"
                  checked={selectedImportance.notImportant}
                  onChange={() =>
                    this.handleImportanceFilterChange("notImportant")
                  }
                />
              </label>
              <label>
                Medium
                <input
                  type="checkbox"
                  checked={selectedImportance.medium}
                  onChange={() => this.handleImportanceFilterChange("medium")}
                />
              </label>
              <label>
                Important
                <input
                  type="checkbox"
                  checked={selectedImportance.important}
                  onChange={() =>
                    this.handleImportanceFilterChange("important")
                  }
                />
              </label>
            </div>

            <ul className="task-list">
              {displayTasks
                .filter((task) => !task.completed)
                .map((task) => (
                  <Task
                    key={task.id}
                    task={task}
                    toggleCompletion={this.taskIsCompleted}
                    deleteTask={this.deleteTask}
                    updateTask={this.updateTask}
                  />
                ))}
              {displayTasks
                .filter((task) => task.completed)
                .map((task) => (
                  <Task
                    key={task.id}
                    task={task}
                    toggleCompletion={this.taskIsCompleted}
                    deleteTask={this.deleteTask}
                    updateTask={this.updateTask}
                  />
                ))}
            </ul>
          </div>

          <div className="form-container">
            <div className="search-container">
              <input
                className="input"
                type="text"
                name="search"
                placeholder="Search tasks"
                value={searchText}
                onChange={this.handleSearchChange}
                onKeyDown={this.handleKeyDown}
              />
              <img
                src={searchIcon}
                alt="Search"
                className="search-icon"
                onClick={this.handleSearch}
              />
            </div>

            <div className="adding-task-text">Adding a task</div>

            <input
              className="input"
              type="text"
              name="title"
              placeholder="Enter the task"
              value={title}
              onChange={this.handleTitleChange}
              onKeyDown={this.handleKeyDown}
              ref={this.titleInput}
            />
            {titleError && <div className="error-message">{titleError}</div>}

            <input
              className="input"
              name="description"
              placeholder="Enter the description of the task (may be empty)"
              value={description}
              onChange={this.handleDescriptionChange}
              onKeyDown={this.handleKeyDown}
              ref={this.descriptionInput}
            />
            {descriptionError && (
              <div className="error-message">{descriptionError}</div>
            )}

            <div className="importance-container">
              <button
                className={`importance-button ${
                  this.state.importance === "notImportant" ? "active" : ""
                }`}
                onClick={() => this.handleImportanceChange("notImportant")}
              >
                Not important
              </button>
              <button
                className={`importance-button ${
                  this.state.importance === "medium" ? "active" : ""
                }`}
                onClick={() => this.handleImportanceChange("medium")}
              >
                Medium
              </button>
              <button
                className={`importance-button ${
                  this.state.importance === "important" ? "active" : ""
                }`}
                onClick={() => this.handleImportanceChange("important")}
              >
                Important
              </button>
            </div>

            <button onClick={this.addTask}>Add</button>
            <button onClick={this.add1000Tasks}>Generate 1000 tasks</button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
