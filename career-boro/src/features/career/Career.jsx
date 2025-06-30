import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useRef } from 'react'
import { fetchCareer } from './careerSlice'
import CareerOption from '../careerOption/CareerOption'
import './Career.css'

function Career(){

    const dispatch = useDispatch()

    const { userProfile } = useSelector((state) => state.question)
    const { loading, careers, error } = useSelector((state) => state.career)

    // checking if form is complete
    const complete = Object.values(userProfile).every(val => val !== "")

    // remove this after dev; this is to avoid double rendering
    const run = useRef(false)

    // display incomplete form is form is not complete
    if (!complete) {
        return (
            <h3>Incomplete Form</h3>
        )
    }

    // fetch data is form is complete
    useEffect(() => {
        if (run.current) return
        if (!complete) return
        console.log("ho")
        dispatch(fetchCareer())
        run.current = true
    }, [complete])



    return (
        <div className="container yPaddedContainer">
            <h1 className="title">Career Options</h1>
            {
                /* Loading */
                loading && <div className="viewCentered"><p className="loadingIcon"><i className="fa fa-spinner fa-spin"></i></p></div>
            }

            {
                /* Careers */
                !loading && careers.length !== 0 && careers.map((career, index) => <CareerOption career={career} key={index} />)
            }

            {
                /* Error */
                !loading && error && <h3>{error}</h3>
            }
        </div>
    )

}

export default Career