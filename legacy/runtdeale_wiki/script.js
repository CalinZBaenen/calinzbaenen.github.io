let poked = 0

const randInt = function(min=0, max=0) {
	const INT = Math.ceil(Math.random()*max)
	if(INT < min) return min;
	else if(INT > max) return max;
	else return INT;
};

const pokeMotherDrinbull = function() {
	if(poked > 4 && poked < 11) {
		const div = document.getElementById("MDIMG").parentElement;
		div.title = "HEY! STOP POKING ME! I'M NOT YOUR GIRLFRIEND! PLUS, I'M WAY TOO OLD!";
		setTimeout(() => div.title = "Toriel Dreemurr", 5000);
	}
	
	if(poked === 50) {
		const emotion = randInt(1, 101) % 3;
		const image = document.getElementById("MDIMG")
		
		if(emotion != 0) {
			image.src = "textures/characters/Mother_Drinbull/animation/idle/nsfw/embarrassed.png";
			image.parentElement.title = "H-hey! That's not cool! Don't take my cloths off... I'm putting them back on!";
			setTimeout(function() {
				image.src = "textures/characters/Mother_Drinbull/Bella.png";
				image.parentElement.title = "";
			}, 8000)
		} else {
			image.src = "textures/characters/Mother_Drinbull/animation/idle/nsfw/happy.png";
			image.parentElement.title = "Tehehe... Isn't it nice to just relax, breeze against your skin, sometimes?";
		}
	}
	
	poked++;
};