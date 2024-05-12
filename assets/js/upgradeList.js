// upgradeList.js
// Holds the upgrade schema, as well as definitions of all of the game's upgrades
// Includes the upgrades' effects as callbacks

"use strict";

class Upgrade {
	constructor(params = {}) {
		this.name = params?.name; // Primary text, shown as header
		this.description = params?.description; // Secondary text, shown as paragraph
		this.type = params?.type; // "craft" or "research"
		this.cost = params?.cost; // An object with at least one of the keys "wood", "food", "stone"
		this.duration = params?.duration; // Time it takes for the upgrade to complete (in seconds)
		this.once = params?.once; // True if upgrade should disappear once bought
		this.scaling = params.scaling; // Optional if once=true. If once=false, cost is multiplied by this amount every completion
		this.requirement = params?.requirement; // Optional, array of Game.levels fields and their minimum values for the upgrade to show up
		this.effect = params?.effect; // Function to run on buy
	}
}

Game.prototype.upgradeList = [
	// Major system progression upgrades
	new Upgrade({
		name: "Build a tent",
		description: "Has space for two villagers.",
		type: "craft",
		cost: {
			wood: 10,
			food: 10,
		},
		duration: 2,
		once: true,
		effect: function (game) {
			game.levels.tent += 1;
			game.lumberjack += 2;
			game.unlock("assign");
			game.unlock("income");
			game.logMessage(
				"event",
				"Two villagers have joined your settlement."
			);
		},
	}),
	new Upgrade({
		name: "Expand the tent",
		description: "Add another bed to fit in an extra villager.",
		type: "craft",
		cost: {
			wood: 20,
			food: 40,
		},
		duration: 2,
		once: false,
		scaling: 1.5,
		requirement: ["tent", 1],
		effect: function (game) {
			game.levels.tent += 1;
			game.lumberjack += 1;
			game.logMessage(
				"event",
				"One extra villager has joined your settlement."
			);
		},
	}),
	new Upgrade({
		name: "Build a pier",
		description: "Construct a pier for your villagers to fish from.",
		type: "craft",
		cost: {
			wood: 100,
		},
		duration: 4,
		once: true,
		requirement: ["tent", 1],
		effect: function (game) {
			game.levels.pier += 1;
			game.unlock("fisherman");
			game.logMessage(
				"event",
				"You built a pier, and can now assign fishermen."
			);
		},
	}),
	new Upgrade({
		name: "Extend the pier",
		description: "A longer pier gives access to more fish.",
		type: "craft",
		cost: {
			wood: 200,
		},
		duration: 4,
		once: false,
		scaling: 4,
		requirement: ["pier", 1],
		effect: function (game) {
			game.production.fisherman *= 2;
			game.levels.pier += 1;
			game.logMessage(
				"event",
				"Your fishermen can now catch more fish."
			);
		},
	}),
	new Upgrade({
		name: "Build a Field",
		description: "Build a Field to perform Dhamaal Dance",
		type: "craft",
		cost: {
			wood: 200,
		},
		duration: 5,
		once: true,
		requirement: ["pier", 1],
		effect: function (game) {
			game.unlock("stone");
			game.unlock("miner");
			game.logMessage(
				"event",
				"You built a field now you can perform Dhamaal Dance"
			);
			game.levels.quarry += 1;
		},
	}),
	new Upgrade({
		name: "Develop the field",
		description: "Expand the field for more Dhamaal",
		type: "craft",
		cost: {
			wood: 250,
			stone: 100,
		},
		duration: 5,
		once: false,
		scaling: 4,
		requirement: ["quarry", 1],
		effect: function (game) {
			game.levels.quarry += 1;
			game.production.miner *= 2;
			game.logMessage("event", "Your field is now bigger");
		},
	}),
	new Upgrade({
		name: "Build a smithy",
		description: "Assign blacksmiths to help you complete crafts faster.",
		type: "craft",
		cost: {
			wood: 200,
			stone: 200,
		},
		duration: 6,
		once: true,
		requirement: ["quarry", 2],
		effect: function (game) {
			game.levels.smithy += 1;
			game.unlock("blacksmith");
			game.unlock("craftSpeed");
			game.logMessage("event", "You built a smithy! Nice!");
		},
	}),
	new Upgrade({
		name: "Modernize the smithy",
		description: "Get some new tools to make your blacksmiths happier.",
		type: "craft",
		cost: {
			wood: 400,
			stone: 400,
		},
		duration: 6,
		once: false,
		scaling: 2,
		requirement: ["smithy", 1],
		effect: function (game) {
			game.levels.smithy += 1;
			game.production.blacksmith *= 0.75;
			game.logMessage(
				"event",
				"Your blacksmiths will now be even more helpful."
			);
		},
	}),
	new Upgrade({
		name: "Build an academy",
		description:
			"Dedicate some village space towards all kinds of research for using plants as medicines.",
		type: "craft",
		cost: {
			wood: 1000,
			stone: 1000,
		},
		duration: 10,
		once: true,
		requirement: ["smithy", 3],
		effect: function (game) {
			game.levels.academy += 1;
			game.unlock("professor");
			game.unlock("research");
			game.unlock("researchSpeed");
			game.logMessage(
				"event",
				"Your academy is now open. What will you learn?"
			);
		},
	}),
	new Upgrade({
		name: "Grow the academy",
		description: "Advance your knowledge in new fields.",
		type: "craft",
		cost: {
			wood: 1500,
			stone: 2000,
		},
		duration: 10,
		once: false,
		scaling: 2,
		requirement: ["academy", 1],
		effect: function (game) {
			game.levels.academy += 1;
			game.production.professor *= 0.75;
			game.logMessage(
				"event",
				"You expand your understanding of saving the forests"
			);
		},
	}),
	new Upgrade({
		name: "Mentorship program",
		description: "What if you got one person to oversee another?",
		type: "research",
		cost: {
			food: 1500,
		},
		duration: 6,
		once: true,
		requirement: ["academy", 1],
		effect: function (game) {
			game.mentorUnlocked = true;
			game.unlock("mentor");
			game.logMessage(
				"event",
				"Turns out mentors training novices is a pretty good idea!"
			);
		},
	}),
	new Upgrade({
		name: "People management",
		description: "Instead of working, make sure others are working.",
		type: "research",
		cost: {
			food: 6000,
		},
		duration: 12,
		once: true,
		requirement: ["academy", 3],
		effect: function (game) {
			game.managerUnlocked = true;
			game.unlock("manager");
			game.logMessage(
				"event",
				"You can now assign chaos controllers! Also known as managers."
			);
		},
	}),

	// Job upgrades
	new Upgrade({
		name: "Craft more tools",
		description:
			"Your villagers will be happy they don't have to use their bare fists anymore to clean the fields.",
		type: "craft",
		cost: {
			wood: 40,
		},
		duration: 3,
		once: true,
		requirement: ["tent", 1],
		effect: function (game) {
			game.production.lumberjack *= 1.75;
			game.logMessage(
				"event",
				"Your tribes are now equipped with more tools."
			);
		},
	}),
	new Upgrade({
		name: "Craft wooden fishing rods",
		description:
			"Flailing your arms about in the water might not have been very effective.",
		type: "craft",
		cost: {
			wood: 100,
		},
		duration: 3,
		once: true,
		requirement: ["pier", 1],
		effect: function (game) {
			game.production.fisherman *= 1.75;
			game.logMessage(
				"event",
				"Your fishermen can now sit back and observe the lure. Handy."
			);
		},
	}),
	new Upgrade({
		name: "Craft wooden pickaxes",
		description:
			"Not the best idea in the world, but it gets the job done. Somewhat.",
		type: "craft",
		cost: {
			wood: 120,
		},
		duration: 3,
		once: true,
		requirement: ["quarry", 1],
		effect: function (game) {
			game.production.miner *= 1.75;
			game.logMessage(
				"event",
				"Now it can get even larger and attractive"
			);
		},
	}),
	new Upgrade({
		name: "Craft stone axes",
		description: "You can now save more trees",
		type: "craft",
		cost: {
			wood: 20,
			stone: 50,
		},
		duration: 4,
		once: true,
		requirement: ["quarry", 1],
		effect: function (game) {
			game.production.lumberjack *= 1.75;
			game.logMessage(
				"event",
				"Field is now very smooth can set up a campfire"
			);
		},
	}),
	new Upgrade({
		name: "Craft stone pickaxes",
		description: "Breaking rocks with style.",
		type: "craft",
		cost: {
			wood: 50,
			stone: 100,
		},
		duration: 5,
		once: true,
		requirement: ["quarry", 2],
		effect: function (game) {
			game.production.miner *= 1.75;
			game.logMessage(
				"event",
				"The siddis are now expanding the dance"
			);
		},
	}),
	new Upgrade({
		name: "Sharpen the pickaxes",
		description: "Rocks break faster with pointier tools.",
		type: "craft",
		cost: {
			wood: 60,
			stone: 120,
		},
		duration: 8,
		once: true,
		requirement: ["smithy", 1],
		effect: function (game) {
			game.production.miner *= 1.25;
			game.logMessage(
				"event",
				"You got the trick!!"
			);
		},
	}),
	new Upgrade({
		name: "Comfortable stools",
		description: "Your fishermen are tired of standing around.",
		type: "craft",
		cost: {
			wood: 160,
			stone: 40,
		},
		duration: 8,
		once: true,
		requirement: ["smithy", 1],
		effect: function (game) {
			game.production.fisherman *= 1.25;
			game.logMessage(
				"event",
				"You hear a loud cheer of joy as your fishermen are given hard stone chairs, the best they've ever used."
			);
		},
	}),
	new Upgrade({
		name: "Log storage",
		description: "Put your wood in standardized boxes.",
		type: "craft",
		cost: {
			wood: 200,
			stone: 120,
		},
		duration: 10,
		once: true,
		requirement: ["smithy", 2],
		effect: function (game) {
			game.production.lumberjack *= 1.25;
			game.logMessage(
				"event",
				`The committee has decided on a standard of the wood used in this way the useful trees can be saved`
			);
		},
	}),
	new Upgrade({
		name: "Multi-level quarry",
		description: "Expand your field.",
		type: "craft",
		cost: {
			wood: 400,
			stone: 100,
		},
		duration: 10,
		once: true,
		requirement: ["smithy", 2],
		effect: function (game) {
			game.production.miner *= 1.5;
			game.logMessage(
				"event",
				"A larger field means more Dhamaal"
			);
		},
	}),
	new Upgrade({
		name: "Fish traps",
		description: "Construct cunning traps to get fish to catch themselves.",
		type: "craft",
		cost: {
			wood: 500,
		},
		duration: 12,
		once: true,
		requirement: ["smithy", 3],
		effect: function (game) {
			game.production.fisherman *= 1.5;
			game.logMessage(
				"event",
				"With fish traps, your fishermen are now fishing twice at the same time."
			);
		},
	}),
	new Upgrade({
		name: "Back supports",
		description: "Your villagers backs hurt",
		type: "craft",
		cost: {
			wood: 300,
			stone: 300,
		},
		duration: 12,
		once: true,
		requirement: ["smithy", 3],
		effect: function (game) {
			game.production.lumberjack * 1.75;
			game.logMessage(
				"event",
				"Equipped with back supports, your villagers are now happier."
			);
		},
	}),
	new Upgrade({
		name: "Time management",
		description:
			"Help blacksmiths and professors manage their workday more efficiently.",
		type: "research",
		cost: {
			food: 2000,
		},
		duration: 15,
		once: true,
		requirement: ["academy", 1],
		effect: function (game) {
			game.production.blacksmith -= 0.05;
			game.production.professor -= 0.05;
			game.logMessage(
				"event",
				"Writing up a schedule helps your blacksmiths and professors realize how much time they have been wasting."
			);
		},
	}),
	new Upgrade({
		name: "Swing smarter, not harder",
		description:
			"A lumberjack course for maximizing your results with the same effort.",
		type: "research",
		cost: {
			food: 600,
		},
		duration: 15,
		once: true,
		requirement: ["academy", 1],
		effect: function (game) {
			game.production.lumberjack *= 2;
			game.logMessage(
				"event",
				"Your lumberjacks are a lot better at tree-cutting. They also seem to have formed a union."
			);
		},
	}),
	new Upgrade({
		name: "Task mastery",
		description: "Your mentors are good, but they could be better.",
		type: "research",
		cost: {
			food: 3000,
		},
		duration: 16,
		once: true,
		requirement: ["academy", 2],
		effect: function (game) {
			game.production.mentorBoost += 0.1;
			game.logMessage(
				"event",
				"After doing the same thing over and over for long enough, your mentors got better at their job."
			);
		},
	}),

	// Story upgrades
	new Upgrade({
		name: "Cultural threat",
		description:
			"The Siddis now have to preserve their rich culture and eradicate the discrimination.",
		type: "craft",
		cost: {
			food: 50,
		},
		duration: 60,
		once: true,
		requirement: ["quarry", 2],
		effect: function (game) {
			game.showStory(
				`Community elders, who often hold valuable knowledge and traditions, realize the threats faced by the Siddi culture and the significance of passing down their practices to younger generations.Through dialogue and engagement, elderly community members can come to recognize the urgency of safeguarding their cultural legacy for future generations.
				`,
				"Return"
			);
		},
	}),
	new Upgrade({
		name: "Save the Culture",
		description: "Find ways to save the culture",
		type: "research",
		cost: {
			food: 800,
		},
		duration: 240,
		once: true,
		requirement: ["academy", 2],
		effect: function (game) {
			game.showStory(
				`Once the need for cultural preservation has been realized among the elders, the focus shifts to educating the youth about the significance of Siddi cultural practices. Schools, youth clubs, and community organizations can play a vital role in educating young Siddis about their heritage through cultural programs, language classes, and experiential learning activities. Interactive workshops, cultural exchanges, and mentorship programs can help youth develop a sense of pride and identity in their cultural roots. By instilling a deep appreciation for Siddi traditions in the younger generation, efforts can ensure the continuity and vitality of cultural practices over time.`,
				"Leave"
			);
		},
	}),
	new Upgrade({
		name: "Dhamaal Dance to the rescue",
		description: "It is enough of discrimination",
		type: "research",
		cost: {
			wood: 0,
			food: 30000,
			stone: 50000,
		},
		duration: 1200,
		once: true,
		requirement: ["academy", 4],
		effect: function (game) {
			game.showStory(
				`It's a bright sunny day, and with the community mobilized and informed, the final phase involves reaching out to external stakeholders, such as government agencies and non-governmental organizations (NGOs), for support in preserving Siddi culture. Siddi community leaders can advocate for funding, resources, and policy initiatives to support cultural preservation efforts, such as the establishment of cultural centers, documentation projects, and heritage conservation programs. Collaborative partnerships with governmental bodies responsible for cultural affairs, as well as NGOs specializing in heritage conservation and community development. Through strategic alliances and collective action, Siddi communities can leverage external support to implement sustainable initiatives aimed at safeguarding their cultural heritage for future generations.`,
				"Advance",
				() => {
					game.showStory(
						`You are emerging out stronger and stronger!!.`,
						"Trigger",
						() => {
							game.showStory(
								`Now the Dhamaal Dance is famous all over the world and you succeded in preserving your culture with the help of government and NGOs`,
								"Join",
								() => {
									game.gameOver();
								}
							);
						}
					);
				}
			);
		},
	}),

	// Random upgrades
	new Upgrade({
		name: "Extinguish the local wildlife",
		description: "Save the local fluffy bunny population",
		type: "craft",
		cost: {
			wood: 0,
			food: 5,
		},
		duration: 2,
		once: true,
		requirement: ["tent", 1],
		effect: function (game) {
			game.food += 40;
			game.logMessage(
				"event",
				"You saved all bunnies. The ecosystem will be balanced."
			);
		},
	}),
	new Upgrade({
		name: "Get more Resources",
		description:
			"Collect the wood from the largest tree that just fell on ground to boost your supplies.",
		type: "craft",
		cost: {
			wood: 20,
		},
		duration: 4,
		once: true,
		requirement: ["pier", 1],
		effect: function (game) {
			game.wood += 100;
			game.logMessage(
				"event",
				"A majestic tree, providing shade and solace to warriors and lovers alike, has fallen down and you made it useful"
			);
		},
	}),
	new Upgrade({
		name: "Level the ground",
		description:
			"The village is built on rather uneven ground. Maybe our villagers can help with that.",
		type: "craft",
		cost: {
			stone: 20,
		},
		duration: 5,
		once: true,
		requirement: ["quarry", 1],
		effect: function (game) {
			game.stone += 120;
			game.logMessage(
				"event",
				"The village is now flatter than ever! Alright guys, you can carry the buildings back in."
			);
		},
	}),
	new Upgrade({
		name: "Fish out the monster of the deep",
		description:
			"A fish of enormous size has been terrorizing the population of small fishes.",
		type: "craft",
		cost: {
			food: 40,
		},
		duration: 5,
		once: true,
		requirement: ["quarry", 2],
		effect: function (game) {
			game.food += 200;
			game.logMessage(
				"event",
				"The monster of the deep has been transferred to other river. The waters are safe once more."
			);
		},
	}),
	new Upgrade({
		name: "Conservation Basics",
		description:
			"Teach your villagers how to save the wildlife and forests",
		type: "research",
		cost: {
			wood: 50,
			stone: 50,
			food: 100,
		},
		duration: 10,
		once: true,
		requirement: ["academy", 1],
		effect: function (game) {
			game.wood += 1000;
			game.stone += 1000;
			game.logMessage(
				"event",
				"Your villagers went on an adventure last weekend. They found an abandoned camp, full of supplies! All the food was rotten, though."
			);
		},
	}),
	new Upgrade({
		name: "Foreign customs",
		description:
			"Learn how to communicate with other tribe minding their business nearby.",
		type: "research",
		cost: {
			food: 400,
		},
		duration: 15,
		once: true,
		requirement: ["academy", 2],
		effect: function (game) {
			game.wood += 1600;
			game.stone += 1600;
			game.food += 800;
			game.logMessage(
				"event",
				"The friendly tribe agreed to barter!"
			);
		},
	}),
];
