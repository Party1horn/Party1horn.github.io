const HTML = {
    trainingSelection: '<ul class="trainingSelection"><li>Training starten<ul class="trainings"></ul></li><li>Letztes Training: <label class="labelLastTraining"></label></li></ul>'
};

const Persistent = {
    lastTraining: null,
    load(){
        let lt = Number(localStorage.getItem("lastTraining"));
        if(lt) this.lastTraining = new Date(lt);
    },
    save(){
        if(this.lastTraining) localStorage.setItem("lastTraining", this.lastTraining.getTime());
    },
    getLastTraining() {
        return this.lastTraining;
    },
    setLastTraining(date){
        this.lastTraining = date;
    }
}

class Training {
    constructor(name, exercises){
        this.name = name;
        this.exercises = exercises;
    }
}

const TRAININGS = [
    new Training("Pull", []),
    new Training("Push", []),
    new Training("Leg", [])
];

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

class View {
    constructor(title){
        this.title = title;
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
    constructor(title){
        super(title);
        this.html = document.createElement("div");
        this.html.className = "training";
        this.html.innerHTML = HTML.trainingSelection;

        let trainings = this.html.getElementsByClassName("trainings")[0];
        for(let t of TRAININGS){
            let e = document.createElement("li");
            e.textContent = t.name;
            trainings.appendChild(e);
        }

        this.labelLastTraining = this.html.getElementsByClassName("labelLastTraining")[0];
    }
    updateLastTraining(){
        let lastTraining = Persistent.getLastTraining();
        if(lastTraining) this.labelLastTraining.textContent = lastTraining.toLocaleDateString();
        else labelLastTraining.textContent = "Keines";
    }
    onShown(){
        this.updateLastTraining();
    }
    onHidden(){

    }
    getHTML(){
        return this.html;
    }
}

const Views = {
    Home: new View("Home"),
    Training: new ViewTraining("Training"),
    Statistik: new View("Statistik")
}

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

function init(){
    Persistent.load();

    Menu.init();
    ViewPort.init();

    // ViewPort.showView(Views.Home);
}
window.onload = init;