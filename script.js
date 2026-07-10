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
    renderTodaySchedule();
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
    <button class="delete-btn" onclick="deleteClass(${classes.indexOf(currentClass)})">
        ✕
    </button>
    <h4>${currentClass.course}</h4>
    <p>${currentClass.start} - ${currentClass.end}</p>
    <p>${currentClass.room}</p>
</div>
`;
    });
}
function deleteClass(index){
    classes.splice(index, 1);
    localStorage.setItem("classes", JSON.stringify(classes));
    renderDays();
    renderTodaySchedule();
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
    renderTodaySchedule();
};
function updateWidget(){
    const now=new Date();
    const currentDay = now.toLocaleDateString(
        "en-US",
        { weekday: "long" }
    );
    const currentMinutes =
        now.getHours()*60 +
        now.getMinutes();
    let activeClass=null;
    let nextClass=null;
    classes.forEach(c=>{
        if(c.day!==currentDay) return;
        const start=timeToMinutes(c.start);
        const end=timeToMinutes(c.end);
        if(currentMinutes>=start && currentMinutes<end){
            activeClass=c;
        }
        if(currentMinutes<start){
            if(
                !nextClass ||
                start<timeToMinutes(nextClass.start)
            ){
                nextClass=c;
            }
        }
    });
    if(activeClass){
        document.getElementById("currentCourse").textContent=
        activeClass.course;
        document.getElementById("currentRoom").textContent=
        activeClass.room;
        document.getElementById("currentRoom").textContent=
        "Enjoy your break";
        document.getElementById("currentTime").textContent=
        `${activeClass.start} - ${activeClass.end}`;
        const total=
            timeToMinutes(activeClass.end) -
            timeToMinutes(activeClass.start);
        const passed=
            currentMinutes -
            timeToMinutes(activeClass.start);
        const percent=
            (passed/total)*100;
        document.getElementById("progress").style.width=
        percent+"%";
        const remaining=
            total-passed;
        document.getElementById("timeRemaining").textContent=
        `Time Left: ${remaining} min`;
    }else{
        document.getElementById("currentCourse").textContent=
        "No Class";
        document.getElementById("currentTime").textContent=
        "--";
        document.getElementById("progress").style.width=
        "0%";
        document.getElementById("timeRemaining").textContent=
        "Time Left: --";
    }
    if(nextClass){
    document.getElementById("nextClass").textContent=
    nextClass.course;
    document.getElementById("nextTime").textContent=
    `${nextClass.start} • ${nextClass.room}`;
}else{
    document.getElementById("nextClass").textContent=
    "No more classes today";
    document.getElementById("nextTime").textContent="";
}
}
function updateClock(){
    const now=new Date();
    document.getElementById("liveTime").textContent=
        now.toLocaleTimeString([],{
            hour:"2-digit",
            minute:"2-digit"
        });
}
function renderTodaySchedule(){
    const container=document.getElementById("todayClasses");
    container.innerHTML="";
    const today=new Date().toLocaleDateString(
        "en-US",
        { weekday:"long" }
    );
    const now=
        new Date().getHours()*60 +
        new Date().getMinutes();
    const todaysClasses=classes
        .filter(c => c.day===today)
        .sort((a,b)=>
            timeToMinutes(a.start)-timeToMinutes(b.start)
        );
    if(todaysClasses.length===0){
        container.innerHTML = `
            <p>No classes today</p>
        `;
        return;
    }
    todaysClasses.forEach(c=>{
        const start=timeToMinutes(c.start);
        const end=timeToMinutes(c.end);
        const active =
            now>=start && now<end
            ? "active"
            : "";
        container.innerHTML += `
            <div class="today-class ${active}">
                <div>
                    <strong>${c.course}</strong>
                    <br>
                    <small>${c.room}</small>
                </div>
                <div class="time">
                    ${c.start} - ${c.end}
                </div>
            </div>
        `;
    });
}
renderDays();
renderTodaySchedule();
updateWidget();
setInterval(updateWidget,60000);
updateClock();
setInterval(updateClock,1000);