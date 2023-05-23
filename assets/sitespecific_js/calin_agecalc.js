function updateAgetellingwidget() {
	const age = getCurrentAge();
	const msg = `is ${age} years old`;
	const e   = document.getElementById("age");
	e.innerText = msg;
}

const getCurrentAge = function getCurrentAge() {
	const now = new Date();
	
	const birthday_passed =
		now.getUTCMonth() > 8 || (now.getUTCMonth() === 8 && now.getUTCDate() >= 30);
	if(birthday_passed && now.getUTCHours()-6 < 0) birthday_passed = false;
	
	const crude_age = now.getUTCFullYear()-2006;
	const age = birthday_passed ? crude_age : crude_age-1;
	
	return age;
}