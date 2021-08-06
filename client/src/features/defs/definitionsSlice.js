import { createSlice, createEntityAdapter, createSelector, createAsyncThunk } from '@reduxjs/toolkit';
import { axios } from '../../axiosInstance';

export const fetchDefinitions = createAsyncThunk(
  'defs/',
  async () => axios.get('defs').then(res => res.data)
)

const definitionsAdapter = createEntityAdapter();

export const definitionsSlice = createSlice({
  name: 'definitions',
  initialState: definitionsAdapter.getInitialState({
    status: 'idle',
    error: null,
    protectedOnly: false
}),
  reducers: {
    toggleProtectedOnlyFilter: (state) => {
      state.protectedOnly = !state.protectedOnly;
    }
  },
  extraReducers: {
    [fetchDefinitions.pending]: (state, action) => { state.status='loading' },
    [fetchDefinitions.fulfilled]: (state, action) => {
      state.status = 'succeeded'
      definitionsAdapter.upsertMany(state, action.payload)
    },
    [fetchDefinitions.rejected]: (state, action) => {
      state.status = 'failed'
      state.error = action.error.message
    }
  }
});

export const { toggleProtectedOnlyFilter } = definitionsSlice.actions;

export default definitionsSlice.reducer;

export const { 
  selectAll: selectAllDefinitions,
  selectById: selectDefById,
  selectIds: selectDefIds
} = definitionsAdapter.getSelectors(state => state.definitions)

export const selectUntreatedDefinitions = createSelector(
  selectAllDefinitions,
  definitions => definitions.filter(def => !def.lastTreated).map(def => def.id)
)