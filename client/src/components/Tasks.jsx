import React, { useEffect } from "react";
import "./TaskList.css";
import { Button, Snackbar, Alert } from "@mui/material";
import axios from "axios";
import { TaskInput } from "./TaskInput";
import { useSelector, useDispatch } from "react-redux";
import {
  setList,
  setDialogType,
  setShowDialog,
  setMarkedTasks,
  setSnackBar,
  setCurrentTask,
} from "../redux/slices/tasksSlice"; // Importing Redux action creators
import { TasksList } from "./TaskList";

const Tasks = () => {
  // Redux state selectors
  const list = useSelector((state) => state.tasks.list);
  const showDialog = useSelector((state) => state.tasks.showDialog);
  const dialogType = useSelector((state) => state.tasks.dialogType);
  const markedTasks = useSelector((state) => state.tasks.markedTasks);
  const currentTask = useSelector((state) => state.tasks.currentTask);
  const snackBar = useSelector((state) => state.tasks.snackBar);
  const dispatch = useDispatch(); // Redux dispatch function

  // useEffect hook to fetch all tasks when component mounts
  useEffect(() => {
    getAllTasks();
  }, []);

  // Function to fetch all tasks from the server
  const getAllTasks = () => {
    axios
      .get("http://localhost:8080/api/task")
      .then((response) => {
        dispatch(setList(response.data.tasks)); // Dispatching action to update Redux state with fetched tasks
      })
      .catch((error) => {
        dispatch(
          setSnackBar({
            open: true,
            color: "error",
            message: error.message,
          })
        ); // Dispatching action to show a snackbar notification on error
      });
  };

  // Function to open dialog for adding/editing tasks
  const openDialog = (type, task) => {
    if (type === "edit") {
      dispatch(setDialogType("EDIT"));
      if (task) dispatch(setCurrentTask(task));
    } else {
      dispatch(
        setCurrentTask({
          _id: "",
          title: "",
          priority: "",
          status: "",
          createdAt: "",
        })
      );
      dispatch(setDialogType("CREATE"));
    }
    dispatch(setShowDialog(!showDialog)); // Toggling the dialog visibility in Redux state
  };

  // Function to mark a task as done or pending
  const markAsDone = (task, type) => {
    axios
      .put("http://localhost:8080/api/task", { ...task, status: type })
      .then(() => {
        getAllTasks(); // Fetching all tasks after updating a task's status
        dispatch(
          setSnackBar({
            open: true,
            color: "success",
            message:
              task.status !== "Done"
                ? "Task marked as done"
                : "Task reverted to pending",
          })
        ); // Dispatching action to show a snackbar notification
      })
      .catch((error) => {
        dispatch(
          setSnackBar({
            open: true,
            color: "error",
            message: error.message,
          })
        ); // Dispatching action to show a snackbar notification on error
      });
  };

  // Function to mark selected tasks as done
  const markSelectedAsDone = () => {
    axios
      .put("http://localhost:8080/api/task/markAll", {
        markedTasks: markedTasks,
      })
      .then(() => {
        getAllTasks(); // Fetching all tasks after marking selected tasks as done
        dispatch(setMarkedTasks([])); // Clearing marked tasks in Redux state
        dispatch(
          setSnackBar({
            open: true,
            color: "success",
            message: "Tasks marked as done",
          })
        ); // Dispatching action to show a snackbar notification
      })
      .catch((error) => {
        dispatch(
          setSnackBar({
            open: true,
            color: "error",
            message: error.message,
          })
        ); // Dispatching action to show a snackbar notification on error
      });
  };

  // Function to handle adding/editing a task
  const handleAddEdit = (event) => {
    event.preventDefault();
    if (dialogType === "CREATE") {
      axios
        .post("http://localhost:8080/api/task", currentTask)
        .then(() => {
          getAllTasks(); // Fetching all tasks after adding a new task
          dispatch(
            setSnackBar({
              open: true,
              color: "success",
              message: "Task created successfully",
            })
          ); // Dispatching action to show a snackbar notification
        })
        .catch((error) => {
          dispatch(
            setSnackBar({
              open: true,
              color: "error",
              message: error.message,
            })
          ); // Dispatching action to show a snackbar notification on error
        });
    } else {
      axios
        .put("http://localhost:8080/api/task", currentTask)
        .then(() => {
          getAllTasks(); // Fetching all tasks after updating an existing task
          dispatch(
            setSnackBar({
              open: true,
              color: "success",
              message: "Task updated successfully",
            })
          ); // Dispatching action to show a snackbar notification
        })
        .catch((error) => {
          dispatch(
            setSnackBar({
              open: true,
              color: "error",
              message: error.message,
            })
          ); // Dispatching action to show a snackbar notification on error
        });
    }
    dispatch(setShowDialog(!showDialog)); // Toggling the dialog visibility in Redux state
  };

  // Function to handle task deletion
  const handleDeleteTask = (task) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (confirmed) {
      axios
        .delete(`http://localhost:8080/api/task?id=${task._id}`)
        .then(() => {
          getAllTasks(); // Fetching all tasks after deleting a task
          dispatch(
            setSnackBar({
              open: true,
              color: "error",
              message: "Task deleted successfully",
            })
          ); // Dispatching action to show a snackbar notification
        })
        .catch((error) => {
          dispatch(
            setSnackBar({
              open: true,
              color: "error",
              message: error.message,
            })
          ); // Dispatching action to show a snackbar notification on error
        });
    }
  };

  // Function to clear the task list
  const clearList = () => {
    // Function to delete all tasks
    const deleteAllTasks = () => {
      axios
        .delete("http://localhost:8080/api/task/deleteAll")
        .then(() => {
          getAllTasks(); // Fetching all tasks after deleting all tasks
          dispatch(
            setSnackBar({
              open: true,
              color: "error",
              message: "All tasks deleted successfully",
            })
          ); // Dispatching action to show a snackbar notification
        })
        .catch((error) => {
          dispatch(
            setSnackBar({
              open: true,
              color: "error",
              message: error.message,
            })
          ); // Dispatching action to show a snackbar notification on error
        });
    };
    const confirmed = window.confirm(
      "Are you sure you want to delete all tasks?"
    );
    if (confirmed) {
      deleteAllTasks(); // If confirmed, delete all tasks
    }
  };

  return (
    <>
      <div className="mainContainer">
        <h1 className="mainHeading">
          TODO LIST{" "}
          <img
            src="https://static-00.iconduck.com/assets.00/todo-icon-2048x2048-m7wp6prw.png"
            alt="logo"
            className="todoImage"
          />
        </h1>
        <div className="todoListContainer">
          <div className="headersContainer">
            <h3
              className="header"
              style={{ paddingLeft: "4%", width: "43.6%" }}
            >
              TITLE
            </h3>
            <h3 className="status">PRIORITY</h3>
            <h3 className="status">STATUS</h3>
            <h3 className="status">CREATED ON</h3>
            <h3 className="options">OPTIONS</h3>
          </div>
          {/* Task list component */}
          <TasksList
            markAsDone={markAsDone}
            openDialog={openDialog}
            handleDeleteTask={handleDeleteTask}
          />
          <div className="buttonsContainer">
            {list.length > 0 && (
              <>
                <Button
                  variant="contained"
                  color="secondary"
                  className="buttons"
                  disabled={markedTasks.length === 0}
                  onClick={markSelectedAsDone}
                >
                  Mark as done
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  className="buttons"
                  onClick={clearList}
                >
                  Clear List
                </Button>
              </>
            )}
            <Button
              variant="contained"
              color="primary"
              className="buttons"
              onClick={() => openDialog("add")}
            >
              Add task
            </Button>
          </div>
        </div>
        <p style={{ fontSize: "1vw" }}>
          Note: Start the server in server folder, then npm start{" "}
        </p>
      </div>
      {/* Snackbar for showing notifications */}
      <Snackbar
        open={snackBar.open}
        autoHideDuration={3000}
        onClose={() => dispatch(setSnackBar({ ...snackBar, open: false }))}
      >
        <Alert
          onClose={() => dispatch(setSnackBar({ ...snackBar, open: false }))}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackBar.message}
        </Alert>
      </Snackbar>
      {/* Task input component for adding and editing the task */}
      <TaskInput handleAddEdit={handleAddEdit} />
    </>
  );
};

export default Tasks;
