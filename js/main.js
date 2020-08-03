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
    sing: 0,
}

var currentTab = "alphabets";

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
            .pow((game.show_alphabets[3])?game.singPower.add(1).log10().pow(1).div(500).add(1):1)
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
            .mul((game.alphabets_upgrades.d[6])?game.value.d.pow((game.alphabets_upgrades.d[5])?1/3:1/4).add(1):1)
            .mul((game.alphabets_upgrades.e[1])?game.value.e.pow(1/8).add(1):1)
            .pow((game.show_alphabets[3])?game.singPower.add(1).log10().pow(1).div(500).add(1):1)
            .pow((game.alphabets_upgrades.d[1])?1.1:1)
            .pow((game.alphabets_upgrades.e[4])?1.2:1);
            break;
        case 3:
            rAlp = rAlp.mul((game.alphabets_upgrades.a[8])?3:1)
            .mul((game.alphabets_upgrades.a[9])?game.value.a.add(1).log10().add(1).log10():1)
            .mul((game.alphabets_upgrades.b[7])?2:1)
            .mul((game.alphabets_upgrades.b[8])?5:1)
            .mul((game.alphabets_upgrades.c[8])?2:1)
            .mul((game.alphabets_upgrades.e[0])?5:1)
            .pow((game.show_alphabets[3])?game.singPower.add(1).log10().pow(1).div(500).add(1):1);
            break;
        case 4:
            rAlp = rAlp.mul((game.alphabets_upgrades.a[9])?game.value.a.add(1).log10().add(1).log10():1)
            .mul((game.alphabets_upgrades.b[9])?2:1)
            .mul((game.alphabets_upgrades.c[8])?2:1)
            .mul((game.alphabets_upgrades.d[7])?2:1)
            .mul((game.alphabets_upgrades.f[0])?5:1)
            .pow((game.show_alphabets[3])?game.singPower.add(1).log10().pow(1).div(500).add(1):1);
            break;
        case 5:
            break;
    }

    return rAlp
}

function updateDisplay(){
    document.getElementById('singularity').style.display = (game.show_alphabets[3]) ? "table-column" : "none";
    upd('notation', n_mode[game.notation])
    for(let i = 0; i < game.show_alphabets.length; i++){
        document.getElementById('af'+alphabet_string[i]).style.visibility = (game.show_alphabets[i]) ? "visible" : "hidden";
        document.getElementById('af'+alphabet_string[i]).style.background = (game.aplhabets_autobuyer[i]) ? "lightgreen" : "white";
        document.getElementById(alphabet_string[i]+'_tab').style.visibility = (game.show_alphabets[i]) ? "visible" : "hidden";
        upd(alphabet_string[i]+'_value', alphabet_string[i]+'-'+notate(game.value[alphabet_string[i]],2));

        for(let j = 1; j <= alphabets_upgrades_cost[alphabet_string[i]].length; j++){
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
                upd('c7', notate(getRAlp(3).div((game.alphabets_upgrades.e[6])?200:1000),2));
            } else if(alphabet_string[i]+'u'+j == 'du7'){
                upd('c8', notate(game.value.d.pow((game.alphabets_upgrades.d[5])?1/3:1/4).add(1),2));
            } else if(alphabet_string[i]+'u'+j == 'eu2'){
                upd('c9', notate(game.value.e.pow(1/8).add(1),2));
            } else if(alphabet_string[i]+'u'+j == 'eu4'){
                upd('c10', notate(getRAlp(4).div(1000),2));
            }
            upd(alphabet_string[i]+'u'+j,notate(alphabets_upgrades_cost[alphabet_string[i]][j-1],2));  
        }

        if(0 < i & i < 26){
            let rAlp = getRAlp(i);

            document.getElementById('br'+alphabet_string[i]).style.background = (rAlp.gte(1)) ? "white" : "gray";
            upd('r'+alphabet_string[i],notate(rAlp,2));
        }
    }

    upd('sing1', notate(game.singPower, 2))
    upd('sing2', '^' + notate(game.singPower.add(1).log10().pow(1).div(500).add(1), 4))
    upd('sing3', '+' + notate(game.value.a.add(1).log10().mul(E(2).pow(game.sing_upgrades[0])),2))

    for (let i = 0; i < game.sing_upgrades.length; i++){
        document.getElementById('singus'+(i+1)).style.background = (game.sing_upgrades[i] >= sing_max_upgrades[i]) ? "lightgreen" : "white";
        upd('singu'+(i+1), notate(sing_upgrades_cost[i][0].mul(sing_upgrades_cost[i][1].pow(game.sing_upgrades[i])), 0))
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
        b: [game.show_alphabets[1],
        game.alphabets_upgrades.b[0],
        game.alphabets_upgrades.b[0],
        game.alphabets_upgrades.b[1],
        game.alphabets_upgrades.b[2],
        game.alphabets_upgrades.b[1] & game.show_alphabets[2],
        game.alphabets_upgrades.b[4],
        game.alphabets_upgrades.b[5] & game.show_alphabets[3],
        game.alphabets_upgrades.b[7],
        game.alphabets_upgrades.b[8] & game.show_alphabets[4]],
        c: [game.show_alphabets[2],
        game.show_alphabets[2],
        game.alphabets_upgrades.c[0] & game.alphabets_upgrades.c[1],
        game.alphabets_upgrades.c[1],
        game.alphabets_upgrades.c[2],
        game.alphabets_upgrades.c[4],
        game.alphabets_upgrades.c[2],
        game.alphabets_upgrades.c[4],
        game.alphabets_upgrades.c[6] & game.show_alphabets[4]],
        d: [game.show_alphabets[3],
        game.alphabets_upgrades.d[0],
        game.alphabets_upgrades.d[0],
        game.alphabets_upgrades.d[1],
        game.alphabets_upgrades.d[1],
        game.alphabets_upgrades.d[4],
        game.alphabets_upgrades.d[4],
        game.alphabets_upgrades.d[5] & game.show_alphabets[4]],
        e: [game.show_alphabets[4],
        game.show_alphabets[4],
        game.alphabets_upgrades.e[0],
        game.alphabets_upgrades.e[2],
        game.alphabets_upgrades.e[2],
        game.alphabets_upgrades.e[4],
        game.alphabets_upgrades.e[5]],
        f: [game.show_alphabets[5]],
    }
}

function buyAlpUpgrade(alp, id){
    if(game.value[alp].gte(alphabets_upgrades_cost[alp][id]) & !game.alphabets_upgrades[alp][id]){
        game.value[alp] = game.value[alp].sub(alphabets_upgrades_cost[alp][id]);
        game.alphabets_upgrades[alp][id] = true;
    }
}

function buyAAutobuyer(alp){
    if(game.value[alp].gte('1e15') & !game.aplhabets_autobuyer[alphabet_string.indexOf(alp)]){
        game.value[alp] = game.value[alp].sub('1e15');
        game.aplhabets_autobuyer[alphabet_string.indexOf(alp)] = true;
    }
}

function buySingUpgrade(n){
    let cost = sing_upgrades_cost[n][0].mul(sing_upgrades_cost[n][1].pow(game.sing_upgrades[n]))
    if(game.singPower.gte(cost) && game.sing_upgrades[n] < sing_max_upgrades[n]){
        game.singPower = game.singPower.sub(cost)
        game.sing_upgrades[n] += 1
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

        game.show_alphabets[alp] = true;
        game.singPower = E(0);
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
    .mul((game.alphabets_upgrades.f[0])?5:1)
    .pow((game.show_alphabets[3])?game.singPower.add(1).log10().pow(1).div(500).add(1):1)
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
                .mul(dt/((game.alphabets_upgrades.e[6])?200000:1000000)):0);
                break;
            case 4:
                game.value[alphabet_string[i]] = game.value[alphabet_string[i]]
                .add((game.alphabets_upgrades.e[3])?rAlp
                .mul(dt/1000000):0);
                break;
        }
    }
    
    for(let i = 0; i < game.show_alphabets.length; i++){
        if(game.aplhabets_autobuyer[i] || keysDown[77])for(let j = 0; j < game.show_alphabets_upgrades[alphabet_string[i]].length; j++){
            if(game.show_alphabets_upgrades[alphabet_string[i]][j])buyAlpUpgrade(alphabet_string[i], j);
        }
    }

    game.singPower = game.singPower.add(game.value.a.add(1).log10().mul(E(2).pow(game.sing_upgrades[0])).mul(dt / 1000))
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