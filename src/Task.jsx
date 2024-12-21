import React from "react";
import editIcon from "./pencil.svg";

class Task extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showDelete: false,
      isEditing: false,
      title: "",
      description: "",
    };
  }

  handleEditClick = () => {
    this.setState({
      isEditing: true,
      title: this.props.task.title,
      description: this.props.task.description,
    });
  };

  handleSave = () => {
    const { task, updateTask } = this.props;
    const { title, description } = this.state;

    updateTask(task.id, title, description);
    this.setState({ isEditing: false });
  };

  render() {
    const { task, toggleCompletion, deleteTask } = this.props;
    const { showDelete, isEditing, title, description } = this.state;

    return (
      <li
        className={`task ${task.completed ? "completed" : ""}`}
        onMouseEnter={() => this.setState({ showDelete: true })}
        onMouseLeave={() => this.setState({ showDelete: false })}
      >
        <div className="task-container">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => toggleCompletion(task.id)}
            className="task-checkbox"
          />
          <div className="task-content">
            {isEditing ? (
              <div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => this.setState({ title: e.target.value })}
                  className="input"
                  placeholder="Task name"
                />
                <input
                  type="text"
                  value={description}
                  onChange={(e) =>
                    this.setState({ description: e.target.value })
                  }
                  className="input"
                  placeholder="Task description"
                />
                <button onClick={this.handleSave}>Сохранить</button>
              </div>
            ) : (
              <>
                <span className="task-title">{task.title}</span>
                <p className="task-description">{task.description}</p>
                <small className="task-created-at">
                  Created: {task.createdAt}
                </small>
                {task.importance && (
                  <div className="task-importance">({task.importance})</div>
                )}
              </>
            )}
          </div>
          <div className={`delete-container ${showDelete ? "show" : ""}`}>
            <button
              className="delete-button"
              onClick={() => deleteTask(task.id)}
            >
              Delete
            </button>
            <img
              src={editIcon}
              alt="Edit"
              className="edit-icon"
              onClick={this.handleEditClick}
            />
          </div>
        </div>
      </li>
    );
  }
}

export default Task;
