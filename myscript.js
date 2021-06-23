// var request = new XMLHttpRequest();
// request.open('GET', 'data.json', true);
//
// request.onload = function() {
//   if (this.status >= 200 && this.status < 400) {
//     // Success!
//     var data = JSON.parse(this.response);
//     console.log(data)
//   } else {
//     // We reached our target server, but it returned an error
//
//   }
// };
//
// request.onerror = function() {
//   // There was a connection error of some sort
// };
//
// request.send();

fetch('data.json')
.then((response) => {
  return response.json();
})
.then(createForm);

// Генератор лейблов
function createLabel(data, id, label) {
  var fragment = document.createDocumentFragment();
  var newLabel = document.createElement('label');

  newLabel.setAttribute('for', id);
  newLabel.textContent = label;

  return newLabel
}

function createInput(data, input, number, form) {
  for (var i = 0; i < number; i++) {
    var inputContainer = document.createElement('div');
    inputContainer.classList.add('page__input-container');
    var newInput = document.createElement('input');
    newInput.type = input[i].type;
    newInput.id = input[i].id;
    newInput.name = input[i].name;

// Создаёт дополнительное поле для прошлой фамилии
    if (input[i].name == 'first_name') {
      createInput(data, data.previous_surname, data.previous_surname.length, form);
    }

    if (input[i].hasOwnProperty('placeholder')) {
      newInput.placeholder = input[i].placeholder;
    }

// Классы для дополнительных полей
    if (input[i].name == 'previous_checkbox') {
      inputContainer.classList.add('page__previous-checkbox');
    }
    if (input[i].name == 'previous_surname') {
      inputContainer.classList.add('page__previous-input');
    }

    if (input[i].hasOwnProperty('required')) {
      newInput.required = 'required';
    }

    if (input[i].type == 'tel') {
      newInput.pattern = '^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$';
      newInput.setAttribute('minlength',"10");
      newInput.setAttribute('maxlength',"18");
    }

    newInput.classList.add('page__input');

// Классы для чекбоксов прочее
    if (input[i].type == 'checkbox') {
      var checkboxLabel = createLabel(data, input[i].id, input[i].label);
      checkboxLabel.classList.add('page__label-checkbox');
      checkboxLabel.appendChild(newInput);

      newInput.value = input[i].value;
      inputContainer.classList.add('page__checkbox-container');
      newInput.classList.add('visually-hidden');
      newInput.classList.add('page__checkbox');

      var checkboxIndicator = document.createElement('span');
      checkboxIndicator.classList.add('page__checkbox-indicator')
      checkboxLabel.appendChild(checkboxIndicator);

      inputContainer.appendChild(checkboxLabel);
    } else {
      inputContainer.appendChild(createLabel(data, input[i].id, input[i].label));
      inputContainer.appendChild(newInput);
    }

    form.appendChild(inputContainer);
  }
}

function createDate(data, form) {
  var fragment = document.createDocumentFragment();
  var inputContainer = document.createElement('div');

  inputContainer.classList.add('page__input-container');
  inputContainer.classList.add('page__data-container');
  inputContainer.appendChild(createLabel(data, data.date[0].id, data.date[0].label));

  for (var i = 0; i < 3; i++) {
    var newInput = document.createElement('input');
    newInput.type = 'number';
    newInput.min = data.date[i+1].min;
    newInput.max = data.date[i+1].max;
    newInput.step = '1';
    newInput.name = data.date[i+1].name;
    newInput.id = data.date[i+1].id;
    newInput.placeholder = data.date[i+1].placeholder;
    if (data.date[i+1].hasOwnProperty('required')) {
      newInput.required = 'required';
    }
    newInput.classList.add('page__input');
    newInput.classList.add('page__data');

    inputContainer.appendChild(newInput);
  }
  fragment.appendChild(inputContainer);
  form.appendChild(fragment);
}

// Генератор селектов
function createSelect(data, select, form) {
  var fragment = document.createDocumentFragment();
  var inputContainer = document.createElement('div');
  var newSelect = document.createElement('select');

  inputContainer.classList.add('page__input-container');
  inputContainer.classList.add('page__select-container');
  inputContainer.appendChild(createLabel(data, select[0].id, select[0].label));

  newSelect.name = select[0].name;
  newSelect.id = select[0].id;
  newSelect.classList.add('page__input');
  newSelect.classList.add('page__select');

  for (var value in select[1]) {
    var newOption = document.createElement('option');
    newOption.value = select[1][value];
    newOption.text = select[2][value];
    newSelect.appendChild(newOption);
  }

  inputContainer.appendChild(newSelect);
  fragment.appendChild(inputContainer);
  form.appendChild(fragment);
}

function createForm(data) {
  var container = document.createElement('div');
  container.classList.add('page__container');
  document.body.appendChild(container);

  var form = document.createElement('form');
  form.action = data.submit.url;
  form.method = data.submit.method;
  form.classList.add('page__form');
  container.appendChild(form);

  createInput(data, data.inputs, data.inputs.length, form);

  createDate(data, form);
  createSelect(data, data.status_select, form);
  createSelect(data, data.education_select, form);
  createInput(data, data.checkbox, data.checkbox.length, form);

  var submit = document.createElement('button');
  submit.textContent = data.submit.text;
  submit.type = 'submit';
  submit.classList.add('page__submit');
  form.appendChild(submit);
  addClasses();
}

// Добавляет классы со стилями
function addClasses() {
  var previousSurname = document.querySelector('.page__previous-input');
  var previousSurnameInput = previousSurname.querySelector('input');
  var previousCheckbox = document.querySelector('input[name=previous_checkbox]');
  var labels = document.querySelectorAll('label');
  var checkboxContainers = document.querySelectorAll('.page__checkbox-container');
  var checkboxes = document.querySelectorAll('.page__checkbox');
  var agreementLabel = document.querySelector('label[for=agreement]');

  agreementLabel.classList.add('page__agreement-label');

// Открывает и прячет поле для прошлой фамилии
  previousSurname.classList.add('visually-hidden');
  previousSurnameInput.removeAttribute('required');
  previousSurnameInput.disabled = true;

  previousCheckbox.addEventListener('change', function () {
    previousSurname.classList.toggle('visually-hidden');
    if (previousCheckbox.checked == false) {
      previousSurnameInput.removeAttribute('required');
      previousSurnameInput.disabled = true;
    } else {
      previousSurnameInput.required = true;
      previousSurnameInput.disabled = false;
    }
  });

  for (var i = 0; i < labels.length; i++) {
    labels[i].classList.add('page__label');
  }
}
