const addBtn=document.getElementById("addClass");
addBtn.addEventListener("click",()=>{
    const course=document.getElementById("course").value;
    const day=document.getElementById("day").value;
    const start=document.getElementById("startTime").value;
    const end=document.getElementById("endTime").value;
    const room=document.getElementById("room").value;
    console.log(course, day, start, end, room);
});
