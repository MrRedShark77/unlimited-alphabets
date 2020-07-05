var game;
var alphabet_string = 'abcdefghijklmnopqrstuvwxyz';
var keysDown = {};

addEventListener("keydown", function(e){
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function(e){
    delete keysDown[e.keyCode];
}, false);

function init(){
    wipe();
    loadGame();
}

init();

var diff = 0;
var date = Date.now();

var tabLayers = {
    alphabets: 0,
    upgrades: 0,
    options: 0,
}

var currentTab = "alphabets";

function notate(ex,acc){
    if(E(ex).lt("e10")){
        return (Math.round(E(ex).toNumber()*10**acc)/10**acc).toLocaleString();
    } else if(E(ex).lt("ee10")) {
        return (10**(E(ex).log10().toNumber()%1)).toFixed(2) + "e" + notate(Math.floor(E(ex).log10().toNumber()),0);
    } else {
        return "e" + notate(E(ex).log10(),0);
    }
}

function switchTabs(tab){
    if(tabLayers[tab] == 0){
        document.getElementById(currentTab).style.display = "none";
        document.getElementById(tab).style.display = "block";
        currentTab = tab;
    }
}

function getRAlp(alp){
    let rAlp = E(10000).pow(game.value[alphabet_string[alp-1]].add(1).log10().logBase(4).sub(1));

    switch(alp){
        case 1:
            rAlp = rAlp.mul((game.alphabets_upgrades.b[1])?2:1)
            .mul((game.alphabets_upgrades.a[4])?5:1)
            .mul((game.alphabets_upgrades.a[6])?10:1)
            .mul((game.alphabets_upgrades.c[4])?10:1)
            .mul((game.alphabets_upgrades.c[2])?game.value.c.pow(1/((game.alphabets_upgrades.d[2])?5:8)).add(1):1)
            .mul((game.alphabets_upgrades.d[0])?5:1)
            .mul((game.alphabets_upgrades.d[3])?5:1)
            .mul((game.alphabets_upgrades.a[9])?game.value.a.add(1).log10().add(1).log10():1)
            .mul((game.alphabets_upgrades.e[1])?game.value.e.pow(1/8).add(1):1)
            .pow((game.alphabets_upgrades.c[1])?1.1:1)
            .pow((game.alphabets_upgrades.c[7])?2:1);
            break;
        case 2:
            rAlp = rAlp.mul((game.alphabets_upgrades.b[5])?2:1)
            .mul((game.alphabets_upgrades.b[6])?game.value.a.add(1).log10().pow((game.alphabets_upgrades.c[6])?3/4:1/2):1)
            .mul((game.alphabets_upgrades.a[7])?3:1)
            .mul((game.alphabets_upgrades.a[9])?game.value.a.add(1).log10().add(1).log10():1)
            .mul((game.alphabets_upgrades.b[8])?5:1)
            .mul((game.alphabets_upgrades.d[3])?5:1)
            .mul((game.alphabets_upgrades.d[6])?game.value.d.pow(1/4).add(1):1)
            .mul((game.alphabets_upgrades.e[1])?game.value.e.pow(1/8).add(1):1)
            .pow((game.alphabets_upgrades.d[1])?1.1:1);
            break;
        case 3:
            rAlp = rAlp.mul((game.alphabets_upgrades.a[8])?3:1)
            .mul((game.alphabets_upgrades.a[9])?game.value.a.add(1).log10().add(1).log10():1)
            .mul((game.alphabets_upgrades.b[7])?2:1)
            .mul((game.alphabets_upgrades.b[8])?5:1)
            .mul((game.alphabets_upgrades.c[8])?2:1)
            .mul((game.alphabets_upgrades.e[0])?5:1);
            break;
        case 4:
            rAlp = rAlp.mul((game.alphabets_upgrades.a[9])?game.value.a.add(1).log10().add(1).log10():1)
            .mul((game.alphabets_upgrades.b[9])?2:1)
            .mul((game.alphabets_upgrades.c[8])?2:1)
            .mul((game.alphabets_upgrades.d[7])?2:1);
            break;
    }

    return rAlp
}

function updateDisplay(){
    for(let i = 0; i < game.show_alphabets.length; i++){
        document.getElementById('af'+alphabet_string[i]).style.visibility = (game.show_alphabets[i]) ? "visible" : "hidden";
        document.getElementById('af'+alphabet_string[i]).style.background = (game.aplhabets_autobuyer[i]) ? "lightgreen" : "white";
        document.getElementById(alphabet_string[i]+'_tab').style.visibility = (game.show_alphabets[i]) ? "visible" : "hidden";
        upd(alphabet_string[i]+'_value', alphabet_string[i]+'-'+notate(game.value[alphabet_string[i]],2));

        for(let j = 1; j <= game.alphabets_upgrades_cost[alphabet_string[i]].length; j++){
            document.getElementById(alphabet_string[i]+'us'+j).style.display = (game.show_alphabets_upgrades[alphabet_string[i]][j-1]) ? "block" : "none";
            document.getElementById(alphabet_string[i]+'us'+j).style.background = (game.alphabets_upgrades[alphabet_string[i]][j-1]) ? "lightgreen" : "white";
            if(alphabet_string[i]+'u'+j == 'bu1'){
                upd('c1', notate(game.value.b.pow(1/((game.alphabets_upgrades.b[4] || game.alphabets_upgrades.e[2])?((game.alphabets_upgrades.e[2])?2:3):4)).add(1),2));
            } else if(alphabet_string[i]+'u'+j == 'cu3'){
                upd('c2', notate(game.value.c.pow(1/((game.alphabets_upgrades.d[2])?5:8)).add(1),2));
            } else if(alphabet_string[i]+'u'+j == 'bu4'){
                upd('c3', notate(getRAlp(1).div((game.alphabets_upgrades.c[3])?200:1000),2));
            } else if(alphabet_string[i]+'u'+j == 'bu7'){
                upd('c4', notate(game.value.a.add(1).log10().pow((game.alphabets_upgrades.c[6])?3/4:1/2),2));
            } else if(alphabet_string[i]+'u'+j == 'cu6'){
                upd('c5', notate(getRAlp(2).div((game.alphabets_upgrades.d[4])?200:1000),2));
            } else if(alphabet_string[i]+'u'+j == 'au10'){
                upd('c6', notate(game.value.a.add(1).log10().add(1).log10(),2));
            } else if(alphabet_string[i]+'u'+j == 'du6'){
                upd('c7', notate(getRAlp(3).div(1000),2));
            } else if(alphabet_string[i]+'u'+j == 'du7'){
                upd('c8', notate(game.value.d.pow(1/4).add(1),2));
            } else if(alphabet_string[i]+'u'+j == 'eu2'){
                upd('c9', notate(game.value.e.pow(1/8).add(1),2));
            }
            upd(alphabet_string[i]+'u'+j,notate(game.alphabets_upgrades_cost[alphabet_string[i]][j-1],2));  
        }

        if(0 < i & i < 26){
            let rAlp = getRAlp(i);

            document.getElementById('br'+alphabet_string[i]).style.background = (rAlp.gte(1)) ? "white" : "gray";
            upd('r'+alphabet_string[i],notate(rAlp,2));
        }
    }

    game.show_alphabets_upgrades = {
        a: [true, game.alphabets_upgrades.a[0], 
        game.alphabets_upgrades.a[0], 
        game.alphabets_upgrades.a[1], 
        game.alphabets_upgrades.a[1] & game.show_alphabets[1], 
        game.alphabets_upgrades.a[3], 
        game.alphabets_upgrades.a[3] & game.show_alphabets[1],
        game.alphabets_upgrades.a[4] & game.show_alphabets[2],
        game.alphabets_upgrades.a[7] & game.show_alphabets[3],
        game.alphabets_upgrades.a[5] & game.show_alphabets[1]],
        b: [true,
        game.alphabets_upgrades.b[0],
        game.alphabets_upgrades.b[0],
        game.alphabets_upgrades.b[1],
        game.alphabets_upgrades.b[2],
        game.alphabets_upgrades.b[1] & game.show_alphabets[2],
        game.alphabets_upgrades.b[4],
        game.alphabets_upgrades.b[5] & game.show_alphabets[3],
        game.alphabets_upgrades.b[7],
        game.alphabets_upgrades.b[8] & game.show_alphabets[4]],
        c: [game.show_alphabets[1],
        game.show_alphabets[1],
        game.alphabets_upgrades.c[0] & game.alphabets_upgrades.c[1],
        game.alphabets_upgrades.c[1],
        game.alphabets_upgrades.c[2],
        game.alphabets_upgrades.c[4],
        game.alphabets_upgrades.c[2],
        game.alphabets_upgrades.c[4],
        game.alphabets_upgrades.c[6] & game.show_alphabets[4]],
        d: [game.show_alphabets[2],
        game.alphabets_upgrades.d[0],
        game.alphabets_upgrades.d[0],
        game.alphabets_upgrades.d[1],
        game.alphabets_upgrades.d[1],
        game.alphabets_upgrades.d[4],
        game.alphabets_upgrades.d[4],
        game.alphabets_upgrades.d[5] & game.show_alphabets[4]],
        e: [game.show_alphabets[3],
        game.show_alphabets[3],
        game.alphabets_upgrades.e[0]],
    }
}

function buyAlpUpgrade(alp, id){
    if(game.value[alp].gte(game.alphabets_upgrades_cost[alp][id]) & !game.alphabets_upgrades[alp][id]){
        game.value[alp] = game.value[alp].sub(game.alphabets_upgrades_cost[alp][id]);
        game.alphabets_upgrades[alp][id] = true;
    }
}

function buyAAutobuyer(alp){
    if(game.value[alp].gte('1e15') & !game.aplhabets_autobuyer[alphabet_string.indexOf(alp)]){
        game.value[alp] = game.value[alp].sub('1e15');
        game.aplhabets_autobuyer[alphabet_string.indexOf(alp)] = true;
    }
}

function resetAlp(alp){
    let rAlp = getRAlp(alp)

    if(rAlp.gte(1)){
        game.value[alphabet_string[alp]] = game.value[alphabet_string[alp]].add(rAlp);
        for(let i = 0; i < alp; i++){
           game.value[alphabet_string[i]] = E(0);
           for(let j = 0; j < game.alphabets_upgrades[alphabet_string[i]].length; j++){
               game.alphabets_upgrades[alphabet_string[i]][j] = false;
           }
        }

        if(alp+1 < game.show_alphabets.length) game.show_alphabets[alp+1] = true; 
    }
}

function calc(dt){
    game.value.a = game.value.a
    .add((game.alphabets_upgrades.a[0])?E((game.alphabets_upgrades.a[1])?5:1)
    .mul((game.alphabets_upgrades.a[2])?10:1)
    .mul((game.alphabets_upgrades.a[9])?game.value.a.add(1).log10().add(1).log10():1)
    .mul((game.alphabets_upgrades.b[0])?game.value.b.pow(1/((game.alphabets_upgrades.b[4] || game.alphabets_upgrades.e[2])?((game.alphabets_upgrades.e[2])?2:3):4)).add(1):1)
    .mul((game.alphabets_upgrades.b[2])?10:1)
    .mul((game.alphabets_upgrades.b[9])?2:1)
    .mul((game.alphabets_upgrades.c[0])?5:1)
    .mul((game.alphabets_upgrades.c[2])?game.value.c.pow(1/((game.alphabets_upgrades.d[2])?5:8)).add(1):1)
    .mul((game.alphabets_upgrades.d[0])?5:1)
    .mul((game.alphabets_upgrades.e[0])?5:1)
    .pow((game.alphabets_upgrades.a[3])?2:1)
    .pow((game.alphabets_upgrades.a[5])?1.2:1)
    .pow((game.alphabets_upgrades.d[1])?1.1:1)
    .mul(dt/1000):0);

    for(let i = 1; i < game.show_alphabets.length - 1; i++){
        let rAlp = getRAlp(i)
        
        switch(i){
            case 1:
                game.value[alphabet_string[i]] = game.value[alphabet_string[i]]
                .add((game.alphabets_upgrades.b[3])?rAlp
                .mul(dt/((game.alphabets_upgrades.c[3])?200000:1000000)):0);
                break;
            case 2:
                game.value[alphabet_string[i]] = game.value[alphabet_string[i]]
                .add((game.alphabets_upgrades.c[5])?rAlp
                .mul(dt/((game.alphabets_upgrades.d[4])?200000:1000000)):0);
                break;
            case 3:
                game.value[alphabet_string[i]] = game.value[alphabet_string[i]]
                .add((game.alphabets_upgrades.d[5])?rAlp
                .mul(dt/1000000):0);
                break;
        }
    }
    
    for(let i = 0; i < game.show_alphabets.length; i++){
        if(game.aplhabets_autobuyer[i] || keysDown[77])for(let j = 0; j < game.show_alphabets_upgrades[alphabet_string[i]].length; j++){
            if(game.show_alphabets_upgrades[alphabet_string[i]][j])buyAlpUpgrade(alphabet_string[i], j);
        }
    }
}

function buyAllUpgrades() {
    for(let i = 0; i < game.show_alphabets.length; i++){
        for(let j = 0; j < game.show_alphabets_upgrades[alphabet_string[i]].length; j++){
            if(game.show_alphabets_upgrades[alphabet_string[i]][j])buyAlpUpgrade(alphabet_string[i], j);
        }
    }
}

function loop(){
    diff = Date.now()-date;
    calc(diff);
    updateDisplay();
    date = Date.now();
}

setInterval(save,1000);

setInterval(loop, 50);