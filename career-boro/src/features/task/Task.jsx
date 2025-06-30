import './Task.css'

function Task({task}) {
    return (
        <div className="box task">
            <div className="titleRow">
                <label className="checkboxContainer"><input type="checkbox" name="task" /><span className="checkmark"></span></label>
                <label className="expandCheckbox"><input type="checkbox" name="collapse" /><h3 className="taskTitle">{task.title} <span className={"taskCategory " + task.category.replace(" ", "")}>{task.category}</span></h3></label>
                <label className="expandToggle">▼</label>
            </div>
            <hr />
            <div className="box">
                <h3 className="sectionTitle">Description</h3>
                <p>{task.description}</p>
            </div>
            <div className="box">
                <h3 className="sectionTitle">Helpful Resources</h3>
                <div className="subBoxContainer">
                    {task.optional_resources.map((resource, index) => <p className="box" key={index}>{resource}</p>)}
                </div>
            </div>
        </div>
    )
}

export default Task