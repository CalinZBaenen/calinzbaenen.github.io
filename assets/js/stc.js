const stc_button = document.createElement("button");
var   hotlinks   = document.getElementById("hotlinks");
var   content    = document.querySelector("main");

stc_button.setAttribute("aria-label", "Skip to content.");
stc_button.setAttribute("tabindex", '1');
stc_button.setAttribute("class", "a-like");

stc_button.innerText = "Skip to content.";

if(content != null) {
	stc_button.onclick = function() { content.focus(); };
	content.setAttribute("tabindex", '0');
}

(function() {
	var li = document.createElement("li");
	li.setAttribute("id", "skip-to-content");
	li.appendChild(stc_button);
	
	hotlinks.insertBefore(li, hotlinks.firstElementChild);
})();