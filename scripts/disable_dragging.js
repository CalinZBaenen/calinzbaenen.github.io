// Disable element dragging to any class with `no-drag` for support with
// non-Webkit browsers.
try {
	const elements = document.querySelectorAll(".no-drag, .no-drag *")
	for(const e of elements) e.draggable = false;
} catch(e) {
	console.log(`Error (${e.nam}) deploying \`draggable=false\`; ${e.message}`);
}