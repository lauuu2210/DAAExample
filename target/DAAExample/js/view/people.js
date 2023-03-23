var PeopleView = (function () {
	var dao;
	var self;
	var petsDAO;

	var formId = 'people-form';
	var listId = 'people-list';
	var formQuery = '#' + formId;
	var listQuery = '#' + listId;

	function PeopleView(peopleDao, petsDao, formContainerId, listContainerId) {
		dao = peopleDao;
		petsDAO = petsDao;
		self = this;

		this.init = function () {
			responsiveNavbar();
			showPeople();

		};

		this.deletePerson = function (id) {
			if (confirm('Está a punto de eliminar a una persona. ¿Está seguro de que desea continuar?')) {
				dao.deletePerson(id,
					function () {
						$('tr#person-' + id).remove();
					},
					showErrorMessage
				);
			}
		};

		this.deletePet = function (id) {
			if (confirm('Está a punto de eliminar a una mascota. ¿Está seguro de que desea continuar?')) {
				petsDAO.deletePet(id,
					function () {
						$('tr#person-' + id).remove();
					},
					showErrorMessage
				);
			}
		};
	};

	var createPersonRow = function (person) {
		return '<tr id="person-' + person.id + '" class="row">\
			<td class="name col-sm-4">' + person.name + '</td>\
			<td class="surname col-sm-5">' + person.surname + '</td>\
			<td class="col-sm-3">\
				<button id="add" class="btn-borde" type="submit" value="submit">Editar</button>\
				<button id="delete" class="btn-borde" type="submit" value="submit">Eliminar</button>\
			</td>\
		</tr>';
	};

	var createPetRow = function (person) {
		return '<tr id="person-' + person.id + '" class="row">\
			<td class="name col-sm-4">' + person.name + '</td>\
			<td class="owner col-sm-5">' + person.ownerName + '</td>\
			<td class="col-sm-3">\
				<button id="add" class="btn-borde" type="submit" value="submit">Editar</button>\
				<button id="delete" class="btn-borde" type="submit" value="submit">Eliminar</button>\
			</td>\
		</tr>';
	};


	var appendToPetsTable = function (person) {
		$(listQuery + ' > tbody:last')
			.append(createPetRow(person));
		addRowListeners(person);
	};

	var appendToTable = function (person) {
		$(listQuery + ' > tbody:last')
			.append(createPersonRow(person));
		addRowListeners(person);
	};

	var addRowListeners = function (person) {
		if (document.getElementById("personas").className == "selected") {
			$('#person-' + person.id + ' button#add.btn-borde').click(function () {

			});

			$('#person-' + person.id + ' button#delete.btn-borde').click(function () {
				self.deletePerson(person.id);
			});
		} else {
			$('#person-' + person.id + ' button#edit.btn-borde').click(function () {

			});

			$('#person-' + person.id + ' button#delete.btn-borde').click(function () {
				self.deletePet(person.id);
			});
		}

	};

	var showErrorMessage = function (jqxhr, textStatus, error) {
		alert(textStatus + ": " + error);
	};

	function responsiveNavbar() {
		let peopleMenu = document.getElementById("personas");
		let petMenu = document.getElementById("mascotas");
		peopleMenu.addEventListener("click", showPeople);
		petMenu.addEventListener("click", showPets);
	};

	function showPeople() {

		document.getElementById("container").innerHTML = '<button id="nuevaPersona" class="btn-borde">Nuevo</button>';

		let addButton = document.getElementById("nuevaPersona");
		addButton.addEventListener("click", insertPerson);

		document.getElementById("personas").className = "selected";
		document.getElementById("mascotas").className = "";

		createPersonTable();

		dao.listPeople(function (people) {
			$.each(people, function (key, person) {
				appendToTable(person);

			});
		},
			function () {
				alert('No has sido posible acceder al listado de personas.');
			});
		responsiveNavbar();
	}

	function showPets() {

		document.getElementById("container").innerHTML = '<button id="nuevaMascota" class="btn-borde">Nuevo</button>';

		let addButton = document.getElementById("nuevaMascota");
		addButton.addEventListener("click", insertPet);

		document.getElementById("personas").className = "";
		document.getElementById("mascotas").className = "selected";
		createPetsTable();
		petsDAO.listPets(function (pets) {
			$.each(pets, function (key, pet) {
				appendToPetsTable(pet);
			});
		},
			function () {
				alert('No has sido posible acceder al listado de mascotas.');
			});
		responsiveNavbar();
	};

	function createPetsTable() {
		console.log("entra");
		document.getElementById("people-container").innerHTML = '\
		<table id="' + listId + '" class="styled-table">\
				<thead>\
					<tr class="row">\
						<th class="col-sm-4">Nombre</th>\
						<th class="col-sm-5">Dueño</th>\
						<th class="col-sm-3">&nbsp;</th>\
					</tr>\
				</thead>\
				<tbody>\
				</tbody>\
			</table>\
			'
	}

	function createPersonTable() {

		document.getElementById("people-container").innerHTML = '<table id="' + listId + '" class="styled-table">\
				<thead>\
					<tr class="row">\
						<th class="col-sm-4">Nombre</th>\
						<th class="col-sm-5">Apellido</th>\
						<th class="col-sm-3">&nbsp;</th>\
					</tr>\
				</thead>\
				<tbody>\
				</tbody>\
			</table>'
	}

	function insertPerson() {
		
		document.getElementById("container").innerHTML = "";
		const form = document.createElement("form");
		form.id = "form-people";

		const divFormName = document.createElement("div");
		divFormName.className = "form-control";

		const divFormSurname = document.createElement("div");
		divFormSurname.className = "form-control";

		//Creamos el input para el nombre de la persona
		const name = document.createElement("input");
		name.id = "label-name"
		name.type = "text";
		name.name = "name";
		name.placeholder = "Nombre";

		//Creamos el label del nombre de la persona 
		const labelName = document.createElement("label");
		labelName.htmlFor = "name";
		labelName.textContent = "Nombre"

		//Creamos el input para el apellido de la persona
		const surname = document.createElement("input");
		surname.id = "label-surname"
		surname.type = "text";
		surname.name = "surname";
		surname.placeholder = "Apellido";

		//Creamos el label del apellido de la persona 
		const labelSurname = document.createElement("label");
		labelSurname.htmlFor = "surname";
		labelSurname.textContent = "Apellido";

		// Crear un botón de envío
		const submitButton = document.createElement("button");
		submitButton.className = "btn-borde";
		submitButton.type = "submit";
		submitButton.textContent = "Añadir";

		//Creamos un boton para cancelar
		const button = document.createElement("button");
		button.id = "cancel";
		button.className = "btn-borde";
		button.type = "button";
		button.textContent = "Cancelar";

		//Introducimos todo en su div correspondiente
		divFormName.appendChild(labelName);
		divFormName.appendChild(name);
		divFormSurname.appendChild(labelSurname);
		divFormSurname.appendChild(surname);

		// Agregar los elementos al formulario
		form.appendChild(divFormName);
		form.appendChild(divFormSurname);
		form.appendChild(button);
		form.appendChild(submitButton);

		// Agregar el formulario al DOM
		document.getElementById("people-container").style.display = "none";
		document.body.appendChild(form);

		//Agregar funcionalidades a los botones
		document.getElementById("cancel").addEventListener("click", cancelPersonButton);
		responsiveNavbar();
	}

	function insertPet() {
		document.getElementById("container").innerHTML = "";
		const form = document.createElement("form");
		form.id = "form-pet";

		const divFormName = document.createElement("div");
		divFormName.className = "form-control";

		const divFormSurname = document.createElement("div");
		divFormSurname.className = "form-control";

		//Creamos el input para el nombre de la persona
		const name = document.createElement("input");
		name.id = "label-name"
		name.type = "text";
		name.name = "name";
		name.placeholder = "Nombre";

		//Creamos el label del nombre de la persona 
		const labelName = document.createElement("label");
		labelName.htmlFor = "name";
		labelName.textContent = "Nombre"

		// Crear un botón de envío
		const submitButton = document.createElement("button");
		submitButton.className = "btn-borde";
		submitButton.type = "submit";
		submitButton.textContent = "Añadir";

		//Creamos un boton para cancelar
		const button = document.createElement("button");
		button.id = "cancel";
		button.className = "btn-borde";
		button.type = "button";
		button.textContent = "Cancelar";

		//Introducimos todo en su div correspondiente
		divFormName.appendChild(labelName);
		divFormName.appendChild(name);

		// Agregar los elementos al formulario
		form.appendChild(divFormName);
		form.appendChild(divFormSurname);
		form.appendChild(button);
		form.appendChild(submitButton);

		// Agregar el formulario al DOM
		//document.getElementById("people-container").style.display = "none";
		document.body.appendChild(form);

		//Agregar funcionalidades a los botones
		//document.getElementById("cancel").addEventListener("click", cancelPetButton);
		responsiveNavbar();
	}

	function cancelPersonButton() {
		document.getElementById("people-container").style.display = '';
		const formulario = document.getElementById('form-people');
		formulario.remove();
		showPeople();
	}

	function cancelPersonButton() {
		document.getElementById("people-container").style.display = '';
		const formulario = document.getElementById('form-pet');
		formulario.remove();
		showPeople();
	}

	

	return PeopleView;
})();
