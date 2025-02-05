import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { Error } from "./Error";

function App() {
  const [imageUrl, setImageUrl] = useState("");
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");

  const submitTask = async (e) => {
    e.preventDefault();
    if (!imageUrl.trim()) {
      setError("Please enter an image URL");
      return;
    }
    try {
      const { data: task } = await axios.post(
        "http://localhost:5000/api/tasks",
        {
          imageUrl,
        }
      );
      setTasks([task, ...tasks]);
      setImageUrl("");
    } catch (err) {
      setError("Failed to submit task. Please try again.");
      console.error("Error submitting task:", err);
    } finally {
    }
  };

  const fetchTasks = async () => {
    try {
      const { data: task } = await axios.get("http://localhost:5000/api/tasks");
      return task;
    } catch (err) {
      setError("Failed to fetch tasks. Please refresh the page.");
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks().then((tasks) => {
      console.log({ tasks });
      setTasks(tasks);
      setInterval(() => {
        fetchTasks().then((tasks) => {
          setTasks(tasks);
        });
      }, 10000);
    });
  }, []);

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
      {error && <Error message={error} />}
      <form className="input-container">
        <input
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Enter Image URL"
        />
        <button onClick={submitTask}>Submit</button>
      </form>
      <ul>
        {tasks?.map((task) => (
          <li key={task.taskId}>
            <img src={getThumbnail(task.status, task.imageUrl)} alt="Task" />
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

const getThumbnail = (status, storedImage) => {
  if (status === "Success") {
    return storedImage;
  } else if (status === "Pending" || status === "Processing") {
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARQAAAC2CAMAAAAvDYIaAAAAaVBMVEX///9RUVFZWVl1dXWOjo6amprOzs6+vr78/Pzn5+eXl5dHR0fLy8tvb2/v7++KioqioqLX19dERET29vbGxsbe3t7u7u7AwMCDg4NcXFynp6dUVFRNTU2xsbFqamri4uJ7e3s/Pz9kZGThv4iLAAACi0lEQVR4nO3b0XaiMBSFYdEQAgKCoFjB0pn3f8gBEqh2bOHKsJr/u4NycdjrEJJINxsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABgkqa2K1idIGn2dXa2XcaaKN+rt9utl7S2K1mRoNkOvJ3tSqwKs8vlejIH6m1rNKXVquyqPpLdLtlJfSS9MRQvs1uXTXkXSe9d90pcj6HUkeXK7FG+CSXRjdFOoXhXy6XZk+5Gl2I4kYypNLm5RJbSXn1W3IWiZyb5m07F009Pke07zU3ZLPLVissYijBnytqr69o7DDGoj73X2wunUqnGMaUaz/SvaGGeHV9n0qVys1WgFSLR4+xdKyhlDs7eZOtUq6hr8v6+uxXP/hYcp1D+nJ5d8Hup9rsbzvZTKMf4pTWtWHXXKfn85b/AgkEibKZQGgfGFJVnfpbP3agS09vHhfnt9SCEOMy+Z9O/OpXjx9OB+HcJ+ky6VGa3B9LIO+6PdebAw5MKY8HNtuUtdmIXrr2YUA4OPBVLhWMoglAmRWQaxa3V74xcD7QitF3IqshDRzi2npml8nJ27gYAAF6AGf5XRZxFmWu//M25Rb7vR9X8hQ6RfSZdKk5slCwVmFBolU/qZkIJbFeyJrEJhWXynXM0DLRX1sn32iyKxJU9pkdFHrfL+mT6BgGTcxiGfH79KA179MqD8xCKg//BoH5YGxZDKK+rZSUKWVby+1j6VJxbUBdBr/ohlcK5TDb5EErgxodKS+lMAvn5gklPJ/cGkUfl11DOMpax440T6lCmnRUVy07sdq8o+aVRCKWX5vn9+0WHwsz+QT6kwsT+gWql5IOE/7BZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGC5f6FUGVYMfOfLAAAAAElFTkSuQmCC";
  }

  return "https://cdn-icons-png.flaticon.com/512/13434/13434972.png";
};

export default App;
