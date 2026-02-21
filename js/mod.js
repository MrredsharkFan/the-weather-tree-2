let modInfo = {
	name: "The Modding Tree",
	id: "twt2",
	author: "",
	pointsName: "points",
	discordName: "",
	discordLink: "",
	initialStartPoints: new ExpantaNum (10), // Used for hard resets and new players
	
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.0",
	name: "",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.0</h3><br>
		- Added things.<br>
		- Added stuff.`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new ExpantaNum(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new ExpantaNum(0)

	let gain = new ExpantaNum(1)
	if (hasUpgrade("w", 12)) { gain = gain.times(upgradeEffect("w", 12)) }
	if (hasUpgrade("H", 13)) { gain = gain.times(upgradeEffect("H", 13)) }
	if (hasUpgrade("H", 22)) { gain = gain.times(upgradeEffect("H", 22)) }
	if (hasUpgrade("w",22)){gain = gain.times(upgradeEffect("w",22))}
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
	`Offline progress is <span style="color: #ff0000">disabled</span>. Tick rate is ALWAYS set at 50ms.`
]

// Determines when the game "ends"
function isEndgame() {
	return false
}



// Less important things beyond this point!

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(0.05) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}

function pesudo_random(seed) {
	return (Math.tan(Math.sin(seed*10600)*12040)*7777)%1
}

//wind
function getWindSpeed() {
	b = player.w.points.add(1).slog().times(2)
	b = b.times(player.H.points.add(1).slog().times(0.5).add(1))
	if (hasUpgrade("H", 23)) { b = b.add(upgradeEffect("H", 23)) }
	if (player.T.total.gte(1)) { b = b.add(tempWind()) }
	if (hasUpgrade("w", 23)) { b = b.add(upgradeEffect("w", 23)) }
	if (hasUpgrade("H", 15)) { b = b.add(upgradeEffect("H", 15)) }
	if (hasUpgrade("A", 22)) { b = b.add(3) }
	return b
}

function getPotentialGain() {
	g = player.w.points
	if (hasUpgrade("H",11)){g=g.times(upgradeEffect("H",11))}
	return g
}

//water
function cloudGain() {
	g = new ExpantaNum(1)
	if (hasUpgrade("H", 14)) { g = g.times(upgradeEffect("H", 14)) }
	if (hasUpgrade("H", 31)) { g = g.times(2) }
	if (hasUpgrade("T", 12)) { g = g.times(upgradeEffect("T", 12)) }
	if (cloud_x() == -1) {
		if (hasUpgrade("T", 13)) { g = g.div(1.25) }
		if (hasUpgrade("T", 15)) { g = g.div(upgradeEffect("T", 15)) }
	}
	return g
}

function cloud_x() {
	period = hasUpgrade("H",31)?2500:5000
	return Math.sign(pesudo_random(Math.floor(Date.now()/period)*3.2439184)-0.5)
}

function rainGain() {
	e = player.H.clouds.slog().pow(0.5).sub(1).max(0)
	if (hasUpgrade("H", 24)) { e = e.times(upgradeEffect("H", 24)) }
	if (hasUpgrade("H", 35)) { e = e.times(fertEffect(player.H.fert)) }
	if (hasUpgrade("A", 21)) { e = e.times(1.5) }
	if (hasUpgrade("H", 41)) { e = e.times(upgradeEffect("H", 41)) }
	if (e.gte(30)) {
		e = e.div(30).add(1).slog().times(5).add(25)
	}
	return e
}

function baseQual(x) {
	t = x.div(100000).add(1).log10().add(1).pow(2)
	if (hasUpgrade("A",13)){t = t.times(upgradeEffect("A",13))}
	return t
}

function fertEffect(x) {
	return x.add(1).slog().pow(2).add(1)
}

//heat
function getTempVariance(val) {
	c = val.add(1).slog().add(1).log().add(1).pow(2).tetrate(1.625).sub(1).div(10)
	if (hasUpgrade("w",24)){c = c.times(upgradeEffect("w",24))}
	return c
}

function tempWind() {
	return getTempVariance(player.T.heat).add(getTempVariance(player.T.cold)).pow(0.75)
}

//awareness
function awarenessGain() {
	r = [rainGain().sub(10).div(2.5).max(0).add(1).tetrate(2).sub(1), getWindSpeed().sub(30).max(0).add(1).tetrate(1.8).sub(1), getTempVariance(player.T.heat).sub(8).max(0).add(1).tetrate(2).sub(1), getTempVariance(player.T.cold).sub(5).max(0).add(1).tetrate(1.9).sub(1)]
	return r.concat(r[0].add(1).times(r[1].add(1)).times(r[2].add(1)).times(r[3].add(1)))
}

function awarenessText() {
	l = awarenessGain()
	d = ""
	f = [format(rainGain()), format(getWindSpeed()), format(getTempVariance(player.T.heat).add(25)), format(getTempVariance(player.T.cold).times(-1).add(25))]
	for (i = 0; i < l.length-1; i++){
		d = d+ `${f[i]} ${["mm/h [starts at 10mm/h]", "km/h [starts at 30km/h]", "*C [starts at 33*C]", "*C [starts at 20*C]"][i]} -> ${format(l[i])} factor <span style="color:#dd00${i*11+55}">${i+1}</span><br>`
	}
	d = d+`<hr>This equates to an awareness of ${format(l[4])}`
	return d
}

function moneyGain() {
	t = awarenessGain()[4]
	t = t.add(100).pow(0.5).sub(10).div(100)
	if (t.gte(10)) { t = t.log10().pow(2).times(10).add(1) }
	if (hasUpgrade("A",24)){t = t.times(upgradeEffect("A",24))}
	return t
}

//money
function toolLevel(x, base) {
	base = new OmegaNum(base)
	k = [x.add(1).log10().div(base.log10())]
	k = k.concat(k[0].floor())
	k = k.concat(new OmegaNum.pow(base, k[1].add(1)))
	k = k.concat(x.div(k[2]).times(100))
	k = k.concat(x)
	return k
}

function heatToolText() {
	m = [toolLevel(player.T.heater, 4), toolLevel(player.T.cooler, 4)]
	return `You have heater level ${format(m[0][1])}, ${format(m[0][4])}/${format(m[0][2])}(${format(m[0][3])}%)$.<br>You have cooler level ${format(m[1][1])}, ${format(m[1][4])}/${format(m[1][2])}(${format(m[1][3])}%)$.`
}

function heatToolEffect() {
	m = [toolLevel(player.T.heater, 4), toolLevel(player.T.cooler, 4)]
	return [new ExpantaNum.pow(3,m[0][1].sub(1).pow(1.5)),new ExpantaNum.pow(3,m[1][1].sub(1).pow(1.5))]
}