import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './HomePage.css'

function HomePage() {

    const navigate = useNavigate()

    const phraseRefs = useRef(Array(5))
    for (let i = 0; i < phraseRefs.current.length; i++) {
        phraseRefs.current[i] = useRef(null)
      }

    const [phraseIndex, setPhraseIndex] = useState(0)

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (phraseIndex < 4) {
                setPhraseIndex(phraseIndex + 1)
            }
            else {
                setPhraseIndex(0)
            }
            phraseRefs.current[phraseIndex].current.scrollIntoView()
        }, 1500)

        return () => {
            clearInterval(intervalId)
        }
    })

    return (
        <div className="banner">
            <h1 className="brand">Career Pal</h1>
            <div className="motto">
                <p ref={phraseRefs.current[0]}>Chase Your Northstar</p>
                <p ref={phraseRefs.current[1]}>Unlock Your Career Potential</p>
                <p ref={phraseRefs.current[2]}>Explore Roles That Fits You</p>
                <p ref={phraseRefs.current[3]}>Choose With Confidence</p>
                <p ref={phraseRefs.current[4]}>Unlock Tools To Accelerate Your Growth</p>
            </div>
            <div className="btn-panel">
                <button className="btn" onClick={() => navigate()}>Sign In</button>
                <button className="btn" onClick={() => navigate('/onboarding')}>Take the Test</button>
            </div>
        </div>
    )
}

export default HomePage