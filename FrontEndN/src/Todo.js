import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  MdDeleteForever,
  MdDoubleArrow,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";

const TodoApp = () => {
  const [tasks, setTasks] = useState([]);
  const [getTasks, setGetTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    GetTasks();
  }, [currentPage]);

  // Create Task API
  const CreateTask = async () => {
    if (taskInput.trim() !== "") {
      try {
        // Make a POST request to create a new task
        await axios.post(`http://localhost:3001/api/tasksCreate`, {
          title: taskInput,
        });

        setTaskInput("");
        GetTasks();
        toast.success(" Task Create Successfully");
        fetchTasks(currentPage);
      } catch (error) {
        console.error("Error creating task:", error);
      }
    }
  };

  //   Get Task API
  const GetTasks = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/tasksGet`);
      setGetTasks(response.data.tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const DeleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:3001/api/tasksdelete/${taskId}`);

      GetTasks();
      toast.error(" Task Delete Successfully");
      fetchTasks(currentPage);
    } catch (error) {
      console.error(`Error deleting task with ID ${taskId}:`, error);
    }
  };

  const toggleTask = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };
  // pagination API
  const fetchTasks = async (page) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/tasks?page=${page}`
      );

      setTasks(response.data.tasks);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handlePagination = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      fetchTasks(page);
    }
  };

  useEffect(() => {
    fetchTasks(currentPage);
  }, [currentPage]);

  return (
    <div className="">
      <h2 className="todoTitle">Todo Application List</h2>
      <div className="todo-app box">
        <div className="input-container">
          <input
            type="text"
            className="inputBox"
            placeholder="Add a new task"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
          />
          <button
            className="addBtn"
            onClick={(e) => {
              CreateTask();
            }}
            disabled={!taskInput}
          >
            Add
          </button>

          <ToastContainer />
        </div>
        {/*  */}

        <ul>
          {tasks.map((x, index) => (
            <li key={x._id}>
              <span>{x.title}</span>
              <MdDeleteForever
                size={30}
                color="red"
                onClick={() => DeleteTask(x._id)}
              />
            </li>
          ))}
        </ul>

        {/* Pagination controls */}
        <div>
          <button
            onClick={() => handlePagination(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <MdKeyboardDoubleArrowLeft size={20} />
          </button>
          <span className="pagenation">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePagination(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <MdKeyboardDoubleArrowRight rrow size={20} />
          </button>
        </div>
        {/*  */}
      </div>
    </div>
  );
};

export default TodoApp;
