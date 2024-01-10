import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  userRole: '',
  isLoggedIn: false,
  token: '',
  id: '',
  email: '',
  fullName: '',
  commentsAdded: {}
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    assignUserRole: (state, actions) => {
      state.userRole = actions.payload
    },
    setLoginDetails: (state, actions) => {
      if (actions.payload) {
        const { token, id, email, fullName, commentsAdded } = actions.payload
        state.token = token
        state.id = id
        state.email = email
        state.fullName = fullName
        state.commentsAdded = commentsAdded
      }
      state.isLoggedIn = !state.isLoggedIn
    },

    resetLoginDetails: (state) => {
      state.userRole = ''
      state.token = ''
      state.id = ''
      state.email = ''
      state.fullName = ''
      state.commentsAdded = {}
      state.isLoggedIn = !state.isLoggedIn
    }
  }
});

export const { assignUserRole, setLoginDetails, resetLoginDetails } = userSlice.actions;
export default userSlice.reducer;