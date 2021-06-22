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
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < number; i++) {
    var inputContainer = document.createElement('div');
    inputContainer.classList.add('page__input-container');
    var newInput = document.createElement('input');
    newInput.type = input[i].type;
    newInput.id = input[i].id;
    newInput.name = input[i].name;

    if ((input[i].name == 'previous_checkbox')||(input[i].name == 'previous_surname')) {
      inputContainer.classList.add('page__previous-surname');
    }

    if (input[i].hasOwnProperty('required')) {
      newInput.required = 'required';
    }

    if (input[i].type == 'tel') {
      newInput.pattern = '^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$';
      newInput.setAttribute('minlength',"10");
      newInput.setAttribute('maxlength',"18");
    }

    inputContainer.appendChild(createLabel(data, input[i].id, input[i].label));
    inputContainer.appendChild(newInput);
    fragment.appendChild(inputContainer);

  }
    form.appendChild(fragment);
}

function createDate(data, form) {
  var fragment = document.createDocumentFragment();
  var inputContainer = document.createElement('div');

  inputContainer.classList.add('page__input-container');
  inputContainer.appendChild(createLabel(data, data.date[0].id, data.date[0].label));

  for (var i = 0; i < 3; i++) {
    var newInput = document.createElement('input');
    newInput.type = 'number';
    newInput.min = data.date[i+1].min;
    newInput.max = data.date[i+1].max;
    newInput.step = '1';
    newInput.name = data.date[i+1].name;
    newInput.id = data.date[i+1].id;
    newInput.required = 'required';

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
  inputContainer.appendChild(createLabel(data, select[0].id, select[0].label));

  newSelect.name = select[0].name;
  newSelect.id = select[0].id;

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
  createInput(data, data.previous_surname, data.previous_surname.length, form);

  createDate(data, form);
  createSelect(data, data.status_select, form);
  createSelect(data, data.education_select, form);
  createInput(data, data.checkbox, data.checkbox.length, form);

  var submit = document.createElement('button');
  submit.textContent = data.submit.text;
  submit.type = 'submit';
  form.appendChild(submit);
  addClasses();
}

// Добавляет классы со стилями
function addClasses() {
  var previousSurname = document.querySelector('.page__previous-surname');
  var previousSurnameInput = document.querySelector('input[name=previous_surname]');
  var previousCheckbox = document.querySelector('input[name=previous_checkbox]');
  var labels = document.querySelectorAll('label');

// Открывает и прячет поле для прошлой фамилии
  previousSurname.classList.add('visually-hidden');
  previousSurnameInput.removeAttribute('required');

  previousCheckbox.addEventListener('change', function () {
    previousSurname.classList.toggle('visually-hidden');
    if (previousCheckbox.checked == false) {
      previousSurnameInput.removeAttribute('required');
    }
  });

  for (var i = 0; i < labels.length; i++) {
    labels[i].classList.add('page__label');
  }

}
