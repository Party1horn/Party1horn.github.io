window.onload = init;

function init(){
    let menu = document.getElementsByClassName("menu")[0];
    
    var open = false;
    setInterval(()=>{
        if(!open) {
            menu.classList.add("open");
            open = true;
        } else {
            menu.classList.remove("open");
            open = false;
        }
    }, 1000);
}