


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
        if (hasUpgrade("T", 11)) { mult = mult.times(3) }
        if (hasUpgrade("T", 14)) { mult = mult.times(upgradeEffect("T",14)) }
        return mult
    },
    gainExp() {
        return new ExpantaNum(1)
    },
    passiveGeneration() {
        return player.w.total.gte(1e9)?1:0
    },
    tabFormat: [
        ["display-text", function () { return player.H.total.gte(1) ? `Reach ${format(player.w.total.min(1e9))}/1,000,000,000 total wind for 100% of potential wind/s.` : "" }],
        "main-display",
        "prestige-button",
        ["upgrades", 12],
        ["display-text", function () { return hasUpgrade("w", 11) ? `You have ${format(player.w.potential)} potential.<br>(${format(getPotentialGain())}/s)` : "" }],
        ["raw-html", "<hr>"],
        ["display-text",function(){return hasUpgrade("H",11)?`The current wind speed is ${format(getWindSpeed(),5)}km/h<br><span style="font-size: small">Equals to ${format(getWindSpeed().div(0.836).div(3.6).pow(2/3))} on the beaufort scale (based on equation given on wiki)</span>`:""}]
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
                if (hasUpgrade("w", 21)) { e = e.pow(1.5) }
                if (hasUpgrade("w", 31)) { e = e.tetrate(1.01) }
                if (hasUpgrade("w", 32)) { e = e.tetrate(1.01) }
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
        },
        22: {
            unlocked() {
                return hasUpgrade("w", 13)
            },
            title: "<i>Point to direction of the blow</i>",
            cost: new ExpantaNum(55555),
            description: "Wind boosts points.",
            effect() {
                return player.w.points.div(100000).add(1).log().add(1).pow(2)
            },
            effectDisplay() {
                return `x${format(this.effect())}`
            }
        },
        23: {
            unlocked() {
                return hasUpgrade("w", 22)
            },
            title: "Synergy Synergy!!!",
            cost: new ExpantaNum(1000000),
            description: "Potential boosts wind.",
            effect() {
                return player.w.potential.add(10).slog().pow(0.75).sub(1)
            },
            effectDisplay() {
                return `+${format(this.effect())}km/h`
            }
        },
        24: {
            unlocked() {
                return hasUpgrade("w", 23)
            },
            title: "Gradient divergence",
            cost: new ExpantaNum(1e8),
            description: "Wind amplifies the temperature changes.",
            effect() {
                c = player.w.points.add(100).slog().pow(2).div(10).add(1)
                if(hasUpgrade("T",22)){c = c.times(upgradeEffect("T",22))}
                return c
            },
            effectDisplay() {
                return `*${format(this.effect())}`
            }
        },
        31: {
            unlocked() {
                return hasUpgrade("w", 24)
            },
            title: "Point dynamics",
            cost: new ExpantaNum(3e9),
            description: "<b>Finding the power within</b> effect ^^1.01"
        },
        32: {
            unlocked() {
                return hasUpgrade("w", 31)
            },
            title: "Point dynamics II",
            cost: new ExpantaNum(2e11),
            description: "<b>Finding the power within</b> effect ^^1.01, again."
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
            rain: new ExpantaNum(0),
            fert: new ExpantaNum(0)
        }
    },
    gainMult() {
        e = new OmegaNum(1)
        if (hasUpgrade("H", 22)) { e = e.times(3) }
        return e
    },
    tabFormat: {
        "Main": {
            content: [
                "main-display", "prestige-button", ["upgrades", "1234"], ["raw-html", "<hr>"],
                ["display-text", function () { return hasUpgrade("H", 12) ? `You have ${format(player.H.clouds)} clouds.<br><span style="font-size: 15px">They form and dissipate randomly. Currently: ${cloud_x() == 1 ? "Forming" : "Dissipating"}</span>(${format(cloudGain())}/s)` : "" }],
                ["raw-html", "<br><hr><br>"],
                ["display-text", function () { return hasUpgrade("H", 21) ? `${format(player.H.rain)}mm of rain has fallen to the ground.<br><span style="font-size: 15px">Current rain rate: ${format(rainGain())}mm/h [Requires 10 clouds]</span>` : `` }]
            ]
        },
        "Fertilizers": {
            unlocked() { return hasUpgrade("H", 35) },
            content: [
                "main-display", "prestige-button",
                ["display-text", function () { return `Your best fertilizer has quality of ${format(player.H.fert)}, enhancing rain rate by *${format(fertEffect(player.H.fert))}` }],
                ["display-text",function(){return `Chance for improvement: 1/${format(new OmegaNum(10).pow(player.H.fert.div(baseQual(player.H.points)).sub(1)))}`}],
                ["clickables", "1"],
                ["display-text",`<span id="fert">Click the button above to buy fertilizers!</span>`],
                ["upgrades", "5"]
            ]
        }
    },
    onPrestige() {
        player.w.points = new ExpantaNum(0)
    },
    upgrades: {
        11: {
            title: "Let there be water!",
            description: "Unlocks wind speed which boosts potential. Also, humidity boosts wind speed.<br>",
            cost: new ExpantaNum(0),
            unlocked() { return (player.H.total.gte(1)) },
            effect() {
                e = new ExpantaNum(10).pow(getWindSpeed().add(1).log10().pow(2))
                if (hasUpgrade("H", 32)) {
                    e = e.tetrate(1.5)
                }
                if (hasUpgrade("H", 33)) {
                e = e.tetrate(1.125)
              }
                return e
            },
            effectDisplay() { return `[1st effect] x${format(this.effect())}` }
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
        15: {
            title: "Unhinged associations",
            description: "Rain rate boosts wind speed.",
            cost: new ExpantaNum(5e6),
            unlocked() { return (player.H.total.gte(1e6)) },
            effect() { return rainGain().add(1).log10().pow(0.75) },
            effectDisplay() { return `Currently: +${format(this.effect())}km/h` }
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
            fullDisplay() {return `<h3>Depress and Impress</h3><br>Rain accumlation boosts wind speed.<br><br>Cost: 1mm of rain.<br>Currently: +${format(this.effect())}km/h`},
            canAfford() { return player.H.rain.gte(1) },
            pay() { player.H.rain = player.H.rain.sub(1) },
            effect() { return player.H.rain.times(10).add(1).slog().times(2) }
        },
        24: {
            fullDisplay() { return `<h3>Free showers</h3><br>Wind speed boosts rain rate.<br><br>Cost: 10mm of rain.<br>Currently: *${format(this.effect())}` },
            canAfford() { return player.H.rain.gte(10) },
            pay() { player.H.rain = player.H.rain.sub(10) },
            effect() { return getWindSpeed().sub(6).max(1).pow(0.8) }
        },
        25: {
            fullDisplay() { return `<h3>Conducive loss</h3><br>Rain rate boosts coldness gain.<br><br>Cost: 50mm of rain.<br>Currently: *${format(this.effect())}` },
            canAfford() { return player.H.rain.gte(50) },
            pay() { player.H.rain = player.H.rain.sub(50) },
            effect() { return rainGain().add(1).pow(2) }
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
        },
        33: {
            title: "Better<sup>2</sup> carrier",
            description: "<b>Let there be water!</b> is much stronger. (^^1.125)",
            unlocked() { return hasUpgrade("H", 32) },
            cost: new ExpantaNum(800)
        },
        34: {
            title: "Soakingly cold",
            description: "Humidity boosts coldness gain.",
            unlocked() { return hasUpgrade("H", 32) },
            cost: new ExpantaNum(25000),
            effect() { return player.H.points.div(10000).add(1).log().pow(3) },
            effectDisplay() { return `x${format(this.effect())}` }
        },
        35: {
            title: "Try <i>to do</i> sth?<br>try <i>doing</i> sth?",
            description: "Unlocks cloud fertilizers.",
            unlocked() { return hasUpgrade("H", 34) },
            cost: new ExpantaNum(1e6)
        },
        41: {
            title: "Intermediate evaporatn't",
            description: "Tony: I deal with this too. Surprise!<hr>Humiditity boosts rain rate, up to a maximum of 2x.",
            unlocked() { return hasUpgrade("H", 35) },
            cost: new ExpantaNum(1e9),
            effect() { return player.H.points.div(3e9).add(1).log10().add(1).log10().add(1).pow(-1).times(-1).add(2).max(1) },
            effectDisplay(){return `x${format(this.effect())}`}
        },
        42: {
            title: "The un-vice versa part",
            description: "Tony: Yeah this needs a BIT of balancing...<hr><b>From asymmetry to symmetry, and vice versa</b> effect ^2.",
            unlocked() { return hasUpgrade("H", 34) },
            cost: new ExpantaNum(1e10)
        }
    },
    clickables: {
        11: {
            display() { return `Trade ${format(player.H.points)} humidity into a fertilizer<br>Base quality: ${format(baseQual(player.H.points))}` },
            canClick() { return player.H.points.gte(1) },
            onClick() {
                c = baseQual(player.H.points)
                c = c.times(1+Math.log10(1/Math.random()))
                if (c.gte(player.H.fert)) {
                    player.H.fert = c
                }
                player.H.points = new OmegaNum(0)
                document.getElementById("fert").innerHTML = `You got a fertilizer with quality ${format(c)}` //I got this in 0.01s!!!!
            }
        }
    }
})



addLayer("T", {
    name: "Temperature", symbol: "T", position: 3, row: 0, branches: ["w"], resource: "temperature",
    color() { return Date.now() % 2000 > 1000 ? "#884400" : "#4444aa" },
    baseResource: "Wind",
    unlocked() {
        return hasUpgrade("w", 14)
    },
    baseAmount() {
        return player.w.points
    },
    type: "normal",
    exponent: 0.25,
    requires: new ExpantaNum(1000),
    startData() {
        return {
            unlocked: false,
            points: new ExpantaNum(0),
            heat: new ExpantaNum(0),
            cold: new ExpantaNum(0)
        }
    },
    tabFormat: [
        "main-display",
        "prestige-button",
        ["clickables", 1],
        ["raw-html", "<br><hr><br>"],
        ["upgrades","123"],
        ["raw-html","<hr>"],
        ["display-text", function () { return `Your <b>${format(player.T.heat)}</b> heat &rarr; ${format(getTempVariance(player.T.heat).add(25))} degrees.<br>Your <b>${format(player.T.cold)}</b> cold &rarr; ${format(getTempVariance(player.T.cold).times(-1).add(25))} degrees.` }],
        ["display-text", function(){return `This generates an extra wind of +${format(tempWind())}km/h.`}]
    ],
    onPrestige() {
        player.w.points = new ExpantaNum(0)
    },
    clickables: {
        11: {
            display: "Translate all your temperature into heat.",
            onClick() {
                x = player.T.points
                if (hasUpgrade("T", 21)) { x = x.times(upgradeEffect("T", 21)) }
                if (hasUpgrade("A", 12)) { x = x.times(upgradeEffect("A", 12)) }
                player.T.heat = player.T.heat.add(x)
                player.T.points = new ExpantaNum(0)
            },
            canClick(){return player.T.points.gte(1)}
        },
        12: {
            display: "Translate all your temperature into cold.",
            onClick() {
                x = player.T.points
                if (hasUpgrade("H", 25)) { x = x.times(upgradeEffect("H", 25)) }
                if (hasUpgrade("H",34)){x = x.times(upgradeEffect("H",34))}
                player.T.cold = player.T.cold.add(x)
                player.T.points = new ExpantaNum(0)
            },
            canClick() { return player.T.points.gte(1) }
        },
    },
    upgrades: {
        11: {
            title: "Let the dance begin",
            cost: new ExpantaNum(1),
            description: "x3 Wind."
        },
        12: {
            title: "And so does it condenses",
            cost: new ExpantaNum(4),
            description: "Coldness boosts cloud gain.",
            effect() { return player.T.cold.add(1).log().pow(1.5) },
            effectDisplay(){return `x${format(this.effect())}`}
        },
        13: {
            title: "Cloud collection",
            cost: new ExpantaNum(6),
            description: "Cloud dissipation speed /1.25"
        },
        14: {
            title: "Flamed winds",
            cost: new ExpantaNum(20),
            description: "Heat boosts wind gain.",
            effect() { return player.T.heat.add(1).log10().add(1).pow(2.125) },
            effectDisplay() { return `x${format(this.effect())}`}
        },
        15: {
            title: "Turbine collectors",
            cost: new ExpantaNum(50),
            description: "Wind speed decreases cloud dissipation speed.",
            effect() { return getWindSpeed().sub(8).max(0).add(1).pow(0.5) },
            effectDisplay() { return `/${format(this.effect())}` }
        },
        21: {
            title: "From asymmetry to symmetry, and vice versa",
            cost: new ExpantaNum(250),
            description: "Coldness boosts heat.",
            effect() {
                c = player.T.cold.div(10000).add(1).log10().add(1).pow(2)
                if (hasUpgrade("H",42)){c = c.pow(2)}
                return c
             },
            effectDisplay() { return `*${format(this.effect())}` }
        },
        22: {
            title: "Further separation",
            cost: new ExpantaNum(1250),
            description: "<b>Gradient divergence</b> is stronger based on temperature.",
            effect() { return player.T.points.div(100).add(1).slog().pow(2.25).div(10).add(1) },
            effectDisplay() { return `*${format(this.effect())}` }
        }
    }
})

addLayer("A", {
    name: "Awareness", symbol: "A", row: "side", position: 0,
    color: "#cc0055",
    baseResource: "points",
    resource: "Awareness",
    requires: new ExpantaNum(1),
    baseAmount() {
        return player.points
    },
    unlocked(){player.A.unlocked = player.T.unlocked},
    type: "none",
    startData() {
        return {
            unlocked: true,
            points: new ExpantaNum(0),
            money: new ExpantaNum(0)
        }
    },
    tabFormat: {
        "Main":
        {content: [
                "main-display",
                ["raw-html", "<hr>"],
                ["display-text", function () { return awarenessText() }],
                ["upgrades", 1]
            ]
        },
        "Money": {
            content: [
                "main-display",
                ["display-text", function () { return `You have ${format(player.A.money,4)}$<br>Gaining ${format(moneyGain(),4)}$/s.` }],
                ["upgrades","2"]
        ]}},
    upgrades: {
        11: {
            title: "Let us be known",
            cost: new OmegaNum(3),
            description: "Tony: Hey! There's something weird with the weather. <hr>Unlocks money."
        },
        12: {
            title: "(Not) Global warming?",
            cost: new OmegaNum(100),
            description: "Tony: Well, industries were a thing, weren't it?<hr>Awareness boosts heat gain.",
            effect() { return player.A.points.add(1).tetrate(1.01).div(10).sub(1) },
            effectDisplay(){return `x${format(this.effect())}`}
        },
        21: {
            fullDisplay() { return `<h3>Borrow a generator</h3><br>Tony: Well, since you're so into doing this...<hr>x1.5 rain rate.<br><br>Cost: 0.05$` },
            canAfford() { return player.A.money.gte(0.05) },
            pay(){player.A.money = player.A.money.sub(0.05)}
        },
        22: {
            fullDisplay() { return `<h3>Candy canes</h3><br>Dawn: Welcome to my shop! You can buy free energy, and then woosh~ All the wind there is!<br><i>I'm not from the game vivid/stasis! So does Tony!</i><hr>+3km/h wind speed.<br><br>Cost: 0.25$` },
            canAfford() { return player.A.money.gte(0.25) },
            pay() { player.A.money = player.A.money.sub(0.25) },
            style: {"height": "200px"}
        }
    }
})