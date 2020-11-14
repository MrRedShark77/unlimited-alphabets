var diff = 0;
var date = Date.now();
var alphabets = 'abcdefghijklmnopqrstuvwxyz'

var player;

const TABS = {
    tab: {
        name: ['Options', 'Statistics', 'Alphabets', 'Automator'],
        unl: [
            _=>{ return true },
            _=>{ return true },
            _=>{ return true },
            _=>{ return player.alphabets.c },
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
        reset_formula: (x, y)=>{ return E(25).pow(E(x).add(1).log10().div(3+Math.max((y**2+y)/2-1, 1)).sub(1)) },
        aps: _=>{
            if (!player.alphabets.a) return E(0)
            return E(UPGRADES.bought('a', 1)?1:0)
            .mul(UPGRADES.bought('a', 2)?5:1)
            .mul(UPGRADES.bought('a', 3)?10:1)
            .mul(UPGRADES.bought('a', 5)?UPGRADES.alps.a[5].cur():1)
            .mul(UPGRADES.bought('a', 9)?3:1)
            .mul(UPGRADES.bought('b', 1)?UPGRADES.alps.b[1].cur():1)
            .mul(UPGRADES.bought('b', 3)?10:1)
            .mul(UPGRADES.bought('b', 7)?5:1)
            .mul(UPGRADES.bought('c', 1)?3:1)
            .mul(UPGRADES.bought('c', 2)?UPGRADES.alps.c[2].cur():1)
            .mul(UPGRADES.bought('c', 3)?10:1)
            .mul(UPGRADES.bought('d', 1)?UPGRADES.alps.d[1].cur():1)
            .pow(UPGRADES.bought('a', 4)?2:1)
            .pow(UPGRADES.bought('b', 5)?1.2:1)
        },
        gps: (x)=>{
            if (!player.alphabets[FUNCTIONS.alphabet(x)]) return E(0)
            return FUNCTIONS.alps.gain[FUNCTIONS.alphabet(x-1)]().div(10)
        },
        gps_display: (x)=>{
            if (x == 1) return FUNCTIONS.alps.aps()
            return FUNCTIONS.alps.gps(x)
        },
        gain: {
            a: _=>{
                if (!player.alphabets.a) return E(0)
                return FUNCTIONS.alps.reset_formula(player.alphabets.a.resource,1)
                .mul(UPGRADES.bought('a', 7)?2:1)
                .mul(UPGRADES.bought('a', 8)?UPGRADES.alps.a[8].cur():1)
                .mul(UPGRADES.bought('b', 2)?2:1)
                .mul(UPGRADES.bought('b', 4)?UPGRADES.alps.b[4].cur():1)
                .mul(UPGRADES.bought('b', 7)?5:1)
                .mul(UPGRADES.bought('c', 1)?3:1)
                .mul(UPGRADES.bought('c', 2)?UPGRADES.alps.c[2].cur():1)
                .mul(UPGRADES.bought('c', 4)?UPGRADES.alps.c[4].cur():1)
                .mul(UPGRADES.bought('d', 1)?UPGRADES.alps.d[1].cur():1)
                .mul(UPGRADES.bought('d', 2)?UPGRADES.alps.d[2].cur():1)
                .pow(UPGRADES.bought('a', 6)?1.1:1)
                .pow(UPGRADES.bought('c', 6)?1.05:1)
                .floor()
            },
            b: _=>{
                if (!player.alphabets.b) return E(0)
                return FUNCTIONS.alps.reset_formula(player.alphabets.b.resource,2)
                .mul(UPGRADES.bought('a', 7)?2:1)
                .mul(UPGRADES.bought('a', 8)?UPGRADES.alps.a[8].cur():1)
                .mul(UPGRADES.bought('b', 6)?2:1)
                .mul(UPGRADES.bought('c', 5)?2:1)
                .mul(UPGRADES.bought('d', 1)?UPGRADES.alps.d[1].cur():1)
                .mul(UPGRADES.bought('d', 2)?UPGRADES.alps.d[2].cur():1)
                .pow(UPGRADES.bought('c', 6)?1.05:1)
                .floor()
            },
            c: _=>{
                if (!player.alphabets.c) return E(0)
                return FUNCTIONS.alps.reset_formula(player.alphabets.c.resource,3)
                .mul(UPGRADES.bought('a', 8)?UPGRADES.alps.a[8].cur():1)
                .mul(UPGRADES.bought('a', 9)?3:1)
                .mul(UPGRADES.bought('d', 1)?UPGRADES.alps.d[1].cur():1)
                .floor()
            }
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
    automators: {
        cost: [E('e15'),E(15000)],
        can: (x)=>{
            if (!player.alphabets[FUNCTIONS.alphabet(1+x+player.automators[x])]) return false
            return player.alphabets[FUNCTIONS.alphabet(1+x+player.automators[x])].resource.gte(FUNCTIONS.automators.cost[x])
        },
        buy: (x)=>{
            let cost = FUNCTIONS.automators.cost[x]
            if (FUNCTIONS.automators.can(x)) {
                player.alphabets[FUNCTIONS.alphabet(1+x+player.automators[x])].resource = player.alphabets[FUNCTIONS.alphabet(1+x+player.automators[x])].resource.sub(cost)
                player.automators[x]++
            }
        }
    },
}

const UPGRADES = {
    total: 4,
    alps: {
        a: {
            row: 9,
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
                    .pow(UPGRADES.bought('d', 3)?1.15:1)
                },
                curDesc: (x)=>{ return notate(x,2)+'x' },
            },
            6: {
                unl: _=>{ return UPGRADES.bought('a', 5) && player.alphabets.b },
                desc: "Raise b gain by 1.1.",
                cost: E(1e18),
            },
            7: {
                unl: _=>{ return UPGRADES.bought('a', 6) && player.alphabets.c },
                desc: "Gain 2x more b & c.",
                cost: E(1e30),
            },
            8: {
                unl: _=>{ return UPGRADES.bought('a', 7) },
                desc: "Gain more alphabets except a based on unspent a.",
                cost: E(1e45),
                cur: _=>{
                    if (!player.alphabets.a) return E(1)
                    return player.alphabets.a.resource.add(1).log10().add(1).log10().add(1)
                },
                curDesc: (x)=>{ return notate(x,2)+'x' },
            },
            9: {
                unl: _=>{ return UPGRADES.bought('a', 8) && player.alphabets.d },
                desc: "Gain 3x more a & d.",
                cost: E(1e75),
            },
        },
        b: {
            row: 7,
            1: {
                unl: _=>{ return true },
                desc: "Multiply a production based on unspent b.",
                cost: E(1),
                cur: _=>{
                    if (!player.alphabets.b) return E(1)
                    return player.alphabets.b.resource.add(1).pow(1/2)
                    .pow(UPGRADES.bought('d', 3)?1.15:1)
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
            4: {
                unl: _=>{ return UPGRADES.bought('b', 3) },
                desc: "Gain more b based on unspent a.",
                cost: E(25000),
                cur: _=>{
                    if (!player.alphabets.a) return E(1)
                    return player.alphabets.a.resource.add(1).log10().add(1).pow(1/2)
                },
                curDesc: (x)=>{ return notate(x,2)+'x' },
            },
            5: {
                unl: _=>{ return UPGRADES.bought('b', 4) },
                desc: "Raise a production by 1.2.",
                cost: E(5e7),
            },
            6: {
                unl: _=>{ return UPGRADES.bought('b', 5) && player.alphabets.c },
                desc: "Gain 2x more c.",
                cost: E(1e15),
            },
            7: {
                unl: _=>{ return UPGRADES.bought('b', 6) },
                desc: "Gain 5x more a & b.",
                cost: E(1e22),
            },
        },
        c: {
            row: 6,
            1: {
                unl: _=>{ return true },
                desc: "Gain 3x more a & b.",
                cost: E(1),
            },
            2: {
                unl: _=>{ return true },
                desc: "Gain more a & b based on unspent c.",
                cost: E(25),
                cur: _=>{
                    if (!player.alphabets.c) return E(1)
                    return player.alphabets.c.resource.add(1).pow(1/4)
                },
                curDesc: (x)=>{ return notate(x,2)+'x' },
            },
            3: {
                unl: _=>{ return UPGRADES.bought('c', 2) },
                desc: "Multiply a production by 10.",
                cost: E(300),
            },
            4: {
                unl: _=>{ return UPGRADES.bought('c', 2) },
                desc: "Gain more b based on unspent b.",
                cost: E(10000),
                cur: _=>{
                    if (!player.alphabets.b) return E(1)
                    return player.alphabets.b.resource.add(1).logBase(100).add(1)
                },
                curDesc: (x)=>{ return notate(x,2)+'x' },
            },
            5: {
                unl: _=>{ return UPGRADES.bought('c', 4) },
                desc: "Gain 2x c.",
                cost: E(125000),
            },
            6: {
                unl: _=>{ return UPGRADES.bought('c', 5) },
                desc: "Raise b & c gain by 1.05.",
                cost: E(1e15),
            },
        },
        d: {
            row: 3,
            1: {
                unl: _=>{ return true },
                desc: "Gain more previous alphabets based on unspent d.",
                cost: E(1),
                cur: _=>{
                    if (!player.alphabets.d) return E(1)
                    return player.alphabets.d.resource.add(1).pow(1/3)
                },
                curDesc: (x)=>{ return notate(x,2)+'x' },
            },
            2: {
                unl: _=>{ return true },
                desc: "Gain more b & c alphabets based on unspent a.",
                cost: E(50),
                cur: _=>{
                    if (!player.alphabets.a) return E(1)
                    return player.alphabets.a.resource.add(1).pow(1/10).add(1).log10().add(1)
                },
                curDesc: (x)=>{ return notate(x,2)+'x' },
            },
            3: {
                unl: _=>{ return UPGRADES.bought('d', 2) },
                desc: "Raise a upgrade 5 and b upgrade 2 effects by 1.15.",
                cost: E(3500),
            }
        },
    },
    buy: (alp, id)=>{
        let cost = UPGRADES.alps[alp][id].cost
        if (player.alphabets[alp]) if (player.alphabets[alp].resource.gte(cost) && !UPGRADES.bought(alp, id) && UPGRADES.alps[alp][id].unl()) {
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