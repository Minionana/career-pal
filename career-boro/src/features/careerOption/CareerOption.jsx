import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { selectCareer } from '../career/careerSlice'
import './CareerOption.css'

function CareerOption({career}) {
    
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const pickCareer = () => {
        dispatch(selectCareer(career.title))
        navigate('/auth')
    }

    return (
        <div className="box careerOption">
            <h2>{career.title}</h2>
            <p>{career.description}</p>
            <hr />
            <div className="box">
                <h3 className="sectionTitle">Industry Outlook</h3>
                <p>{career.industryOutlook}</p>
            </div>
            <div className="box">
                <h3 className="sectionTitle">Estimated Salary</h3>
                <p>{career.estimatedSalary}</p>
            </div>
            <div className="skillsBox">
                <div className="box">
                    <h3 className="sectionTitle">Technical Skills</h3>
                    <div className="subBoxContainer">
                        {career.technicalSkills.map((technicalSkill, index) => <p className="box" key={index}>{technicalSkill}</p>)}
                    </div>
                </div>
                <div className="box">
                    <h3 className="sectionTitle">Soft Skills</h3>
                    <div className="subBoxContainer">
                        {career.softSkills.map((softSkill, index) => <p className="box" key={index}>{softSkill}</p>)}
                    </div>
                </div>
            </div>
            <div className="box">
                <h3 className="sectionTitle">Why It Fits</h3>
                <p>{career.whyItFits}</p>
            </div>
            <div className="box">
                <h3 className="sectionTitle">Tradeoffs Or Risks</h3>
                <p>{career.tradeoffsOrRisks}</p>
            </div>
            <input type="button" value="Choose This Career" onClick={pickCareer} />
            <hr />
            <label className="expandToggle"><input type="checkbox" name="collapse" />▼</label>
        </div>
    )
}

export default CareerOption