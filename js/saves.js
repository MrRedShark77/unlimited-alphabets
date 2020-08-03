function upd(x,y){document.getElementById(x).innerHTML = y};
function E(x){return new ExpantaNum(x)};

var n_mode = ['Scientific', 'Logarithm', 'Alphabet']
var singPower = E(1)

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
      f: E(0),
    },
    alphabets_upgrades: {
      a: [false, false, false, false, false, false, false, false, false, false],
      b: [false, false, false, false, false, false, false, false, false, false],
      c: [false, false, false, false, false, false, false, false, false],
      d: [false, false, false, false, false, false, false, false],
      e: [false, false, false, false, false, false, false],
      f: [false],
    },
    show_alphabets: [true, false, false, false, false, false],
    show_alphabets_upgrades: {
      a: [true, false, false, false, false, false, false, false, false, false],
      b: [false, false, false, false, false, false, false, false, false, false],
      c: [false, false, false, false, false, false, false, false, false],
      d: [false, false, false, false, false, false, false, false],
      e: [false, false, false, false, false, false, false],
      f: [false],
    },
    aplhabets_autobuyer: [false, false, false, false, false, false],
    notation: 0,
    singPower: E(0),
    sing_upgrades: [0],
  };
}

var alphabets_upgrades_cost = {
  a: [E(0), E(15), E(100), E('2.5e3'), E('3e6'), E('5e8'), E('1e12'), E('1e16'), E('1.5e22'), E('1e30')],
  b: [E(1), E(15), E(300), E(3500), E('1.5e6'), E('2.5e7'), E('5e8'), E('2e11'), E('1e15'), E('1e33')],
  c: [E(1), E(15), E(100), E('1e3'), E('7.5e3'), E('2e4'), E('2.5e5'), E('1.5e9'), E('2.5e13')],
  d: [E(1), E(15), E(65), E(225), E('1.5e3'), E('2.5e4'), E('3e5'), E('1.5e6')],
  e: [E(1), E(15), E(50), E(250), E('1.5e3'), E('5e3'), E('1e5')],
  f: [E(1)],
}

var sing_max_upgrades = [Infinity];

var sing_upgrades_cost = [[E(1000),E(10)]];

function ChangeNotation(){
  if (game.notation > n_mode.length-2) game.notation = 0
  else game.notation++
}

function notate(ex,acc){
  switch (game.notation) {
    case 0:
      if(E(ex).lt("e10")){
          return (Math.round(E(ex).toNumber()*10**acc)/10**acc).toLocaleString();
      } else if(E(ex).lt("ee10")) {
          return (10**(E(ex).log10().toNumber()%1)).toFixed(2) + "e" + notate(Math.floor(E(ex).log10().toNumber()),0);
      } else {
          return "e" + notate(E(ex).log10(),0);
      }
      break;
    case 1:
      return (ex.gt(0)) ? '10<sup>' + ex.log10().toFixed(3) : 0
      break;
    case 2:
      alp = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      if (ex.log10().gte(78)) return 'Z'+notate(ex.log10().div(3).floor(),0)
      return alp[(ex.gte(1))?ex.log10().div(3).floor():0] + '<sub>' + ((ex.gte(1)) ? ex.div(E(1e3).pow(ex.log10().div(3).floor())).floor() : 0)
      break;
  }
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
    if (load.singPower == undefined) game.singPower = E(1)
    else game.singPower = ex(load.singPower);
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
    for(let i = 0; i < load.aplhabets_autobuyer.length; i++){
      game.aplhabets_autobuyer[i] = load.aplhabets_autobuyer[i];
    }
    if (load.notation == undefined) game.notation = 0
    else game.notation = load.notation;
    if (load.sing_upgrades == undefined) game.sing_upgrades = [0]
    else for (let i = 0; i < load.sing_upgrades.length; i++){
      game.sing_upgrades[i] = load.sing_upgrades[i]
    }
  } else {
    wipe();
  }
}
  
function loadGame(){
  load(localStorage.getItem("terraInfinitySave"));
}