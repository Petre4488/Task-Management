import { useState, useEffect } from 'react';

// custom hooks
import useLocalStorage from './hooks/useLocalStorage';

// custom components
import CustomForm from './components/addTask';
import EditForm from './components/EditForm';
import TaskList from './components/TaskList';

function requestNotificationPermission() {
  if ('Notification' in window) {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.log('Notification permission granted.');
      }
    });
  }
}

// Call this when your app loads
requestNotificationPermission();

function App() {
  const [tasks, setTasks] = useLocalStorage('react-todo.tasks', []);
  const [previousFocusEl, setPreviousFocusEl] = useState(null);
  const [editedTask, setEditedTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const interval = setInterval(checkDeadlines, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [tasks]);

  const addTask = (task) => {
    setTasks(prevState => [...prevState, task]);
  }

  const deleteTask = (id) => {
    setTasks(prevState => prevState.filter(t => t.id !== id));
  }

  const toggleTask = (id) => {
    setTasks(prevState => prevState.map(t => (
      t.id === id
        ? { ...t, checked: !t.checked }
        : t
    )));
  }

  const updateTask = (task) => {
    setTasks(prevState => prevState.map(t => (
      t.id === task.id
        ? { ...t, name: task.name }
        : t
    )));
    closeEditMode();
  }

  const closeEditMode = () => {
    setIsEditing(false);
    previousFocusEl.focus();
  }

  const enterEditMode = (task) => {
    setEditedTask(task);
    setIsEditing(true);
    setPreviousFocusEl(document.activeElement);
  }

  // Function to check deadlines
  const checkDeadlines = () => {
    const now = new Date().getTime();
    tasks.forEach(task => {
      if (task.deadline && new Date(task.deadline).getTime() <= now && !task.notified) {
        showNotification(task.name);
        // Mark task as notified to avoid repeat notifications
        task.notified = true;
        setTasks([...tasks]);
      }
    });
  }

  // Function to show notification
  const showNotification = (taskName) => {
    if (Notification.permission === 'granted') {
      new Notification(`Deadline reached: ${taskName}`);
    }
  }

  return (
    <div className="container">
      <header>
        <h1>My Task List</h1>
      </header>
      {
        isEditing && (
          <EditForm
            editedTask={editedTask}
            updateTask={updateTask}
            closeEditMode={closeEditMode}
          />
        )
      }
      <CustomForm addTask={addTask} />
      {tasks && (
        <TaskList
          tasks={tasks}
          deleteTask={deleteTask}
          toggleTask={toggleTask}
          enterEditMode={enterEditMode}
        />
      )}
    </div>
  )
}

export default App;
