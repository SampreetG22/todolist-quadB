import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  showDialog: false,
  dialogType: null,
  markedTasks: [],
  snackBar: {
    open: false,
    color: "",
    message: "",
  },
  currentTask: {
    _id: "",
    title: "",
    priority: "",
    status: "",
    createdAt: "",
  },
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setList: (state, action) => {
      state.list = action.payload;
    },
    setShowDialog: (state, action) => {
      state.showDialog = action.payload;
    },
    setDialogType: (state, action) => {
      state.dialogType = action.payload;
    },
    setMarkedTasks: (state, action) => {
      state.markedTasks = action.payload;
    },
    setSnackBar: (state, action) => {
      state.snackBar = action.payload;
    },
    setCurrentTask: (state, action) => {
      state.currentTask = action.payload;
    },
  },
});

export const {
  setList,
  setShowDialog,
  setDialogType,
  setMarkedTasks,
  setSnackBar,
  setCurrentTask,
} = tasksSlice.actions;

export default tasksSlice.reducer;
