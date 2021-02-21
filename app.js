const CAFE_LIST = document.querySelector('#cafe-list');
const FORM = document.querySelector('#add-cafe-FORM');
var toBeEditedId = '';

//cancel edit function
function cancelEdit() {
	document.getElementById('submit').innerHTML = 'Add Cafe';
	document.getElementById('cancel').style.display = 'none';
	FORM.name.value = '';
	FORM.city.value = '';
	toBeEditedId = '';
}

// create element and render cafe
function renderCafe(doc) {
	let li = document.createElement('li');
	let name = document.createElement('span');
	let city = document.createElement('span');
	let options = document.createElement('div');
	let edit = document.createElement('span');
	let cross = document.createElement('span');
	// Set up dom elements

	li.setAttribute('data-id', doc.id);
	name.textContent = doc.data().name;
	city.textContent = doc.data().city;
	edit.textContent = '/';
	cross.textContent = 'x';

	//append the attributes to li
	li.appendChild(name);
	li.appendChild(city);
	li.appendChild(options);
	options.appendChild(edit);
	options.appendChild(cross);

	//append li to the cafe list
	CAFE_LIST.appendChild(li);

	//editing data
	edit.addEventListener('click', (e) => {
		e.stopPropagation();
		let editableCafe = e.target.parentElement.parentElement;
		toBeEditedId = editableCafe.getAttribute('data-id');
		FORM.name.value = editableCafe.childNodes[0].textContent;
		FORM.city.value = editableCafe.childNodes[1].textContent;
		document.getElementById('submit').innerHTML = 'Update';
		document.getElementById('cancel').style.display = 'inline';
	});

	//deleting data
	cross.addEventListener('click', (e) => {
		e.stopPropagation();
		let id = e.target.parentElement.parentElement.getAttribute('data-id');
		DB.collection('cafes').doc(id).delete();
	});
}

//Submitting Form
FORM.addEventListener('submit', (e) => {
	e.preventDefault();
	if (document.getElementById('submit').innerHTML == 'Update' && toBeEditedId != '') {
		let id = e.target.parentElement.parentElement.getAttribute('data-id');
		DB.collection('cafes')
			.doc(toBeEditedId)
			.update({
				name: FORM.name.value,
				city: FORM.city.value
			})
			.then(() => {
				cancelEdit();
			});
	} else {
		DB.collection('cafes').add({
			name: FORM.name.value,
			city: FORM.city.value
		});
	}
	FORM.name.value = '';
	FORM.city.value = '';
});

//Cacnelling Edit
FORM.addEventListener('reset', (e) => {
	e.preventDefault();
	cancelEdit();
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
		} else if (change.type == 'modified') {
			let li = CAFE_LIST.querySelector('[data-id=' + change.doc.id + ']');
			li.childNodes[0].textContent = change.doc.data().name;
			li.childNodes[1].textContent = change.doc.data().city;
		}
	});
});
