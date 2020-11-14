function E(x){return new ExpantaNum(x)};

function ex(x){
    let nx = new E(0);
    nx.array = x.array;
    nx.sign = x.sign;
    nx.layer = x.layer;
    return nx;
}

function calc(dt) {
    player.ticks += dt
    if (player.alphabets.a) player.alphabets.a.resource = player.alphabets.a.resource.add(FUNCTIONS.alps.aps().mul(dt/1000))
    for (let i = 1; i <= Object.keys(FUNCTIONS.alps.gain).length; i++) if (i <= player.automators[1]) if (player.alphabets[FUNCTIONS.alphabet(i+1)]) {
        player.alphabets[FUNCTIONS.alphabet(i+1)].resource = player.alphabets[FUNCTIONS.alphabet(i+1)].resource.add(FUNCTIONS.alps.gps(i+1).mul(dt/1000))
    }
    if (FUNCTIONS.alps.have() <= Object.keys(FUNCTIONS.alps.gain).length) if (FUNCTIONS.alps.gain[FUNCTIONS.alphabet(FUNCTIONS.alps.have())]().gte(1)) {
        FUNCTIONS.alps.add()
    }
    for (let i = 1; i <= UPGRADES.total; i++) if (player.automators[0] >= i) for (let r = 1; r <= UPGRADES.alps[FUNCTIONS.alphabet(i)].row; r++) UPGRADES.buy(FUNCTIONS.alphabet(i), r)
}

function wipe() {
    player = {
        alphabets: {},
        automators: [0, 0],
        ticks: 0,
        tab: 3,
        alp_tab: 0,
    }
    FUNCTIONS.alps.add()
    player.alphabets.a.unlocked = true
}

function save(){
    if (localStorage.getItem("UA_beta_save") == '') wipe()
    localStorage.setItem("UA_beta_save",btoa(JSON.stringify(player)))
}
    
function load(x){
    if(typeof x == "string" & x != ''){
        loadPlayer(JSON.parse(atob(x)))
    } else {
        wipe()
    }
}

function exporty() {
    save();
    let file = new Blob([btoa(JSON.stringify(player))], {type: "text/plain"})
    window.URL = window.URL || window.webkitURL;
    let a = document.createElement("a")
    a.href = window.URL.createObjectURL(file)
    a.download = "UA Beta Save.txt"
    a.click()
}

function importy() {
    let loadgame = prompt("Paste in your save WARNING: WILL OVERWRITE YOUR CURRENT SAVE")
    if (loadgame != "") {
        load(loadgame)
    }
}

function loadPlayer(load) {
    for (let i = 1; i <= Object.keys(load.alphabets).length; i++) {
        player.alphabets[FUNCTIONS.alphabet(i)] = {
            unlocked: load.alphabets[FUNCTIONS.alphabet(i)].unlocked,
            resource: ex(load.alphabets[FUNCTIONS.alphabet(i)].resource),
            upgrades: load.alphabets[FUNCTIONS.alphabet(i)].upgrades,
        }
    }
    player.ticks = load.ticks
    if (load.automators) player.automators = load.automators
}

function loadGame() {
    wipe()
    load(localStorage.getItem("UA_beta_save"))
    loadVue()
    setInterval(save,1000)
}