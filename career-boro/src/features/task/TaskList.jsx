import { useState, useRef, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import Task from "./Task"
import './TaskList.css'
import { fetchTasks } from "./taskSlice"

const filterOptions = ["Show All", "Technical", "Soft Skill", "Career Branding"]

function TaskList() {

    const { loading, tasks, error } = useSelector((state) => state.task)

    const [taskList, setTaskList] = useState(tasks)

    const [filterCategory, setFilterCategory] = useState("Show All")

    const dispatch = useDispatch()
    const run = useRef(false)

    useEffect(() => {
        if (run.current) return
        dispatch(fetchTasks())
        run.current = true
    })

    useEffect(() => {
        setTaskList(tasks)
    }, [tasks])

    const filterTasks = (key) => {

        if (key === "Show All") {
            setTaskList(tasks)
            return
        }

        setTaskList(() => {

            const newTasks = [...tasks].filter(task => task.category === key)
            return newTasks
        })

    }

    const updateSelectAnswer = (option) => {
        setFilterCategory(option)
        filterTasks(option)
    }

    return (
        <>
        <div className="nav-bar">
            <div>My Profile</div>
            <div className="selectedNav">Task List</div>
            <div>Career Coach</div>
            <div>Resume Writer</div>
            <div>Job Search</div>
        </div>

        <div className="container yPaddedContainer">
            <div className="tasksTitleBar">
                <h1 className="title">Your Tasks</h1>
                <div className="selectWrapper">
                    <input type="button" name="answerSelect" value={filterCategory} className="answerSelect" />
                    <div className="selectionList">
                        {filterOptions.map(option => <p key={option} onClick={()=> updateSelectAnswer(option)}>{option}</p>)}
                    </div>
                </div>
            </div>

            {
                /* Loading */
                loading && <div className="viewCentered"><p className="loadingIcon"><i className="fa fa-spinner fa-spin"></i></p></div>
            }

            {
                /* Tasks */
                !loading && taskList.length !== 0 && taskList.map((task, index) => <Task key={index} task={task} />)
            }

            {
                /* Error */
                !loading && error && <h3>{error}</h3>
            }
        </div>
        </>
    )
}

export default TaskList