import { configureStore } from '@reduxjs/toolkit'
import { logger } from 'redux-logger'
import questionReducer from '../features/question/questionSlice'
import careerReducer from '../features/career/careerSlice'
import taskReducer from '../features/task/taskSlice'

const store = configureStore({
    reducer: {
        question: questionReducer,
        career: careerReducer,
        task: taskReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger)
})

export default store