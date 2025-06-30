import { useRef } from 'react'
import './OnboardingForm.css'
import Question from '../question/Question'

function OnboardingForm() {

  // questionRefs to store ref of each question to enable scroll to next question functionality
  const questionRefs = useRef(Array(8))
  const inputRefs = useRef(Array(8))
  for (let i = 0; i < questionRefs.current.length; i++) {
    questionRefs.current[i] = useRef(null)
    inputRefs.current[i] = useRef(null)
  }

  return (
    <>
      <div className="scrollSnap container">
        {questionRefs.current.map((ref, index) => <Question ref={ref} key={index} questionIndex={index} questionRefs={questionRefs} inputRefs={inputRefs}/>)}
      </div>
    </>
  )
}

export default OnboardingForm
