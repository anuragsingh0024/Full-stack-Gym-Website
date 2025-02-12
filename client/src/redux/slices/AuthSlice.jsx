import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  signupData: null,
  loading: false,
  user: null,
  token: localStorage.getItem("token")
    ? JSON.parse(localStorage.getItem("token"))
    : null,
    
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setSignupData(state, value) {
      state.signupData = value.payload;
    },
    setLoading(state, value) {
      state.loading = value.payload;
    },
    setToken(state, value) {
      state.token = value.payload;
    },
    setUser(state, value) {
       state.user = value.payload
    },
    logIn: (state) => {
       state.token = localStorage.getItem('token');
      //  state.isLoggedIn = true
    },
    logOut: (state) => {
       state.token = null,
       localStorage.removeItem('token')
       state.isLoggedIn = false
    }
  },
});

export const { setSignupData, setLoading,logOut,logIn, setToken, setUser } = authSlice.actions;

export default authSlice.reducer;
