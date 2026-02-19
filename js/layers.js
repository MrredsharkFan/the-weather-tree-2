


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
        ["upgrades", 12],
        ["display-text", function () { return hasUpgrade("w", 11) ? `You have ${format(player.w.potential)} potential.<br><span style="font-size: small">They are carried by the swooshing winds.<br>(${format(getPotentialGain())}/s)</span>` : "" }],
        ["raw-html", "<hr>"],
        ["display-text",function(){return hasUpgrade("H",11)?`The current wind speed is ${format(getWindSpeed())}km/h<br><span style="font-size: small">Equals to ${format(getWindSpeed().div(0.836).div(3.6).pow(2/3))} on the beaufort scale (based on equation given on wiki)</span>`:""}]
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
                e = player.w.potential.add(1).log10().add(1).pow(2)
                if (hasUpgrade("w",21)){e = e.pow(1.5)}
                return e
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
            cost: new OmegaNum(5555),
            description: "Unlocks another layer."
        },
        21: {
            unlocked() {
                return hasUpgrade("w",13)
            },
            title: "Neat boost",
            cost: new ExpantaNum(222),
            description: "U12 is boosted ^1.5"
        }
    },
    layerShown() {
        return true
    }
})

addLayer("H", {
    name: "humidity", symbol: "H", position: 1, row: 0, branches: ["w"], resource: "humidity", color: "#6633aa", baseResource: "Wind",
    unlocked() {
        return hasUpgrade("w", 13)
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
            rain: new ExpantaNum(0)
        }
    },
    gainMult() {
        e = new OmegaNum(1)
        if (hasUpgrade("H", 22)) { e = e.times(3) }
        return e
    },
    tabFormat: [
        "main-display", "prestige-button", ["upgrades", 12], ["raw-html", "<hr>"],
        ["display-text", function () { return hasUpgrade("H", 12) ? `You have ${format(player.H.clouds)} clouds.<br><span style="font-size: 15px">They form and dissipate randomly. Currently: ${cloud_x() == 1 ? "Forming" : "Dissipating"}</span>` : "" }],
        ["raw-html", "<br><hr><br>"],
        ["display-text", function () { return hasUpgrade("H", 21) ? `${format(player.H.rain)}mm of rain has fallen to the ground.<br><span style="font-size: 15px">Current rain rate: ${format(rainGain())}mm/h [Requires 10 clouds]</span>` : `` }]
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
                e = new ExpantaNum(10).pow(getWindSpeed().add(1).log10().pow(2))
                if (hasUpgrade("H", 32)) {
                    e = e.tetrate(1.5)
                }
                return e
            },
            effectDisplay() { return `Currently: x${format(this.effect())}` }
        },
        12: {
            title: "Pondering thoughts",
            description: "Unlocks clouds.",
            cost: new ExpantaNum(5),
            unlocked() { return (player.H.total.gte(1)) }
        },
        13: {
            title: "Diamond Blue",
            description: "Clouds boost points.",
            cost: new ExpantaNum(5),
            unlocked() { return (player.H.total.gte(1)) },
            effect() { return player.H.clouds.add(2).pow(0.5) },
            effectDisplay() { return `Currently: x${format(this.effect())}` }
        },
        14: {
            title: "Condensing marshmellows",
            description: "Clouds are boosted by water.",
            cost: new ExpantaNum(10),
            unlocked() { return (player.H.total.gte(1)) },
            effect() { return player.H.points.add(1).pow(0.25) },
            effectDisplay() { return `Currently: x${format(this.effect())}` }
        },
        21: {
            title: "Coverage",
            description: "Unlocks rain.",
            cost: new ExpantaNum(20),
            unlocked() { return (player.H.total.gte(1)) }
        },
        22: {
            fullDisplay() { return `<h3>Let those <i>droplets</i> point at the...</h3><br>Rain boosts points. Also, x3 humidity gain.<br><br>Cost: 0.5mm of rain.<br>Currently: x${format(this.effect())}` },
            canAfford() { return player.H.rain.gte(0.5) },
            pay() { player.H.rain = player.H.rain.sub(0.5) },
            effect() { return player.H.rain.times(10).add(1).pow(0.7) }
        },
        23: {
            fullDisplay() {return `<h3>Depress and Impress</h3><br>Rain boosts wind speed.<br><br>Cost: 1mm of rain.<br>Currently: +${format(this.effect())}km/h`},
            canAfford() { return player.H.rain.gte(1) },
            pay() { player.H.rain = player.H.rain.sub(1) },
            effect() { return player.H.rain.times(10).add(1).slog().times(2) }
        },
        31: {
            title: "Volatile evaporation",
            description: "Clouds evaporation/dissipation cycles 2x quicker, and cloud gain x2.",
            unlocked() { return hasUpgrade("H", 21) },
            cost: new ExpantaNum(100)
        },
        32: {
            title: "Better carrier",
            description: "<b>Let there be water!</b> is much stronger. (^^1.5)",
            unlocked() { return hasUpgrade("H", 21) },
            cost: new ExpantaNum(200)
        }
    }
})