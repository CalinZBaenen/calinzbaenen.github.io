/** Validates the input from the `#write-txt` element. */
function validateInputLength() {
	const txti = document.getElementById("write-txt");
	const btn  = document.getElementById("__submit");
	
	try {
		if(txti?.value?.length > 0) btn.disabled = false;
		else btn.disabled = true;
	} catch(_) {}
}



/** Accepts the currently provided text and keywords and runs them through ParseJS' `parse_string` function. */
function evalPJSDemo() {
	// Elements.
	const etxtph = document.getElementById("__eval_text_preview");
	const outf = document.getElementById("__output_field");
	const txti = document.getElementById("write-txt");
	const kwl = document.getElementById("__list_content");
	
	// Collect the keywords.
	const keywords = [];
	for(const kwc of kwl.children) if(kwc.className === "keyword-item")
		keywords.push( String(kwc.querySelector("span")?.innerText) );
	
	// Get the text to analyze.
	const txt = String(txti?.value);
	etxtph.innerText = txt;
	
	// Handle the output.
	const highlights = [];
	const output = parse_string(txt, keywords, true);
	
	for(const substr of output) {
		const el = document.createElement("span");
		
		if(typeof substr === "symbol") {
			el.style.backgroundColor = "#20ff0088";
			el.innerText = substr.description;
		} else { el.innerText = String(substr); }
		
		highlights.push(el);
	}
	
	outf.innerHTML = "";
	
	const codesnippet = document.createElement("code");
	for(const el of highlights) codesnippet.appendChild(el);
	outf.appendChild(codesnippet);
}



/** Adds a keyword to the demonstration's keyword-list. */
function addKeyword() {
	const kwi = document.getElementById("add-kw");
	const kwl = document.getElementById("__list_content");
	const kw  = String(kwi?.value).trim();
	
	// Create the keyword's container.
	const keywordContainer = document.createElement("div");
	keywordContainer.className = "keyword-item";
	
	// Text for the keyword.
	const text = document.createElement("span");
	text.innerText = kw;
	
	// [REMOVE] button.
	const rmb = document.createElement("button");
	rmb.style.margin = "3px";
	rmb.innerText = "REMOVE";
	rmb.onclick = ()=>keywordContainer.parentElement.removeChild(keywordContainer);
	
	// Add components.
	keywordContainer.appendChild(text);
	keywordContainer.appendChild(rmb);
	
	// Add content to list.
	kwl?.appendChild(keywordContainer);
	try { kwi.value = ""; } catch(_) {}
}