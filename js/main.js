var diff = 0;
var date = Date.now();
var alphabets = 'abcdefghijklmnopqrstuvwxyz'

var player;

const TABS = {
    tab: {
        name: ['Options', 'Statistics', 'Alphabets'],
        unl: [
            _=>{ return true },
            _=>{ return true },
            _=>{ return true },
        ],
    },
}

const FUNCTIONS = {
    alphabet: (x) => {
        if (x > 26) {
            return FUNCTIONS.alphabet(Math.floor((x-1)/26)) + alphabets[x-26*Math.floor((x-1)/26)-1]
        }
        return alphabets[x-1]
    },
    alps: {
        reset_formula: (x)=>{ return E(25).pow(E(x).add(1).log10().div(4).sub(1)) },
        gps: {
            a: _=>{
                if (!player.alphabets.a) return E(0)
                return E(UPGRADES.bought('a', 1)?1:0)
                .mul(UPGRADES.bought('a', 2)?5:1)
                .mul(UPGRADES.bought('a', 3)?10:1)
                .mul(UPGRADES.bought('a', 5)?UPGRADES.alps.a[5].cur():1)
                .mul(UPGRADES.bought('b', 1)?UPGRADES.alps.b[1].cur():1)
                .mul(UPGRADES.bought('b', 3)?10:1)
                .pow(UPGRADES.bought('a', 4)?2:1)
            },
        },
        gain: {
            a: _=>{
                if (!player.alphabets.a) return E(0)
                return FUNCTIONS.alps.reset_formula(player.alphabets.a.resource)
                .mul(UPGRADES.bought('b', 2)?2:1)
                .floor()
            },
        },
        have: _=>{ return Object.keys(player.alphabets).length },
        add: _=>{
            player.alphabets[FUNCTIONS.alphabet(FUNCTIONS.alps.have()+1)] = {
                unlocked: false,
                resource: E(0),
                upgrades: [],
            }
        },
        reset: (x)=>{
            let gain = FUNCTIONS.alps.gain[FUNCTIONS.alphabet(x)]()
            if (gain.gte(1) && player.alphabets[FUNCTIONS.alphabet(x+1)]) {
                player.alphabets[FUNCTIONS.alphabet(x+1)].unlocked = true
                player.alphabets[FUNCTIONS.alphabet(x+1)].resource = player.alphabets[FUNCTIONS.alphabet(x+1)].resource.add(gain)
                for (let i = x; i > 0; i--) {
                    player.alphabets[FUNCTIONS.alphabet(i)].resource = E(0)
                    player.alphabets[FUNCTIONS.alphabet(i)].upgrades = []
                    if (i > 1) player.alphabets[FUNCTIONS.alphabet(i)].unlocked = false
                }
            }
        },
    },
}

const UPGRADES = {
    total: 2,
    alps: {
        a: {
            row: 5,
            1: {
                unl: _=>{ return true },
                desc: "Start to generate a.",
                cost: E(0),
            },
            2: {
                unl: _=>{ return UPGRADES.bought('a', 1) },
                desc: "Multiply a production by 5.",
                cost: E(15),
            },
            3: {
                unl: _=>{ return UPGRADES.bought('a', 1) },
                desc: "Multiply a production by 10.",
                cost: E(100),
            },
            4: {
                unl: _=>{ return UPGRADES.bought('a', 3) },
                desc: "Square a production.",
                cost: E(2000),
            },
            5: {
                unl: _=>{ return UPGRADES.bought('a', 4) },
                desc: "Multiply a production based on unspent a.",
                cost: E(1e7),
                cur: _=>{
                    if (!player.alphabets.a) return E(1)
                    return player.alphabets.a.resource.add(1).log10().add(1).pow(1.25)
                },
                curDesc: (x)=>{ return notate(x,2)+'x' },
            },
        },
        b: {
            row: 3,
            1: {
                unl: _=>{ return true },
                desc: "Multiply a production based on unspent b.",
                cost: E(1),
                cur: _=>{
                    if (!player.alphabets.b) return E(1)
                    return player.alphabets.b.resource.add(1).pow(1/2)
                },
                curDesc: (x)=>{ return notate(x,2)+'x' },
            },
            2: {
                unl: _=>{ return UPGRADES.bought('b', 1) },
                desc: "Gain 2x more b.",
                cost: E(15),
            },
            3: {
                unl: _=>{ return UPGRADES.bought('b', 1) },
                desc: "Multiply a production by 10.",
                cost: E(200),
            },
        },
    },
    buy: (alp, id)=>{
        let cost = UPGRADES.alps[alp][id].cost
        if (player.alphabets[alp]) if (player.alphabets[alp].resource.gte(cost) && !UPGRADES.bought(alp, id)) {
            player.alphabets[alp].resource = player.alphabets[alp].resource.sub(cost)
            player.alphabets[alp].upgrades.push(id)
        }
    },
    bought: (alp, id)=>{
        if (!player.alphabets[alp]) return false
        return player.alphabets[alp].upgrades.includes(id)
    }
}

function notate(ex, acc=3) {
    ex = E(ex)
    neg = ''
    if (ex.isneg(0)) {
        ex = ex.neg()
        neg = '-'
    }
    if (ex.isInfinite()) return 'Infinity'
    let e = ex.log10().floor()
    if (e.lt(9)) {
        if (e.lt(3)) {
            return neg+ex.toFixed(acc)
        }
        return neg+ex.floor().toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }
    let m = ex.div(E(10).pow(e))
    return neg+(e.log10().gte(9)?'':m.toFixed(3))+'e'+notate(e,0)
}

function loop(){
    diff = Date.now()-date;
    calc(diff);
    date = Date.now();
}

setInterval(loop, 50)