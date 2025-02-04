import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [imageUrl, setImageUrl] = useState("");
  const [tasks, setTasks] = useState([]);

  const submitTask = async () => {
    if (!imageUrl.trim()) return alert("Please enter an image URL");
    const res = await axios.post("http://localhost:5000/api/submit-task", {
      imageUrl,
    });
    setTasks([...tasks, res.data]);
    setImageUrl("");
  };

  useEffect(() => {
    const fetchTasks = async () => {
      const res = await axios.get("http://localhost:5000/api/tasks");
      setTasks(res.data);
    };
    fetchTasks();
  }, [tasks]);

  return (
    <div className="container">
      <h1>Image-Based Data Generation</h1>
      <input
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="Enter Image URL"
      />
      <button onClick={submitTask}>Submit</button>
      <ul>
        {tasks.map((task) => (
          <li key={task.taskId}>
            <img src={task.imageUrl} alt="Task" width="100" />
            <p>Task ID: {task.taskId}</p>
            <p>Status: {task.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
