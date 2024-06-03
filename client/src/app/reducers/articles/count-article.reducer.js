import { createSlice } from "@reduxjs/toolkit";

const initialState = 0;

export const CountArticleSlice = createSlice({
  name: "countArticle",
  initialState,
  reducers: {
    SetCountArticle: (state, action) => {
      state = action.payload;
      return state;
    },
  },
});

export const GetCountArticle = (state) => state.countArticle;
export const { SetCountArticle } = CountArticleSlice.actions;
export default CountArticleSlice.reducer;
