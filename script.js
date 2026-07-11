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
        background:${currentClass.color};
    ">
    <button
        class="delete-btn"
        onclick="deleteClass(${classes.indexOf(currentClass)})">
        ✕
    </button>
    <div class="class-info">
        <h4>${currentClass.course}</h4>
        <p>🕒 ${currentClass.start} - ${currentClass.end}</p>
        <p>📍 ${currentClass.room}</p>
    </div>
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
    const color=document.getElementById("color").value;
    classes.push({
    id:Date.now(),
    course,
    day,
    start,
    end,
    room,
    color,
    present: 0,
    absent: 0
});
    localStorage.setItem("classes", JSON.stringify(classes));
    modal.style.display = "none";
    document.getElementById("course").value ="";
    document.getElementById("start").value ="";
    document.getElementById("end").value ="";
    document.getElementById("room").value="";
    document.getElementById("color").value="#2563eb";
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
        document.getElementById("currentCourse").style.color =
        activeClass.color;
        document.getElementById("currentRoom").textContent=
        activeClass.room;
        document.getElementById("currentRoom").textContent=
        activeClass.room;
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
        document.getElementById("currentCourse").style.color =
        "#111827";
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
            <div class="today-class ${active}"
            style="border-left:6px solid ${c.color};"
            >
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
const themeButton=document.getElementById("themeToggle");
const savedTheme=localStorage.getItem("theme");
if(savedTheme==="dark"){
    document.body.classList.add("dark");
    themeButton.textContent="☀️";
}
themeButton.onclick=()=>{
    document.body.classList.toggle("dark");
    if(document.body.classList.contains("dark")){
        themeButton.textContent="☀️";
        localStorage.setItem("theme","dark");
    }else{
        themeButton.textContent="🌙";
        localStorage.setItem("theme","light");
    }
};
function updateGreeting(){
    const hour=new Date().getHours();
    let greeting="";
    if(hour < 12){
        greeting="Good Morning";
    }else if(hour < 17){
        greeting="Good Afternoon";
    }else{
        greeting="Good Evening";
    }
    document.getElementById("greeting").textContent=greeting;
}
function getAttendancePercentage(course){
    const present=course.present||0;
    const absent=course.absent||0;
    const total=present+absent;
    if(total===0) return 100;
    return Math.round((present/total)*100);
}
function markPresent(id){
    const subject=classes.find(c => c.id === id);
    subject.present++;
    localStorage.setItem("classes",JSON.stringify(classes));
    renderDays();
    renderTodaySchedule();
    updateWidget();
}
function markAbsent(id){
    const subject=classes.find(c => c.id === id);
    subject.absent++;
    localStorage.setItem("classes",JSON.stringify(classes));
    renderDays();
    renderTodaySchedule();
    updateWidget();
}
const timetablePage=
document.getElementById("timetablePage");
const attendancePage=
document.getElementById("attendancePage");
document.getElementById("showTimetable").onclick=()=>{
    timetablePage.classList.remove("hidden");
    attendancePage.classList.add("hidden");
};
document.getElementById("showAttendance").onclick=()=>{
    attendancePage.classList.remove("hidden");
    timetablePage.classList.add("hidden");
    renderAttendance();
};
function renderAttendance(){
    const container=
    document.getElementById("attendanceContainer");
    container.innerHTML="";
    classes.forEach(subject=>{
        const percentage=
        getAttendancePercentage(subject);
        container.innerHTML+= `
        <div class="attendance-card">
            <h3>${subject.course}</h3>
            <p>${subject.day}</p>
            <p>
                Present:
                ${subject.present}
            </p>
            <p>
                Absent:
                ${subject.absent}
            </p>
            <h2>
                ${percentage}%
            </h2>
            <div class="attendance-actions">
                <button
                onclick="markPresent(${subject.id})">
                    ✅ Present
                </button>
                <button
                onclick="markAbsent(${subject.id})">
                    ❌ Absent
                </button>
            </div>
        </div>
        `;
    });
}
renderDays();
renderTodaySchedule();
updateWidget();
setInterval(updateWidget,1000);
updateClock();
setInterval(updateClock,1000);
updateGreeting();
