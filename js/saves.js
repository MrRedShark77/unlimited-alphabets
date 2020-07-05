function upd(x,y){document.getElementById(x).textContent = y};
function E(x){return new ExpantaNum(x)};

function ex(x){
  let nx = new E(0);
  nx.array = x.array;
  nx.sign = x.sign;
  nx.layer = x.layer;
  return nx;
}

function wipe(){
  game = {
    value: {
      a: E(0),
      b: E(0),
      c: E(0),
      d: E(0),
      e: E(0),
    },
    alphabets_upgrades: {
      a: [false, false, false, false, false, false, false, false, false, false],
      b: [false, false, false, false, false, false, false, false, false, false],
      c: [false, false, false, false, false, false, false, false, false],
      d: [false, false, false, false, false, false, false, false],
      e: [false, false, false],
    },
    alphabets_upgrades_cost: {
      a: [E(0), E(25), E(100), E('2.5e3'), E('3e6'), E('5e8'), E('1e12'), E('1e16'), E('1.5e22'), E('1e30')],
      b: [E(5), E(50), E(300), E(3500), E('1.5e6'), E('2.5e7'), E('5e8'), E('2e11'), E('1e15'), E('1e33')],
      c: [E(5), E(25), E(100), E('1e3'), E('7.5e3'), E('2e4'), E('2.5e5'), E('1.5e9'), E('2.5e13')],
      d: [E(5), E(15), E(65), E(225), E('1.5e3'), E('2.5e4'), E('3e5'), E('1.5e6')],
      e: [E(5), E(20), E(100)],
    },
    show_alphabets: [true, true, false, false, false],
    show_alphabets_upgrades: {
      a: [true, false, false, false, false, false, false, false, false, false],
      b: [false, false, false, false, false, false, false, false, false, false],
      c: [false, false, false, false, false, false, false, false, false],
      d: [false, false, false, false, false, false, false, false],
      e: [false, false, false],
    },
    aplhabets_autobuyer: [false, false, false, false, false],
  };
}

function save(){
  localStorage.setItem("terraInfinitySave",btoa(JSON.stringify(game)));
}

function Export() {
  upd('outputExport',btoa(JSON.stringify(game)));
}

function Import() {
  let metasave = prompt('Paste your saved clipboard!');
  wipe();
  load(metasave);
  upd('outputExport','');
}
  
function load(x){
  if(typeof x == "string"){
    let load = JSON.parse(atob(x));
    let loadCounter;
    let loaded = {};
    for(loadCounter in load){
      //game[loadCounter] = load[loadCounter];
      //console.log(load[loadCounter]);
      //loaded[loadCounter] = load[loadCounter];
    }
    //console.log(loaded);
    for(let i in load.value){
      game.value[i] = ex(load.value[i]);
    }
    for(let i in load.alphabets_upgrades){
      for(let j = 0; j < load.alphabets_upgrades[i].length; j++){
        game.alphabets_upgrades[i][j] = load.alphabets_upgrades[i][j];
      }
    }
    for(let i = 0; i < load.show_alphabets.length; i++){
      game.show_alphabets[i] = load.show_alphabets[i];
    }
    for(let i in load.show_alphabets_upgrades){
      for(let j = 0; j < load.show_alphabets_upgrades[i].length; j++){
        game.show_alphabets_upgrades[i][j] = load.show_alphabets_upgrades[i][j];
      }
    }
    for(let i = 0; i < load.aplhabets_autobuyer.length; i++){
      game.aplhabets_autobuyer[i] = load.aplhabets_autobuyer[i];
    }
  } else {
    wipe();
  }
}
  
function loadGame(){
  load(localStorage.getItem("terraInfinitySave"));
}