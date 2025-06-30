import { createSlice} from '@reduxjs/toolkit'

const initialState = {
    userProfile: {
        interests: "",
        course: "",
        careerValues: "",
        workEnvironment: "",
        preparationTime: "Less than 3 months",
        country: "",
        relocation: "Open to relocating internationally",
        personality: "I Don't Know"
    }
}

const questionSlice = createSlice({
    name: "question",
    initialState,
    reducers: {
        updateProfile: (state, actions) => {
            const { key, value } = actions.payload
            state.userProfile[key] = value
        }
    }

})

export default questionSlice.reducer
export const updateProfile = questionSlice.actions.updateProfile
