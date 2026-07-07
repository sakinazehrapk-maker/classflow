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
function renderDays() {
    timetableGrid.innerHTML = "";
    days.forEach(day => {
        timetableGrid.innerHTML += `
            <div class="day-card" id="${day}">
                <h3>${day}</h3>
            </div>
        `;
    });
    renderClasses();
}
function renderClasses() {
    classes.forEach(currentClass => {
        const dayColumn = document.getElementById(currentClass.day);
        dayColumn.innerHTML += `
            <div class="class-card">
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
