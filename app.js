const CAFE_LIST = document.querySelector('#cafe-list');
const FORM = document.querySelector('#add-cafe-FORM');

// create element and render cafe
function renderCafe(doc) {
	let li = document.createElement('li');
	let name = document.createElement('span');
	let city = document.createElement('span');
	// Set up dom elements

	li.setAttribute('data-id', doc.id);
	name.textContent = doc.data().name;
	city.textContent = doc.data().city;

	//append the attributes to li
	li.appendChild(name);
	li.appendChild(city);

	//append li to the cafe list
	CAFE_LIST.appendChild(li);
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

// Geting Cafes
DB.collection('cafes').get().then((snapshot) => {
	snapshot.docs.forEach((doc) => {
		renderCafe(doc);
	});
});
