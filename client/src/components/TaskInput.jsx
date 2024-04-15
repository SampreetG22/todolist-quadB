import { Button, Dialog } from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useSelector, useDispatch } from "react-redux"; // Importing Redux hooks for state management
import { setShowDialog, setCurrentTask } from "../redux/slices/tasksSlice"; // Importing Redux action creators

export const TaskInput = ({ handleAddEdit }) => {
  // Redux state selectors
  const showDialog = useSelector((state) => state.tasks.showDialog);
  const dialogType = useSelector((state) => state.tasks.dialogType);
  const currentTask = useSelector((state) => state.tasks.currentTask);
  const dispatch = useDispatch(); // Redux dispatch function
  // Function to handle closing dialog
  const handleCloseDialog = () => {
    dispatch(setShowDialog(!showDialog)); // Toggling dialog visibility in Redux state
  };

  // Function to handle title change
  const handleTitleChange = (event) => {
    dispatch(setCurrentTask({ ...currentTask, title: event.target.value })); // Updating current task title in Redux state
  };

  // Function to handle priority change
  const handlePriorityChange = (event) => {
    dispatch(setCurrentTask({ ...currentTask, priority: event.target.value })); // Updating current task priority in Redux state
  };

  return (
    <Dialog
      open={showDialog} // Dialog visibility controlled by showDialog state
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          width: "30vw",
          padding: "1vw 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        },
      }}
    >
      <div className="headerAndClose">
        <h2 className="dialogHeader">{dialogType} TASK</h2>
        <HighlightOffIcon className="closeIcon" onClick={handleCloseDialog} />
      </div>
      {/* Form for adding/editing task */}
      <form onSubmit={handleAddEdit} className="form">
        <div className="dialogContent">
          {/* Title input field */}
          <label className="label" htmlFor="title">
            Title:
          </label>
          <input
            id="title"
            value={currentTask.title}
            className="dialogInputs"
            onChange={handleTitleChange}
          />
          <label
            className="label"
            htmlFor="priority"
            style={{ marginTop: "1vw" }}
          >
            Priority:
          </label>
          <select
            name="priority"
            id="priority"
            className="dialogInputs"
            value={currentTask.priority}
            required
            onChange={handlePriorityChange}
          >
            <option value="" defaultValue="true">
              Priority
            </option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <Button
          type="submit"
          variant="contained"
          className="finalButtons"
          onClick={handleAddEdit}
          style={{ marginTop: "1vw" }}
        >
          Save
        </Button>
      </form>
    </Dialog>
  );
};
