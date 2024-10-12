import { useState } from 'react';

// library imports
import { PlusIcon } from '@heroicons/react/24/solid';

const CustomForm = ({ addTask }) => {
  const [task, setTask] = useState("");
  const [deadline, setDeadline] = useState(""); // Added state for deadline

  const handleFormSubmit = (e) => {
    e.preventDefault();
    addTask({
      name: task,
      checked: false,
      id: Date.now(),
      deadline: deadline // Added deadline to task
    });
    setTask("");
    setDeadline("");
  }

  return (
    <form className="todo" onSubmit={handleFormSubmit}>
      <div className="wrapper">
        <input
          type="text"
          id="task"
          className="input"
          value={task}
          onInput={(e) => setTask(e.target.value)}
          required
          autoFocus
          maxLength={60}
          placeholder="Enter Task"
        />
        <label htmlFor="task" className="label">Enter Task</label>
      </div>
      <div className="wrapper">
        <input
          type="datetime-local"
          id="deadline"
          className="input"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          required
        />
        <label htmlFor="deadline" className="label">Deadline</label>
      </div>
      <button className="btn" aria-label="Add Task" type="submit">
        <PlusIcon />
      </button>
    </form>
  );
}

export default CustomForm;
