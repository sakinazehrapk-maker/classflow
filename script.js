const timetableGrid = document.getElementById("timetableGrid");
const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday"
];
let classes = JSON.parse(localStorage.getItem("classes")) || [];
const modal = document.getElementById("modal");
document.getElementById("openModal").onclick = () => {
    modal.style.display = "flex";
};
document.getElementById("closeModal").onclick = () => {
    modal.style.display = "none";
};
function renderDays(){
    const daysGrid =document.getElementById("daysGrid");
    const timeColumn=document.getElementById("timeColumn");
    daysGrid.innerHTML="";
    timeColumn.innerHTML="";
    for(let hour=8; hour<=17;hour++){
        timeColumn.innerHTML+= `
            <div class="time-slot">
                ${hour}:00
            </div>
        `;
    }
    days.forEach(day=>{
        daysGrid.innerHTML += `
            <div class="day-column">
                <div class="day-header">
                    ${day}
                </div>
                <div
                    class="day-body"
                    id="${day}">
                </div>
          </div>
        `;
    });
    renderClasses();
}
function timeToMinutes(time){
    const [hour, minute] = time.split(":").map(Number);
    return hour * 60 + minute;
}
function calculateTop(start){
    const startOfSchedule = 8 * 60;
    return ((timeToMinutes(start)-startOfSchedule) / 60) * 80;
}
function calculateHeight(start,end){
    return ((timeToMinutes(end) - timeToMinutes(start)) / 60) * 80;
}
function renderClasses(){
    classes.forEach(currentClass=>{
        const dayColumn = document.getElementById(currentClass.day);
        const top = calculateTop(currentClass.start);
        const height = calculateHeight(
            currentClass.start,
            currentClass.end
        );
        dayColumn.innerHTML += `
        <div
            class="class-card"
            style="
                top:${top}px;
                height:${height}px;
            "
        >
            <h4>${currentClass.course}</h4>
            <p>${currentClass.start} - ${currentClass.end}</p>
            <p>${currentClass.room}</p>
        </div>
        `;
    });
}
document.getElementById("saveClass").onclick = () => {
    const course = document.getElementById("course").value;
    const day = document.getElementById("day").value;
    const start = document.getElementById("start").value;
    const end = document.getElementById("end").value;
    const room = document.getElementById("room").value;
    if (!course || !start || !end || !room) {
        alert("Please fill all fields.");
        return;
    }
    classes.push({
        course,
        day,
        start,
        end,
        room
    });
    localStorage.setItem("classes", JSON.stringify(classes));
    modal.style.display = "none";
    document.getElementById("course").value ="";
    document.getElementById("start").value ="";
    document.getElementById("end").value ="";
    document.getElementById("room").value="";
    renderDays();
};
renderDays();
