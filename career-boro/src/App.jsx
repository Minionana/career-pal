import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import './App.css'
import store from './app/store'
import OnboardingForm from './features/onboardingForm/OnboardingForm'
import Career from './features/career/Career'
import Auth from './features/auth/Auth'
import TaskList from './features/task/TaskList'
import HomePage from './features/homePage/HomePage'

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/onboarding" element={<OnboardingForm/>} />
          <Route path="/career" element={<Career/>} />
          <Route path="/auth" element={<Auth/>} />
          <Route path="/tasklist" element={<TaskList/>} />
          <Route path="*" element={<h3>404 Not Found</h3>} />
        </Routes>
      </Router>
    </Provider>
  )
}

export default App
