


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
                if (e.gte(1e45)) {
                    e = e.div(1e35).log10().pow(45)
                }
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
            fert: new ExpantaNum(0),
            lightning: new ExpantaNum(0),
            level: new ExpantaNum(0),
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
                "main-display", "prestige-button", ["display-text", function () { return hasUpgrade("H", 12) ? `You have ${format(player.H.clouds)} clouds.<br><span style="font-size: 15px">They form and dissipate randomly. Currently: ${cloud_x() == 1 ? "Forming" : "Dissipating"}</span>(${format(cloudGain())}/s)` : "" }],
                ["raw-html", "<br><hr><br>"],
                ["display-text", function () { return hasUpgrade("H", 21) ? `${format(player.H.rain)}mm of rain has fallen to the ground.<br><span style="font-size: 15px">Current rain rate: ${format(rainGain())}mm/h (Requires 10 clouds)<br>A new feature will be unlocked at 30mm/h!</span>` : `` }]
            ,["upgrades", "1234"], ["raw-html", "<hr>"]]
        },
        "Fertilizers": {
            unlocked() { return hasUpgrade("H", 35) },
            content: [
                "main-display", "prestige-button",
                ["display-text", function () { return `Your best fertilizer has quality of ${format(player.H.fert)}, enhancing rain rate by *${format(fertEffect(player.H.fert))}` }],
                ["display-text",function(){return `Chance for improvement: 1/${format(new OmegaNum(10).pow(player.H.fert.div(baseQual(player.H.points)).sub(1)))}`}],
                ["clickables", "1"],
                ["display-text",`<span id="fert">Click the button above to buy fertilizers!</span>`],
            ]
        },
        "Lightning": {
            unlocked() { return rainGain().gte(30) },
            style: {"background-color":"#353500", "color":"#ffff55"},
            content: [
                "main-display", "prestige-button",
                ["display-text", function () { return `Your cluster of clouds are now generating lightning!<br>You have ${format(player.H.lightning)} lightning strikes. (1/${format(lightning_chance()*20)} to get ${format(lightning_gain())} per 50ms)` }],
                ["upgrades","5"]
            ]
        },
        "Flooding": {
            unlocked() { return hasUpgrade("H", 54) },
            style: {
                "background-color": "#000055",
                "color":"#aaaaff"
            },
            content: [
                "main-display", "prestige-button",
                ["display-text", function () { return `The water level is rising due to the rain!<br>Your current water level is ${format(player.H.level)}mm. (${format(floodGain())}/s)` }],
                ["upgrades",["7","70"]]
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
                    e = e.tetrate(1.5) //if someone were to ask, why? I'll answer: Don't fucking ask me
                }
                if (hasUpgrade("H", 43)) { e = e.pow(1.2) }
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
            effect() {
                e = rainGain().add(1).log10().pow(0.75)
                if (hasUpgrade("H",43)){e = e.times(1.5)}
                return e
             },
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
            effect() {
                e = player.H.points.div(10000).add(1).log().pow(3)
                if (hasUpgrade("H",74)){e = e.pow(8)}
                return e
             },
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
        },
        43: {
            title: "Darkened clouds",
            description: "Tony: Wait, did i hear some noise outside?<hr><b>Unhinged associations</b> effect x1.5.",
            unlocked() { return hasUpgrade("H", 34) },
            cost: new ExpantaNum(5e12)
        },
        44: {
            title: "Better<sup>3</sup> Carrier",
            description: "Saturday: Imagine trying to tetrate it further without NaNs or the most stupid softcaps<hr><b>Let there be water!</b> effect ^2 before <b>Better<sup>1.2</sup> Carrier</b>.",
            unlocked() { return hasUpgrade("H", 43) },
            cost: new ExpantaNum(2e15)
        },
        51: {
            fullDisplay() { return `<h3>I see light, thus I shall blow</h3><br>Tony: I think those strikes can power my own fans!<hr>Lightning strikes boost wind speed, very slightly.<br><br>Cost: 1 lightning strike<br>Currently: +${format(this.effect())}km/h` },
            canAfford() { return player.H.lightning.gte(1) },
            pay() { player.H.lightning = player.H.lightning.sub(1) },
            effect(){return player.H.lightning.add(1).slog().pow(2)}
        },
        52: {
            fullDisplay() { return `<h3>Untitled</h3><br>Tony: It feels like a title isn't needed anymore.<hr>Saturday: No I think it's needed<hr>Humidity boosts lightning strike gain.<br><br>Cost: 2 lightning strikes<br>Currently: x${format(this.effect())}` },
            canAfford() { return player.H.lightning.gte(2) },
            pay() { player.H.lightning = player.H.lightning.sub(2) },
            effect() {
                c = player.H.points.div(1e13).add(1).pow(0.25)
                if (c.gte(1000)){c = c.div(100).log10().times(10).pow(2).times(10)}
                return c
            }            
        },
        53: {
            fullDisplay() { return `<h3>Rapid deterioration</h3><br>Dawn: The water level is rising in my store? Maybe I shouldn't care right now.<hr>Lightning strikes boost itself.<br><br>Cost: 10 lightning strikes<br>Currently: x${format(this.effect())}` },
            canAfford() { return player.H.lightning.gte(10) },
            pay() { player.H.lightning = player.H.lightning.sub(10) },
            effect() { return player.H.lightning.add(1).log10().add(1).pow(1.25) }
        },
        54: {
            fullDisplay() { return `<h3>Rapid deterioration II</h3><br>Dawn: Okay I should now care about that...<hr>Saturday: But can you give me 30k?<hr>Unlocks <b>Water Level</b><br><br>Cost: 30,000 lightning strikes` },
            canAfford() { return player.H.lightning.gte(30000) },
            pay() { player.H.lightning = player.H.lightning.sub(30000) },
        },
        71: {
            fullDisplay() { return `Dawn: Let's make water turbines!!!!<hr>Wind is boosted slightly by water level.<br><br>Cost: 30mm water level<br>Currently: +${format(this.effect())}km/h` },
            canAfford() { return player.H.level.gte(30) },
            pay() { player.H.level = player.H.level.sub(30) },
            effect() { return player.H.level.div(100).add(1).log10() }
        },
        72: {
            fullDisplay() { return `Dawn: I shall be slightly evil, and make timewalls. Have the water flow in... Gradually...<hr>Saturday: Stop to do that! Wait...<hr>Coldness is boosted by water level.<br><br>Cost: 45mm water level<br>Currently: x${format(this.effect())}` },
            canAfford() { return player.H.level.gte(45) },
            pay() { player.H.level = player.H.level.sub(45) },
            effect() { return player.H.level.tetrate(2).pow(0.34) }
        },
        73: {
            fullDisplay() { return `Dawn: Show em no mercy. Let the power lines fall.<hr>Lightning is boosted by water level.<br><br>Cost: 52mm water level<br>Currently: x${format(this.effect())}` },
            canAfford() { return player.H.level.gte(52) },
            pay() { player.H.level = player.H.level.sub(52) },
            effect() { return player.H.level.max(60).div(50).add(1).tetrate(1.025) }
        },
        74: {
            fullDisplay() { return `Tony: Let me try and clear this mess.<hr>Dawn: I won't let you :3c and I will open my freezer door<hr><b>Soakingly Cold</b> effect ^8.<br><br>Cost: 80mm water level` },
            canAfford() { return player.H.level.gte(80) },
            pay() { player.H.level = player.H.level.sub(80) },
        },
        701: {
            fullDisplay() { return `Tony: Wait, then where are the tornadoes<hr>Dawn: We are not doing tornadoes, silly. Now, just enjoy the view outside.<hr>Base fertilizer quaity x2.<br><br>Cost: 90mm water level` },
            canAfford() { return player.H.level.gte(90) },
            pay() { player.H.level = player.H.level.sub(90) },
        },
        702: {
            fullDisplay() { return `Tony: Can't we just do an upgrade that boosts points again?<hr>Dawn: Not without my help!<hr>Water level boosts points.<br><br>Cost: 120mm water level<br>Currently: x${format(this.effect())}` },
            canAfford() { return player.H.level.gte(120) },
            pay() { player.H.level = player.H.level.sub(120) },
            effect(){return player.H.level.add(1).tetrate(1.4)}
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
            cold: new ExpantaNum(0),
            heater: new ExpantaNum(0),
            cooler: new ExpantaNum(0),
        }
    },
    tabFormat: {
        "Main": {
            content:[
            "main-display",
            "prestige-button",
                ["clickables", 1], 
                ["display-text", function () { return `Your <b>${format(player.T.heat)}</b> heat &rarr; ${format(getTempVariance(player.T.heat).add(25))} degrees.<br>Your <b>${format(player.T.cold)}</b> cold &rarr; ${format(getTempVariance(player.T.cold).times(-1).add(25))} degrees.` }],
                ["display-text", function () { return `This generates an extra wind of +${format(tempWind())}km/h.` }],
            ["raw-html", "<br><hr><br>"],
            ["upgrades", "123"],
            ["raw-html", "<hr>"]
            ]
        },
        "Tools": {
            unlocked() { return hasUpgrade("A", 23) },
            content: [
                "main-display",
                "prestige-button",
                ["display-text", function () { return `<hr>You have ${format(player.A.money)}$.<hr>${heatToolText()}` }],
                ["display-text", function () { return `<hr>x${format(heatToolEffect()[0])} heat<br>x${format(heatToolEffect()[1])} cold` }],
                ["clickables", "2"],
                ["raw-html", "<br><hr>"]            ]
        }
},
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
                if (hasUpgrade("A", 23)) { x = x.times(heatToolEffect()[0]) }
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
                if (hasUpgrade("H", 34)) { x = x.times(upgradeEffect("H", 34)) }
                if (hasUpgrade("A", 22)) { x = x.times(heatToolEffect()[1]) }
                if (hasUpgrade("A", 25)) { x = x.times(upgradeEffect("A", 25)) }
                if (hasUpgrade("H", 72)) { x = x.times(upgradeEffect("H", 72)) }
                player.T.cold = player.T.cold.add(x)
                player.T.points = new ExpantaNum(0)
            },
            canClick() { return player.T.points.gte(1) }
        },
        21: {
            display: "Invest all your money into heating!",
            onClick() {
                x = player.A.money
                player.T.heater = player.T.heater.add(x)
                player.A.money = new ExpantaNum(0)
            },
            canClick() { return player.T.points.gte(1) }
        },
        22: {
            display: "Invest all your money into cooling!",
            onClick() {
                x = player.A.money
                player.T.cooler = player.T.cooler.add(x)
                player.A.money = new ExpantaNum(0)
            },
            canClick() { return player.T.points.gte(1) }
        }
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
        13: {
            title: "Research",
            cost: new OmegaNum(1e9),
            description: "Tony: Let's do some... Non-standard research... On how to make more rain!<hr>Awareness improves the base quality for fertilizers.",
            effect() { return player.A.points.div(1e9).add(1).log10().add(1).pow(0.875) },
            effectDisplay() { return `*${format(this.effect())}` }
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
        },
        23: {
            fullDisplay() { return `<h3>Heater/Cooler</h3><br>Dawn: Well... We do sell everything here. Notice why my room is always covered in ic-<hr>Unlock Air conditioners/Heaters.<br><br>Cost: 500$` },
            canAfford() { return player.A.money.gte(500) },
            pay() { player.A.money = player.A.money.sub(500) },
        },
        24: {
            fullDisplay() { return `<h3>Influencer</h3><br>Saturday: Hi? Dawn's occupied today. I'm the replacement shopkeeper. Want to get a mic for streaming rain ASMR videos?<hr>Rain boosts money. (Post-softcap)<br><br>Cost: 2,000$<hr>Currently: x${format(this.effect())}` },
            canAfford() { return player.A.money.gte(2000) },
            pay() { player.A.money = player.A.money.sub(2000) },
            effect(){return rainGain().sub(19).max(1).tetrate(1.05)}
        },
        25: {
            fullDisplay() { return `Tony: It's heard that <i>Indifference</i> comes from money, right?<hr>Money boosts coldness gain.<br><br>Cost: 1,000,000$<hr>Currently: x${format(this.effect())}` },
            canAfford() { return player.A.money.gte(1000000) },
            pay() { player.A.money = player.A.money.sub(1000000) },
            effect() { return player.A.money.div(10000).add(1).tetrate(1.125) }
        }
    }
})