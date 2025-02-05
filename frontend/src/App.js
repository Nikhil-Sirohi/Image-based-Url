import { useState, useEffect } from "react";
//import axios from "axios";
import "./App.css";

function App() {
  const [imageUrl, setImageUrl] = useState("");
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  //const submitTask = async () => {
  //if (!imageUrl.trim()) {
  // setError("Please enter an image URL");
  //return;
  //}
  //setError("");
  //setIsLoading(true);
  //try {
  // const res = await axios.post("http://localhost:5000/api/submit-task", {
  //   imageUrl,
  // });
  // setTasks([...tasks, res.data]);
  // setImageUrl("");
  //} catch (err) {
  // setError("Failed to submit task. Please try again.");
  // console.error("Error submitting task:", err);
  //} finally {
  // setIsLoading(false);
  //}
  //};

  /* useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get("http://localhost:5000/api/tasks");
        setTasks(res.data);
      } catch (err) {
        setError("Failed to fetch tasks. Please refresh the page.");
        console.error("Error fetching tasks:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, []);
*/

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setTasks([
        {
          taskId: "1",
          imageUrl:
            "https://www.shutterstock.com/image-photo/leipzig-germany-june-18-2024-600nw-2480454921.jpg",
          status: "Pending",
        },
        {
          taskId: "2",
          imageUrl: "https://picsum.photos/200",
          status: "Completed",
        },
        {
          taskId: "3",
          imageUrl: "https://dummyimage.com/200x200/000/fff",
          status: "Failed",
        },
      ]);
      setIsLoading(false);
    }, 1000); // Simulating API delay
  }, []);

  // Mock API Call - Submit Task
  const submitTask = async () => {
    if (!imageUrl.trim()) {
      setError("Please enter an image URL");
      return;
    }
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      const newTask = {
        taskId: Math.random().toString(36).substring(7),
        imageUrl: imageUrl,
        status: "Pending",
      };
      setTasks((prevTasks) => [...prevTasks, newTask]);
      setImageUrl("");
      setIsLoading(false);
    }, 1000); // Simulating API delay
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "status-pending";
      case "completed":
        return "status-completed";
      case "failed":
        return "status-failed";
      default:
        return "";
    }
  };

  return (
    <div className="container">
      <h1>Image-Based Data Generation</h1>
      {error && <div className="error-message">{error}</div>}
      <div className="input-container">
        <input
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Enter Image URL"
          disabled={isLoading}
        />
        <button onClick={submitTask} disabled={isLoading}>
          {isLoading ? "Processing..." : "Submit"}
        </button>
      </div>
      {isLoading && <p>Loading...</p>}
      <ul>
        {tasks.map((task) => (
          <li key={task.taskId}>
            <img
              src={task.imageUrl || "/placeholder.svg?height=180&width=250"}
              alt="Task"
            />
            <div className="task-info">
              <p>Task ID: {task.taskId}</p>
              <p>
                Status:{" "}
                <span className={`status ${getStatusClass(task.status)}`}>
                  {task.status}
                </span>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
