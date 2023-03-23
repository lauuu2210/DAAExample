var PetsView = (function () {
	var petsDao;
	var peopleDao;

	var self;

	var formPetsId = 'pets-form';
	var listPetsId = 'pets-list';
	var formPeopleId = 'people-form';
	var listPeopleId = 'people-list';
	var formQuery = '#' + formPetsId;
	var listQuery = '#' + listPetsId;
	var formPeopleQuery = '#' + formPeopleId;
	var listPeopleQuery = '#' + listPeopleId;

	function PetsView(petDao, personDao, formContainerId, listContainerId) {
		petsDao = petDao;
		peopleDao = personDao;
		self = this;

		this.init = function () {
			this.setNavbar();
			this.showPeopleView();
		}

		this.setNavbar = function () {
			$('#personas').click(this.showPeopleView);
			$('#mascotas').click(this.showPetsView);
		}

		this.showPeopleView = function () {
			document.getElementById("pets-container").innerHTML = "<h1>Personas</h1>";

			insertPeopleForm($('#' + formContainerId));
			insertPeopleList($('#' + listContainerId));

			peopleDao.listPeople(function (people) {
				$.each(people, function (key, person) {
					appendToTable(person);
				});
			},
				function () {
					alert('No has sido posible acceder al listado de personas.');
				});


			$(formPeopleQuery).submit(function (event) {
				var person = self.getPersonInForm();

				if (self.isEditingPerson()) {
					peopleDao.modifyPerson(person,
						appendToTable(person),
						showErrorMessage,
						self.enableFormPeople
					);
				} else {
					peopleDao.addPerson(person,
						appendToTable(person),
						showErrorMessage,
						self.enableFormPeople
					);
				}

				return false;
			});

			$('#delete').click(this.resetFormPeople);
		}
		////////////////////////////////////////////////////////////////////
		this.showPetsView = function () {

			document.getElementById("pets-container").innerHTML = "<h1>Mascotas</h1>";

			insertPetsForm($('#' + formContainerId));
			insertPetsList($('#' + listContainerId));
			petsDao.listPets(function (pets) {
				$.each(pets, function (key, pet) {
					appendToPetTable(pet);
				});
			},
				function () {
					alert('No has sido posible acceder al listado de mascotas.');
				});

			peopleDao.listPeople(function (people) {
				$.each(people, function (key, person) {
					ownerToCombobox(person);
				});
			},
				function () {
					console.log("Fallo combobox");
				});


			$(formQuery).submit(function (event) {
				var pet = self.getPetInForm();

				if (self.isEditing()) {
					petsDao.modifyPet(pet,
						function (pet) {
							$('#pet-' + pet.id + ' td.name').text(pet.name);
							$('#pet-' + pet.id + ' td.owner').text(pet.owner);
							self.resetForm();
						},
						showErrorMessage,
						self.enableForm
					);
				} else {
					petsDao.addPet(pet,
						function (pet) {
							appendToPetTable(pet);
							self.resetForm();
						},
						showErrorMessage,
						self.enableForm
					);
				}

				return false;
			});

			$('#delete').click(this.resetForm);
		};

		this.getPetInForm = function () {
			var form = $(formQuery);
			var selectElement = document.getElementById("my-select");
			var selectedOption = selectElement.options[selectElement.selectedIndex];
			var selectedContent = selectedOption.textContent;
			return {
				'id': form.find('input[name="id"]').val(),
				'name': form.find('input[name="name"]').val(),
				'owner': document.getElementById("my-select").value
			};
		};

		this.getPetInRow = function (id) {
			var row = $('#pet-' + id);

			if (row !== undefined) {
				return {
					'id': id,
					'name': row.find('td.name').text(),
					'owner': row.find('td.owner').text()
				};
			} else {
				return undefined;
			}
		};

		this.editPet = function (id) {
			var row = $('#pet-' + id);

			if (row !== undefined) {
				var form = $(formQuery);

				form.find('input[name="id"]').val(id);
				form.find('input[name="name"]').val(row.find('td.name').text());
				document.getElementById("my-select").value = (row.find('td.owner').text())

				document.getElementById("modify").textContent = "Modificar";
			}
		};

		this.deletePet = function (id) {
			if (confirm('Está a punto de eliminar a una mascota. ¿Está seguro de que desea continuar?')) {
				petsDao.deletePet(id,
					function () {
						$('tr#pet-' + id).remove();
					},
					showErrorMessage
				);
			}
		};

		this.isEditing = function () {
			return $(formQuery + ' input[name="id"]').val() != "";
		};

		this.disableForm = function () {
			$(formQuery + ' input').prop('disabled', true);
		};

		this.enableForm = function () {
			$(formQuery + ' input').prop('disabled', false);
		};

		this.resetForm = function () {
			$(formQuery)[0].reset();
			document.getElementById("modify").textContent = "Crear";
		};

		//Person----------------------------------------------------------------------------------------------------------------------------

		this.isEditingPerson = function () {
			return $(formPeopleQuery + ' input[name="id"]').val() != "";
		};

		this.disableFormPeople = function () {
			$(formPeopleQuery + ' input').prop('disabled', true);
		};

		this.enableFormPeople = function () {
			$(formPeopleQuery + ' input').prop('disabled', false);
		};

		this.resetFormPeople = function () {
			$(formPeopleQuery)[0].reset();
			$(formPeopleQuery + ' input[name="id"]').val('');
			document.getElementById("modify-person").textContent = "Crear";
		};
		//----------------------------------------------------------------------------------------------------------------------------------

		this.getPersonInForm = function () {
			var form = $(formPeopleQuery);
			return {
				'id': form.find('input[name="id"]').val(),
				'name': form.find('input[name="name"]').val(),
				'surname': form.find('input[name="surname"]').val()
			};
		};

		this.getPersonInRow = function (id) {
			var row = $('#people-' + id);

			if (row !== undefined) {
				return {
					'id': id,
					'name': row.find('td.name').text(),
					'surname': row.find('td.surname').text()
				};
			} else {
				return undefined;
			}
		};

		this.editPerson = function (id) {

			var row = $('#people-' + id);


			if (row !== undefined) {
				var form = $(formPeopleQuery);

				form.find('input[name="id"]').val(id);
				form.find('input[name="name"]').val(row.find('td.name').text());
				form.find('input[name="surname"]').val(row.find('td.surname').text());
				document.getElementById("modify-person").textContent = "Modificar";
			}
		};

		this.deletePerson = function (id) {
			if (confirm('Está a punto de eliminar a una persona y sus mascotas asociadas. ¿Está seguro de que desea continuar?')) {
				peopleDao.deletePerson(id,
					function () {
						$('tr#people-' + id).remove();
					},
					showErrorMessage
				);
			}
		};
	};


	/**
	 * 
	 * 
	 * 
	 * 
	 * FUNCIONALIDADES ESPECIFICAS DE LAS MASCOTAS
	 * 
	 * 
	 * 
	 * 
	 */

	/**
	 * Inserción en la pagina principal de la tabla correspondiente a la vista de todas las mascotas y sus dueños.
	 * 
	 * @param {*} parent padre sobre el cual se va a realizar la inserción de la tabla.
	 */

	var insertPetsList = function (parent) {
		parent.append(
			'<table id="' + listPetsId + '" class="styled-table">\
				<thead>\
					<tr class="row">\
						<th class="col-sm-4">Nombre</th>\
						<th class="col-sm-5">Owner</th>\
						<th class="col-sm-3">&nbsp;</th>\
					</tr>\
				</thead>\
				<tbody>\
				</tbody>\
			</table>'
		);
	};

	/**
	 * Inserción en la pagina principal del formulario correspondiente a la creación de una mascota.
	 * 
	 * @param {*} parent padre sobre el cual se va a realizar la inserción del formulario.
	 */

	var insertPetsForm = function (parent) {

		parent.append(
			'<form id="' + formPetsId + '" class="mb-5 mb-10">\
				<input name="id" type="hidden" value=""/>\
				<div class="row">\
					<div>\
						<input name="name" type="text" value="" placeholder="Nombre" class="form-control" required/>\
					</div>\
					<div>\
						<select id="my-select"></select>\
					</div>\
					<div>\
						<button id="modify" type="submit value="Crear" class="btn-borde">Crear</button>\
						<button id="delete" type="reset" class="btn-borde">Limpiar</button>\
					</div>\
				</div>\
			</form>'
		);
	};

	/**
	 * Creación de la linea correspondiente a la mascota a introducir en la tabla, además de insertar los botones de eliminar y modificar correspondientes.
	 * 
	 * @param {*} pet mascota sobre la cual se va a realizar la inserción.
	 * @returns 
	 */
	var createPetRow = function (pet) {
		return '<tr id="pet-' + pet.id + '" class="row">\
			<td class="name col-sm-4">' + pet.name + '</td>\
			<td id="owner" class="owner col-sm-5">' + pet.owner + '</td>\
			<td class="col-sm-3">\
				<button id="delete" class="btn-borde">Eliminar</button>\
				<button id="editar" class="btn-borde">Editar</button>\
			</td>\
		</tr>';
	};


	/**
	 * Creación e introduccion de los botones para editar y eliminar en la tabla creada con anterioridad.
	 * @param {*} pet mascota sobre la cual se va a crear la inserción de la tabla.
	 */
	var appendToPetTable = function (pet) {
		$(listQuery + ' > tbody:last')
			.append(createPetRow(pet));
		addRowPetListeners(pet);
	};

	/**
	 * Añade las funcionalidades correspondientes a los botones insertados en la propia tabla.
	 * 
	 * @param {*} pet objeto sobre el cual se van a realizar las acciones.
	 */
	var addRowPetListeners = function (pet) {
		$('#pet-' + pet.id + ' button#editar.btn-borde').click(function () {
			self.editPet(pet.id);
		});

		$('#pet-' + pet.id + ' button#delete.btn-borde').click(function () {
			self.deletePet(pet.id);
		});
	};

	var ownerToCombobox = function (person) {
		const select = document.getElementById("my-select");
		const option1 = document.createElement("option");
		option1.value = person.id;
		option1.textContent = person.id;
		select.appendChild(option1);
	}



	/**
	 * 
	 * 
	 * 
	 * 
	 * FUNCIONALIDADES ESPECIFICAS DE LAS PERSONAS
	 * 
	 * 
	 * 
	 * 
	 */



	/**
	 * Inserción te la tabla correspondiente a las personas, en la cual se van a mostrar los datos además de las funciones de editar y eliminar.
	 * 
	 * @param {*} parent padre sobre el cual se va a insertar la siguiente tabla.
	 */
	var insertPeopleList = function (parent) {
		parent.append(
			'<table id="' + listPeopleId + '" class="styled-table">\
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
		);
	};

	/**
	 * Creación del formulario de inserción de una persona.
	 * 
	 * @param {*} parent padre sobre el cual se va a realizar la inserción html.
	 */

	var insertPeopleForm = function (parent) {

		parent.append(
			'<form id="' + formPeopleId + '" class="mb-5 mb-10">\
				<input name="id" type="hidden" value=""/>\
				<div class="row">\
					<div>\
						<input name="name" type="text" value="" placeholder="Nombre" class="form-control" required/>\
					</div>\
					<div>\
						<input name="surname" type="text" value="" placeholder="Apellido" class="form-control" required/>\
					</div>\
					<div>\
						<button id="modify-person" type="submit value="Crear" class="btn-borde">Crear</button>\
						<button id="delete" type="reset" class="btn-borde">Limpiar</button>\
					</div>\
				</div>\
			</form>'
		);
	};

	/**
	 * Añadimos una fila con los datos correspondientes a la persona.
	 * @param {*} people objeto persona del cual se va a crear la fila.
	 * @returns codigo html de la fila generada.
	 */
	var createPeopleRow = function (people) {
		return '<tr id="people-' + people.id + '" class="row">\
			<td class="name col-sm-4">' + people.name + '</td>\
			<td class="surname col-sm-5">' + people.surname + '</td>\
			<td class="col-sm-3">\
				<button id="delete-person" class="btn-borde">Eliminar</button>\
				<button id="edit-person" class="btn-borde">Editar</button>\
			</td>\
		</tr>';
	};

	/**
	 * Lanzamiento de errores.
	 * 
	 * @param {*} jqxhr 
	 * @param {*} textStatus 
	 * @param {*} error 
	 */
	var showErrorMessage = function (jqxhr, textStatus, error) {
		alert(textStatus + ": " + error);
	};

	/**
	 * Añade las funcionalidades correspondientes a los botones insertados en la propia tabla.
	 * 
	 * @param {*} people objeto sobre el cual se van a realizar las acciones.
	 * 
	 */
	var addRowListeners = function (people) {
		$('#people-' + people.id + ' button#edit-person.btn-borde').click(function () {
			self.editPerson(people.id);
		});

		$('#people-' + people.id + ' button#delete-person.btn-borde').click(function () {
			self.deletePerson(people.id);
		});
	};

	/**
	 * Añade las filas generadas más las funcionalidades de los botones a la tabla correspondiente.
	 * 
	 * @param {*} people objeto el cual sobre el cual se va a añadir la fila en la tabla.
	 */
	var appendToTable = function (people) {
		$(listPeopleQuery + ' > tbody:last')
			.append(createPeopleRow(people));
		addRowListeners(people);
	};

	return PetsView;
})();
