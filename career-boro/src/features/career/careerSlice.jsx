import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
    loading: false,
    careers: [],
    error: false,
    selectedCareer: ""
}

export const fetchCareer = createAsyncThunk('career/fetchCareer', async (_, { getState }) => {

    const { userProfile } = getState().question
    const headers = { 'Content-Type': 'application/json' }
    const reponse = await axios.post("http://localhost:5001/generate-career", userProfile, { headers })
    return reponse.data
    
})

const careerSlice = createSlice({

    name: "career",
    initialState,

    reducers: {
        selectCareer: (state, action) => {
            state.selectedCareer = action.payload
        }
    },

    extraReducers: (build) => {

        build.addCase(fetchCareer.pending, (state) => {
            state.loading = true
        })

        build.addCase(fetchCareer.fulfilled, (state, action) => {
            state.loading = false
            state.careers = action.payload
        })

        build.addCase(fetchCareer.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message
        })
    }
})

export default careerSlice.reducer
export const selectCareer = careerSlice.actions.selectCareer

