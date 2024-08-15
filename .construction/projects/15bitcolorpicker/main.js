/**
* A map containing lists of the available frequencies
* in the 15-bit colorspectrum.  
* All items are programmatically generated.
*/
const PALETTE15 = (()=>{
	// Initialize a map for red, green, and blue "step"s to be appended to.
	const colors = new Map();
	colors.set("red", []).set("green", []).set("blue", []);
	
	// For each of red, green, and blue, add steps programmatically using
	// a lazily made algorithm.
	for(const clr of colors.values()) for(let s = 0; s < 32; s++)
		clr.push( Math.floor((s/31)*255) );
	
	return Object.freeze(colors);
})();





class ColorpickerProgram {
	/**
	* Sets how bright the green colorchannel is.
	* @param {number} g The decimal number corresponding to the colorcode for this channel.
	*/
	static async setGreen(g=0) {
		ColorpickerProgram.color = (ColorpickerProgram.color & 16711935)+((g & 255) << 8);
	}
	
	/**
	* Sets how bright the blue colorchannel is.
	* @param {number} b The decimal number corresponding to the colorcode for this channel.
	*/
	static async setBlue(b=0) {
		ColorpickerProgram.color = (ColorpickerProgram.color & 16776960)+(b & 255);
	}
	
	/**
	* Sets how bright the blue colorchannel is.
	* @param {number} r 
	*/
	static async setRed(r=0) {
		ColorpickerProgram.color = (ColorpickerProgram.color & 65535)+((r & 255) << 16);
	}
	
	/**
	* Converts a twentyfour-bit RGB color to a fifteen-bit color by delimiting it.
	* @param {number} color A decimal number representing an RGB hex colorcode.
	* @param {Map<string, number[]>} map A map that tells the program how many steps are available for each channel.
	*/
	static to15Bit(color=0, map=undefined) {
		// Make sure the value of `color` is a number, otherwise set it to `0`.
		if(typeof color !== "number" || Number.isNaN(color)) {
			console.info(
				`Failed to use provided color [${color?.constructor.name} : ${color}].`
			);
			color = 0;
		}
		
		// Automatically solve for black and white.
		if(color === 0 || color === 16777215) return color;
		
		// Get the current RGB colors.
		const r = color >> 16 & 255;
		const g = color >>  8 & 255;
		const b = color       & 255;
		
		// Output RGB channels.
		const outputs =
			(new Map()).set("red", 0).set("green", 0).set("blue", 0);
		
		// Find the nearest frequencies for each channel.
		if(map?.constructor != Map) map = PALETTE15;
		{
			// Lowest differences and their indexes in the map.
			const prof_r =
				(new Map()).set("lowestDiff", Infinity).set("diffIdx", NaN)
					.set("for", "red").set("currValue", r);
			const prof_g =
				(new Map()).set("lowestDiff", Infinity).set("diffIdx", NaN)
					.set("for", "green").set("currValue", g);
			const prof_b =
				(new Map()).set("lowestDiff", Infinity).set("diffIdx", NaN)
					.set("for", "blue").set("currValue", b);
			
			// Get the channel differences.
			for(const prof of [prof_r, prof_g, prof_b]) {
				const pname  = prof.get("for");
				const psteps = map.get(pname);
				
				for(let stepno = 0; stepno < psteps.length; stepno++) {
					// Computeted **Diff**erence; **L**owest D**iff**erence.
					const diff = Math.abs( psteps[stepno]-prof.get("currValue") );
					const ldff = prof.get("lowestDiff");
					
					if(diff < ldff || ldff === Infinity) {
						prof.set("lowestDiff", diff);
						prof.set("diffIdx", stepno);
					}
				}
				
				outputs.set(pname, map.get(pname)[ prof.get("diffIdx") ])
			}
			
			console.table({
				"Inputs": {"r": r, "g": g, "b": b},
				"Profiles": {"r": prof_r, "g": prof_g, "b": prof_b},
				"Outputs": {"r": outputs.get("red"), "g": outputs.get("green"), "b": outputs.get("blue")}
			})
		}
		
		return (outputs.get("red") << 16)+(outputs.get("green") << 8)+outputs.get("blue");
	}
	
	/** Updates a possibly-existent `#swatch` element. */
	static #updateSwatch() {
		const swatch = document.getElementById("swatch");
		try {
			const code = ColorpickerProgram.#hex;
			swatch.style.backgroundColor = code;
			swatch.title = code;
		} catch(e) {
			console.error(`Error updating swatch. | ${e.message}: ${e.name}`);
		}
	}
	
	/** Updates possibly existent `#in-red`, `#in-grn`, and `#in-blu` elements. */
	static #updateCtrls() {
		const ir = document.getElementById("in-red");
		const ig = document.getElementById("in-grn");
		const ib = document.getElementById("in-blu");
		
		try {
			ir.value = Math.round( (ColorpickerProgram.red/255)*31 );
			ig.value = Math.round( (ColorpickerProgram.green/255)*31 )
			ib.value = Math.round( (ColorpickerProgram.blue/255)*31 )
		} catch(e) {
			console.error(`Error updating controls. | ${e.message}: ${e.name}`);
		}
	}
	
	/** Updates a possibly existent `#in-clr` element. */
	static #updateInput() {
		const input = document.getElementById("in-clr");
		try {
			input.value = ColorpickerProgram.#hex;
		} catch(e) {
			console.error(`Error updating color input. | ${e.message}: ${e.name}`);
		}
	}
	
	
	
	/** Gets the program's current set color. */
	static get color() { return ColorpickerProgram.#color; }
	/**
	* Sets the color to an integer corresponding to the desired color's hexcode.
	* @param {number} v The decimal value to use.
	*/
	static set color(v=0) {
		const color = ColorpickerProgram.to15Bit(v);
		
		ColorpickerProgram.#color = color;
		ColorpickerProgram.#hex = `#${color.toString(16).padStart(6, '0')}`;
		
		ColorpickerProgram.#updateSwatch();
		ColorpickerProgram.#updateCtrls();
		ColorpickerProgram.#updateInput();
	}
	
	/** Gets the brightness of the green colorchannel.*/
	static get green() { return (this.#color >> 8)  & 255; }
	/** Gets the brightness of the blue colorchannel.*/
	static get blue() { return  this.#color         & 255; }
	
	/** Gets the color the programming is using in hexidecimal. */
	static get hex() { return ColorpickerProgram.#hex; }
	/**
	* Sets the color the program is using with hexidecimal.
	* @param {string} v The hex value to use.
	*/
	static set hex(v="#000000") {
		const color = ColorpickerProgram.to15Bit( parseInt(
			String(v ?? "").replace(/[^\da-f]/gi, "").padStart(6, '0'),
			16
		) );
		ColorpickerProgram.color = color;
	}
	
	/** Gets the stepmap being used. */
	static get map() { return this.#customMap; }
	/**
	* Sets the custom "stepmap" used by the program.
	* @param {Map<string, number[]>} v The stepmap to use. - If `null` or `undefined` is provided it resets the map being used, otherwise non-Map values are ignored.
	*/
	static set map(v=null) {
		if(v === undefined || v === null) v = undefined;
		if(
			v?.constructor === Map &&
			v.has("red") && Map.has("green") && Map.has("blue")
		) this.#customMap = v;
	}
	
	/** Gets the brightness of the red colorchannel.*/
	static get red() { return (this.#color >> 16) & 255; }
	
	
	
	/** @type {Map<string, number[]>} */ static #customMap = undefined;
	/** @type {number}                */ static #color     = 0;
	/** @type {string}                */ static #hex       = "#000000";
}