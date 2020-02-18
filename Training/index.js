window.onload = init;

const Menu = {
    html: null,
    htmlButton: null,
    isOpen: false,

    init(){
        Menu.html = document.getElementById("menu");
        Menu.htmlButton = document.getElementById("menuBtn");

        Menu.htmlButton.onclick = Menu.toggleMenu;
        Menu.html.onclick = Menu.toggleMenu;
    },

    toggleMenu() {
        if(!Menu.open) {
            Menu.html.classList.add("open");
            Menu.open = true;
        } else {
            Menu.html.classList.remove("open");
            Menu.open = false;
        }
    }
};

function init(){
    Menu.init();
}