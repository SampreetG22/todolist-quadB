import { Checkbox, Tooltip } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import Undo from "@mui/icons-material/Undo";
import React from "react";
import { useSelector, useDispatch } from "react-redux"; // Importing Redux hooks for state management
import { setMarkedTasks } from "../redux/slices/tasksSlice"; // Importing Redux action creator

export const TasksList = ({ markAsDone, openDialog, handleDeleteTask }) => {
  // Redux state selectors
  const list = useSelector((state) => state.tasks.list);
  const markedTasks = useSelector((state) => state.tasks.markedTasks);
  const dispatch = useDispatch(); // Redux dispatch function

  // Function to handle checkbox change
  const handleCheckboxChange = (event, task) => {
    if (event.target.checked) {
      dispatch(setMarkedTasks([...markedTasks, task])); // Adding task to markedTasks array in Redux state
    } else {
      dispatch(
        setMarkedTasks(
          markedTasks.filter((markedTask) => markedTask._id !== task._id)
        )
      ); // Removing task from markedTasks array in Redux state
    }
  };

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  return (
    <div className="tasksContainer">
      {list.length > 0 ? (
        list.map((each, i) => {
          return (
            <div
              key={i}
              className={`headersContainer ${
                each.status === "Done" && "taskDoneContainer"
              }`}
            >
              {each.status === "Done" ? (
                <p className="header doneTask">
                  <Checkbox
                    size="small"
                    className="checkbox"
                    checked
                    disabled
                  />
                  {each.title}
                </p>
              ) : (
                <p className="header">
                  <Checkbox
                    size="small"
                    className="checkbox"
                    checked={markedTasks.includes(each)}
                    onChange={(event) => handleCheckboxChange(event, each)}
                  />
                  {each.title}
                </p>
              )}
              <p className={`status ${each.priority}`}>{each.priority}</p>
              <p className="status">{each.status}</p>
              <p className="status">{formatDate(each.createdAt)}</p>
              <div className="optionsContainer">
                {each.status !== "Done" ? (
                  <Tooltip title="Make as done" placement="top" arrow>
                    <DoneIcon
                      color="success"
                      className="icons"
                      onClick={() => markAsDone(each, "Done")}
                    />
                  </Tooltip>
                ) : (
                  <Tooltip title="Undo" placement="top" arrow>
                    <Undo
                      className="icons"
                      onClick={() => markAsDone(each, "Undo")}
                    />
                  </Tooltip>
                )}
                <Tooltip title="Edit" placement="top" arrow>
                  <ModeEditIcon
                    color="primary"
                    className="icons"
                    onClick={() => openDialog("edit", each)}
                  />
                </Tooltip>
                <Tooltip title="Delete" placement="top" arrow>
                  <DeleteForeverIcon
                    color="error"
                    className="icons"
                    onClick={() => handleDeleteTask(each)}
                  />
                </Tooltip>
              </div>
            </div>
          );
        })
      ) : (
        <img
          src="https://static.vecteezy.com/system/resources/previews/014/814/192/non_2x/creatively-designed-flat-conceptual-icon-of-no-task-vector.jpg"
          alt="noTasks"
          className="noTaskImage"
        />
      )}
    </div>
  );
};
