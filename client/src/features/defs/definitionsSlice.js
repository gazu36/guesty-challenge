import { createSlice, createEntityAdapter, createSelector, createAsyncThunk } from '@reduxjs/toolkit';
import { axios } from '../../axiosInstance';

export const fetchDefinitions = createAsyncThunk(
  'defs/',
  async () => axios.get('defs').then(res => res.data)
)

export const randomDefinitions = createAsyncThunk(
  'defs/random/',
  async () => axios.get(`defs/random/${Math.floor(Math.random() * 20) + 1}`).then(res => res.data)
)

export const treatDefinitions = createAsyncThunk(
  '/treat',
  async () => {
    const dtNow = new Date();
    dtNow.setMinutes(0);
    dtNow.setSeconds(0);
    dtNow.setMilliseconds(0);
    return axios.patch(`/defs`, { datetime: dtNow.toISOString() }).then(res => res.data)
  }
)

const definitionsAdapter = createEntityAdapter();

export const definitionsSlice = createSlice({
  name: 'definitions',
  initialState: definitionsAdapter.getInitialState({
    status: 'idle',
    error: null
}),
  extraReducers: {
    [fetchDefinitions.pending]: (state, action) => { state.status='loading' },
    [fetchDefinitions.fulfilled]: (state, action) => {
      state.status = 'succeeded'
      definitionsAdapter.upsertMany(state, action.payload)
    },
    [fetchDefinitions.rejected]: (state, action) => {
      state.status = 'failed'
      state.error = action.error.message
    },
    [randomDefinitions.fulfilled]: (state, action) => definitionsAdapter.upsertMany(state, action.payload),
    [treatDefinitions.fulfilled]: (state, action) => definitionsAdapter.upsertMany(state, action.payload),
    [treatDefinitions.rejected]: (state, action) => {
      state.status = 'failed'
      state.error = action.error.message
    },
  }
});

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