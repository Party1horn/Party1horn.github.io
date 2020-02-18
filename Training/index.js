window.onload = init;

const Util = {
    clear(c){
        let x;
        while(x = c.lastChild) x.remove();
    }
};

const Menu = {
    html: null,
    htmlButton: null,
    isOpen: false,

    init(){
        Menu.html = document.getElementById("menu");
        Menu.htmlButton = document.getElementById("menuBtn");

        Menu.htmlButton.onclick = Menu.toggleMenu;
        //Menu.html.onclick = Menu.toggleMenu;

        for(let li of Menu.html.getElementsByTagName("li")){
            li.onclick = ()=>{
                ViewPort.showView(Views[li.textContent]);
                Menu.toggleMenu();
            };
        }
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

const ViewPort = {
    htmlContent: null,
    htmlLabelHead: null,
    currentView: null,

    init(){
        ViewPort.htmlContent = document.getElementById("content");
        ViewPort.htmlLabelHead = document.getElementById("labelHead");
    },

    showView(view){
        if(this.currentView) this.currentView.onHidden();
        this.currentView = view;
        view.onShown();
        Util.clear(this.htmlContent);
        this.htmlContent.append(view.getHTML());
        this.htmlLabelHead.textContent = view.title;
    }
};

class View {
    constructor(title){
        this.title = title
    }
    onShown(){

    }
    onHidden(){

    }
    getHTML(){
        let div = document.createElement("div");
        div.textContent = "In Entwicklung!";
        return div;
    }
}

class ViewTraining extends View {
    onShown(){

    }
    onHidden(){

    }
    getHTML(){
        let div = document.createElement("div");
        div.textContent = "Training!";
        return div;
    }
}

const Views = {
    Home: new View("Home"),
    Training: new ViewTraining("Training"),
    Statistik: new View("Statistik")
}

function init(){
    Menu.init();
    ViewPort.init();

    // ViewPort.showView(Views.Home);
}