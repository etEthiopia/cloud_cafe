const CAFE_LIST = document.querySelector('#cafe-list');
const FORM = document.querySelector('#add-cafe-FORM');

// create element and render cafe
function renderCafe(doc) {
	let li = document.createElement('li');
	let name = document.createElement('span');
	let city = document.createElement('span');
	let cross = document.createElement('div');
	// Set up dom elements

	li.setAttribute('data-id', doc.id);
	name.textContent = doc.data().name;
	city.textContent = doc.data().city;
	cross.textContent = 'x';

	//append the attributes to li
	li.appendChild(name);
	li.appendChild(city);
	li.appendChild(cross);

	//append li to the cafe list
	CAFE_LIST.appendChild(li);

	//deleting data
	cross.addEventListener('click', (e) => {
		e.stopPropagation();
		let id = e.target.parentElement.getAttribute('data-id');
		DB.collection('cafes').doc(id).delete();
	});
}

//Submitting Form
FORM.addEventListener('submit', (e) => {
	e.preventDefault();
	DB.collection('cafes').add({
		name: FORM.name.value,
		city: FORM.city.value
	});
	FORM.name.value = '';
	FORM.city.value = '';
});

//Real Time Listener
DB.collection('cafes').orderBy('city').onSnapshot((snapshot) => {
	let changes = snapshot.docChanges();
	changes.forEach((change) => {
		if (change.type == 'added') {
			renderCafe(change.doc);
		} else if (change.type == 'removed') {
			let li = CAFE_LIST.querySelector('[data-id=' + change.doc.id + ']');
			CAFE_LIST.removeChild(li);
		}
	});
});
