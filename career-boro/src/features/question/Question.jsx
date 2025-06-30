import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { updateProfile } from './questionSlice'
import form_qa from './form_qa.json'
import country from 'country-list-js'
import './Question.css'

// get questions, and answerFormats, a list with elements consisting the input type (input, select, multi), placeholder text for input, options for select and multiselect
const questions = Object.keys(form_qa)
const answerFormats = Object.values(form_qa)

// get a list of country names, possible addition: "not sure yet"?
const country_names = country.names()

function Question({questionIndex, questionRefs, inputRefs}) {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  // init variables, answerKeys is used to access key in answers to set value, answerToSet is the current question key of answers
  const userProfile = useSelector((state) => state.question.userProfile)
  const answerKeys = Object.keys(userProfile)
  const answerToSet = answerKeys[questionIndex]
  
  // answerFormat is the current answerFormat, see "answerFormats to understand what is included"
  const answerFormat = answerFormats[questionIndex]

  // questionRef is the ref of the current question, passed into the ref of form element later to set ref, nextQuestionRef is used to scroll to next question
  const questionRef = questionRefs.current[questionIndex]
  const nextQuestionRef = questionRefs.current[questionIndex + 1]

  const inputRef = inputRefs.current[questionIndex]
  const nextInputRef = inputRefs.current[questionIndex + 1]

  // dropdonwValue stores the value selected in the current dropdown question so that it can be rendered in the field of the dropdown
  const [dropdownValue, setDropdownValue] = useState(answerFormat.options ? answerFormat.options[0] : "")

  // stores a list of names of countries matching the search query
  const [countrySearchResult, setCountrySearchResult] = useState([])

  // sets the answers of a question of type input
  const updateInputAnswer = (e)=> {
    dispatch(updateProfile({key: answerToSet, value: e.target.value}))
    // answers.current[answerToSet] = e.target.value
  }

  // update the dropdown value on new selection
  const selectDropdownOption = (option)=> {
    setDropdownValue(option)
  }

  // sets the answers of a question of type select (dropdown)
  const updateSelectAnswer = (value)=> {
    dispatch(updateProfile({key: answerToSet, value}))
    // answers.current[answerToSet] = value
    selectDropdownOption(value)
  }

  // scrolls to next question
  const scrollToNextQuestion = ()=> {
    inputRef.current?.blur()
    nextQuestionRef?.current.scrollIntoView()
    nextInputRef?.current?.focus()
  }

  // handle the submission of questions of type input or select
  const handleSubmit = (e)=> {
    e.preventDefault()
    if (questionIndex == 7) {
      navigate('/career')
      return
    }
    scrollToNextQuestion()
  }

  // handle the submission of questions of type multiselect, stores answers in format of string "selection1, selection2, selection3..."
  const handleMultiselectSubmit = (e)=> {
    e.preventDefault()
    var selectionString = ""
    for (let i = 0; i < answerFormat.options.length; i++) {
      const option = answerFormat.options[i]
      console.log(option)
      if (e.target[i].checked) {
        selectionString += option + ", "
      }
    }
    dispatch(updateProfile({key: answerToSet, value: selectionString}))
    // answers.current[answerToSet] = selectionString
  }

  // searches for countries matching the search query and stores list in countrySearchResult
  const searchCountries = (e)=> {
    setDropdownValue(e.target.value)
    setCountrySearchResult(country_names.filter(name => name.toLowerCase().substring(0, e.target.value.length) == e.target.value.toLowerCase()))
  }

  // different components for each question type
  switch (answerFormat.type) {
    case "input":
      return (
        <form ref={questionRef} className="box question" id={questionIndex} onSubmit={handleSubmit}>
          <h3>{(questionIndex + 1).toString() + ". " + questions[questionIndex]}</h3>

          <div className="inputRow">
            <input ref={inputRef} type="text" placeholder={answerFormat.placeholder} name="answerInput" onChange={updateInputAnswer} />
            <input type="submit" className="doneBtn" value="Next" />
          </div>
        </form>
      )

    case "select":
      return (
        <form ref={questionRef} className="box question"  id={questionIndex} onSubmit={handleSubmit}>
          <h3>{(questionIndex + 1).toString() + ". " + questions[questionIndex]}</h3>

          <div className="inputRow">
            <div className="selectWrapper">
              <input type="button" name="answerSelect" value={dropdownValue} className="answerSelect" />
              <div className="selectionList">
                {answerFormat.options.map(option => <p key={option} onClick={()=> updateSelectAnswer(option)}>{option}</p>)}
              </div>
            </div>
            <input type="submit" className="doneBtn" value={questionIndex == 7 ? "Submit" : "Next"} />
          </div>
        </form>
      )

    case "multiselect":
      return (
        <form ref={questionRef} className="box question" id={questionIndex} onChange={()=> questionRef.current.requestSubmit()} onSubmit={handleMultiselectSubmit}>
          <h3>{(questionIndex + 1).toString() + ". " + questions[questionIndex]}</h3>

          <div className="optionsWrapper">
            {answerFormat.options.map(option => <label className="multiOption" key={option}><input type="checkbox" name={option} id={option} />{option}</label>)}
          </div>
          <input type="submit" className="doneBtn" value="Next" onClick={scrollToNextQuestion} />
        </form>
      )

      case "country":
        return (
          <form ref={questionRef} className="box question"  id={questionIndex} onSubmit={handleSubmit}>
            <h3>{(questionIndex + 1).toString() + ". " + questions[questionIndex]}</h3>

            <div className="inputRow">
              <div className="selectWrapper">
                <input type="text" name="answerSelect" value={dropdownValue} placeholder="Please Select A Country" className="answerSelect" onChange={searchCountries} />
                <div className="selectionList">
                  {countrySearchResult?.map(option => <p key={option} onClick={()=> updateSelectAnswer(option)}>{option}</p>)}
                </div>
              </div>
              <input type="submit" className="doneBtn" value="Next" />
            </div>
          </form>
        )
  }
}

export default Question