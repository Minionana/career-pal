import { auth, googleProvider } from '../../../config/firebase'
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './Auth.css'

function Auth() {
  const signUpForm = useRef(null)
  const navigate = useNavigate()
  
  // To create the user with email and password
  const createUser = async (e)=> {
    e.preventDefault()
    const formData = new FormData(signUpForm.current)
    const email = formData.get("email")
    const password = formData.get("password")
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      navigate('/tasklist')
    } catch (err) {
      console.error(err)
    }
  }

  const createUserWithGoogle = async ()=> {
    try {
      await signInWithPopup(auth, googleProvider)
      alert("User created successfully")
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <form ref={signUpForm} action="submit" className="box authModal" onSubmit={createUser}>
        <h2>Sign Up</h2>
        <input type="email" name="email" placeholder="name@example.com" />
        <input type="password" name="password" placeholder="Password" />
        <input type="submit" value="Sign Up" className="authBtn" />
        <hr />
        <input type="button" value="Sign Up With Google" className="authBtn" onClick={createUserWithGoogle} />
    </form>
  )
}

export default Auth