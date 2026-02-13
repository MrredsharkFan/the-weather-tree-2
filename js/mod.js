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
	if (hasUpgrade("H",13)){gain = gain.times(upgradeEffect("H",13))}
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return false
}



// Less important things beyond this point!

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
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
	if (hasUpgrade("H",14)){g = g.times(upgradeEffect("H",14))}
	return g
}

function cloud_x() {
	return Math.sign(pesudo_random(Math.floor(Date.now()/5000)*3.2439184)-0.5)
}