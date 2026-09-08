const theme=document.getElementById("theme");
if(localStorage.getItem("theme")==="light")document.body.classList.add("light");
theme?.addEventListener("click",()=>{document.body.classList.toggle("light");localStorage.setItem("theme",document.body.classList.contains("light")?"light":"dark")});
const glow=document.querySelector(".cursor-glow");document.addEventListener("pointermove",e=>{if(glow){glow.style.left=e.clientX+"px";glow.style.top=e.clientY+"px"}});
