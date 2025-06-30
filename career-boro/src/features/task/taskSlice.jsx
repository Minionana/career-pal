import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
    loading: false,
    tasks: [],
    error: false
}

export const fetchTasks = createAsyncThunk('report/fetchTasks', async (_, { getState }) => {

    const { userProfile } = getState().question

    const { selectedCareer } = getState().career
    const data = { userProfile, selectedCareer }
    const headers = { 'Content-Type': 'application/json' }
    const reponse = await axios.post("http://localhost:5001/create-tasklist", data, { headers })
    return reponse.data
    
})

const taskSlice = createSlice({

    name: "task",
    initialState,

    extraReducers: (build) => {

        build.addCase(fetchTasks.pending, (state) => {
            state.loading = true
        })

        build.addCase(fetchTasks.fulfilled, (state, action) => {
            state.loading = false

            let tasklist = action.payload
            tasklist.sort((task1, task2) => {
                if (task1.category > task2.category) return -1
                if (task2.category > task1.category) return 1
                return 0
            })

            state.tasks = tasklist
        })

        build.addCase(fetchTasks.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message
        })
    }
})

export default taskSlice.reducer