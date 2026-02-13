addLayer("w", {
    name: "wind", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "W", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2,
    row: 0,
    startData() { return {
        unlocked: true,
        points: new ExpantaNum(0),
        potential: new ExpantaNum(0)
    }},
    color: "#888888",
    requires: new ExpantaNum(10), // Can be a function that takes requirement increases into account
    resource: "Wind", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {
        return player.points
    },
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5,
    gainMult() {
        mult = new ExpantaNum(1)
        return mult
    },
    gainExp() {
        return new ExpantaNum(1)
    },
    tabFormat: [
        "main-display",
        "prestige-button",
        ["upgrades", 1],
        ["display-text", function () { return hasUpgrade("w", 11) ? `You have ${format(player.w.potential)} potential.<br><span style="font-size: small">They are carried by the swooshing winds.<br>(${format(getPotentialGain())}/s)</span>` : "" }],
        ["raw-html", "<hr>"],
        ["display-text",function(){return hasUpgrade("H",11)?`The current wind speed is ${format(getWindSpeed())}km/h`:""}]
    ],
    row: 0,
    hotkeys: [
        {key: "w", description: "W: Reset for wind", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    upgrades: {
        11: {
            title: "Let there be something",
            cost: new ExpantaNum(1),
            description: "Unlocks potential."
        },
        12: {
            unlocked() {
                return hasUpgrade("w",11)
            },
            title: "Finding the power within",
            cost: new ExpantaNum(2),
            description: "Potential slightly boosts points.",
            effect() {
                return player.w.potential.add(1).log10().add(1).pow(2)
            },
            effectDisplay() {
                return `x${format(this.effect())}`
            }
        },
        13: {
            unlocked() {
                return hasUpgrade("w",12)
            },
            title: "Innocent thought",
            cost: new ExpantaNum(25),
            description: "Unlocks one new layer."
        },
        14: {
            unlocked() {
                return hasUpgrade("w",13)
            },
            title: "While one the other sides",
            cost() { return new ExpantaNum.arrow(2, 3,Math.sin(Date.now()/10000)/10+3.8) },
            description: "Unlocks something."
        }
    },
    layerShown() {
        return true
    }
})

addLayer("H", {
    name: "humidity", symbol: "H", position: 1, row: 0, branches: ["w"], resource: "humidity", color: "#6633aa", baseResource: "Wind",
    unlocked() {
        return hasUpgrade("w",13)
    },
    baseAmount() {
        return player.w.points
    },
    type: "normal",
    exponent: 0.5,
    requires: new ExpantaNum(10),
    startData() {
        return {
            unlocked: false,
            points: new ExpantaNum(0),
            droplets: new ExpantaNum(0),
            clouds: new ExpantaNum(0),
        }
    },
    tabFormat: [
        "main-display", "prestige-button", ["upgrades", 1], ["raw-html", "<hr>"],
        ["display-text", function () { return hasUpgrade("H", 12) ? `You have ${format(player.H.clouds)} clouds.<br><span style="font-size: 15px">They form and dissipate randomly. Currently: ${cloud_x()==1?"Forming":"Dissipating"}</span>` : "" }]
    ],
    onPrestige() {
        player.w.points = new ExpantaNum(0)
    },
    upgrades: {
        11: {
            title: "Let there be water!",
            description: "The absense of water gives way to diffusion. Unlocks wind speed, and it boosts potential.",
            cost: new ExpantaNum(0),
            unlocked() { return (player.H.total.gte(1)) },
            effect() {
                return new ExpantaNum(10).pow(getWindSpeed().add(1).log10().pow(2))
            },
            effectDisplay(){return `Currently: x${format(this.effect())}`}
        },
        12: {
            title: "Pondering thoughts",
            description: "Unlocks clouds.",
            cost: new ExpantaNum(5),
            unlocked(){return (player.H.total.gte(1))}
        },
        13: {
            title: "Diamond Blue",
            description: "Clouds boost points.",
            cost: new ExpantaNum(5),
            unlocked() { return (player.H.total.gte(1)) },
            effect() { return player.H.clouds.add(2).pow(0.5) },
            effectDisplay(){return `Currently: x${format(this.effect())}`}
        },
        14: {
            title: "Condensing marshmellows",
            description: "Clouds are boosted by water.",
            cost: new ExpantaNum(10),
            unlocked() { return (player.H.total.gte(1)) },
            effect() { return player.H.points.add(1).pow(0.25) },
            effectDisplay(){return `Currently: x${format(this.effect())}`}
        }
    }
})