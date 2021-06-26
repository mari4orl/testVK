'use strict';

export function generator() {
  fetch('data.json')
  .then((response) => {
    return response.json();
  })
  .then(createForm);
}

/**
 * Генератор лейблов.
 * @function
 * @param {object} data - Данные для генерации.
 * @param {string} id - id для лейбла.
 * @param {string} label - текстовое содержимое лейбла.
 * @return {Element} html элемент.
 */
function createLabel(data, id, label) {
  var fragment = document.createDocumentFragment();
  var newLabel = document.createElement('label');

  newLabel.setAttribute('for', id);
  newLabel.textContent = label;
  return newLabel
}

/**
 * Генератор input'ов.
 * @function
 * @param {object} data - Данные для генерации полей.
 * @param {object} input - Объект с данными для input.
 * @param {number} number - Количество input'ов.
 * @param {object} form - Форма-контейнер для input'ов.
 */
function createInput(data, input, number, form) {
  for (var i = 0; i < number; i++) {
    var inputContainer = document.createElement('div');
    inputContainer.classList.add('page__input-container');

    var newInput = document.createElement('input');
    newInput.type = input[i].type;
    newInput.id = input[i].id;
    newInput.name = input[i].name;

    if (input[i].hasOwnProperty('placeholder')) {
      newInput.placeholder = input[i].placeholder;
    }

    // Создаёт дополнительное поле для прошлой фамилии
    if (input[i].name === 'first_name') {
      createInput(data, data.previous_surname, data.previous_surname.length, form);
    }

    // Классы для дополнительных полей
    if (input[i].name === 'previous_checkbox') {
      inputContainer.classList.add('page__previous-checkbox');
    }
    if (input[i].name === 'previous_surname') {
      inputContainer.classList.add('page__previous-input');
    }

    if (input[i].hasOwnProperty('required')) {
      newInput.required = 'required';
    }


    // Атрибуты для телефона
    if (input[i].type === 'tel') {
      newInput.setAttribute('minlength', '10');
      newInput.setAttribute('maxlength', '18');
      newInput.setAttribute('data-rules', 'tel');
      inputContainer.classList.add('page__tel-container');
    }

    newInput.classList.add('page__input');

    // Классы для чекбоксов прочее
    if (input[i].type === 'checkbox') {
      let checkboxLabel = createLabel(data, input[i].id, input[i].label);
      checkboxLabel.classList.add('page__label-checkbox');
      checkboxLabel.appendChild(newInput);

      newInput.value = input[i].value;
      inputContainer.classList.add('page__checkbox-container');
      newInput.classList.add('visually-hidden');
      newInput.classList.add('page__checkbox');

      let checkboxIndicator = document.createElement('span');
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

/**
 * Генератор полей даты.
 * @function
 * @param {object} data - Данные для генерации полей.
 * @param {object} form - Форма-контейнер для созданных полей.
 */
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


/**
 * Генератор селектов.
 * @function
 * @param {object} data - Данные для генерации полей.
 * @param {object} select - Объект с данными для select.
 * @param {object} form - Форма-контейнер для созданных полей.
 */
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


/**
 * Генератор textarea.
 * @function
 * @param {object} data - Данные для генерации полей.
 * @param {object} area - Объект с данными для textarea.
 * @param {number} number - Количество textarea.
 * @param {object} form - Форма-контейнер для созданных полей.
 */
function createTextarea(data, area, number, form) {
  for (var i = 0; i < number; i++) {
    var areaContainer = document.createElement('div');
    areaContainer.classList.add('page__input-container');

    var newArea = document.createElement('textarea');
    newArea.id = area[i].id;
    newArea.name = area[i].name;

    // Добавляет размерность, если задана
    if (area[i].hasOwnProperty('rows')) {
      newArea.rows = area[i].rows;
    }
    if (area[i].hasOwnProperty('cols')) {
      newArea.cols = area[i].cols;
    }
    newArea.classList.add('page__input');
    areaContainer.appendChild(createLabel(data, area[i].id, area[i].label));
    areaContainer.appendChild(newArea);
  }

  form.appendChild(areaContainer);
}

/**
 * Генератор формы и её содержимого.
 * @function
 * @param {object} data - Данные для генерации полей.
 */
function createForm(data) {

  // Создаёт контейнер
  var container = document.createElement('div');
  container.classList.add('page__container');
  document.body.appendChild(container);

  // Сама форма
  var form = document.createElement('form');
  form.action = data.submit.url;
  form.method = data.submit.method;
  form.classList.add('page__form');
  form.insertAdjacentHTML('afterbegin', '<div class="page__theme-button" id="theme-button" aria-label="Изменить тему" tabindex="0"></div>');
  container.appendChild(form);

  // Вызов всех генераторов
  createInput(data, data.inputs, data.inputs.length, form);
  createDate(data, form);
  createSelect(data, data.status_select, form);
  createSelect(data, data.education_select, form);
  createTextarea(data, data.textarea, data.textarea.length, form);
  createInput(data, data.checkbox, data.checkbox.length, form);

  // Создаёт submit
  var submit = document.createElement('button');
  submit.textContent = data.submit.text;
  submit.type = 'submit';
  submit.classList.add('page__submit');
  form.appendChild(submit);

  addClasses();

  //Задаёт переключение темы
  let btnTheme = document.getElementById("theme-button");
  let themeStyle = document.getElementById("theme-link");

  btnTheme.addEventListener("click", function () { ChangeTheme(themeStyle); });

  var input = document.querySelector('input[data-rules]');
  
  //Обработчик при выходе из поля ввода телефона
  input.addEventListener ('blur', function() {
    var telContainer = document.querySelector('.page__tel-container');
    var input = document.querySelector('input[data-rules]');

    if (!validatePhone(input.value)){
      addInvalid(input, telContainer);
    } else {
      addValid(input);
    }
  });

  // Обработчик при отправке формы
  form.addEventListener('submit', function(evt) {
    evt.preventDefault();
    var telContainer = document.querySelector('.page__tel-container');
    var input = document.querySelector('input[data-rules]');

    if (!validatePhone(input.value)){
      addInvalid(input);
    } else {
      addValid(input);
      form.submit();
    }
  });
}

const errorMessageHTML = '<p class="error-message">Пожалуйста, введите номер в указанном формате</p>';
const regex = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;

/**
 * Добавляет стилизацию при валидном номере.
 * @function
 * @param {object} input - Поле, которое валидируем.
 */
function addValid(input) {
  input.classList.remove('invalid');
  input.classList.add('valid');
  var errorMessage = document.querySelector('.error-message');
  if (errorMessage) {
    errorMessage.parentNode.removeChild(errorMessage);
  }
}

/**
 * Добавляет стилизацию при невалидном номере.
 * @function
 * @param {object} input - Поле, которое валидируем.
 * @param {object} telContainer - Контейнер, куда помещаем сообщение об ошибке.
 */
function addInvalid(input, telContainer) {
  input.classList.remove('valid');
  input.classList.add('invalid');
  var errorMessage = document.querySelector('.error-message');
  if (!errorMessage) {
    telContainer.insertAdjacentHTML('afterend', errorMessageHTML);
  }
}

/**
 * Проверяет валидность номера телефона.
 * @function
 * @param {string|number} phone - Номер, который порверяем.
 * @return {boolean} результат проверки.
 */
function validatePhone(phone){
  return regex.test(phone);
}

/**
 * Добавляет классы со стилями и интерактивность.
 * @function
 */
function addClasses() {
  var previousSurname = document.querySelector('.page__previous-input');
  var previousSurnameInput = previousSurname.querySelector('input');
  var previousCheckbox = document.querySelector('input[name=previous_checkbox]');
  var labels = document.querySelectorAll('label');
  var checkboxContainers = document.querySelectorAll('.page__checkbox-container');
  var checkboxes = document.querySelectorAll('.page__checkbox');
  var agreementLabel = document.querySelector('label[for=agreement]');
  var textarea = document.querySelector('textarea');


  textarea.classList.add('page__textarea');
  agreementLabel.classList.add('page__agreement-label');

// Открывает и прячет поле для прошлой фамилии
  previousSurname.classList.add('visually-hidden');
  previousSurnameInput.disabled = true;

  previousCheckbox.addEventListener('change', function () {
    previousSurname.classList.toggle('visually-hidden');
    if (previousCheckbox.checked === false) {
      previousSurnameInput.disabled = true;
    } else {
      previousSurnameInput.disabled = false;
    }
  });

  for (var i = 0; i < labels.length; i++) {
    labels[i].classList.add('page__label');
  }
}

/**
 * Меняет тему.
 * @function
 * @param {object} link - элемент HTML подключающий стили.
 */
function ChangeTheme(link) {
  let lightTheme = "styles/light.css";
  let darkTheme = "styles/dark.css";

  var currTheme = link.getAttribute("href");
  var theme = "";

  if(currTheme == lightTheme)
  {
 	 currTheme = darkTheme;
 	 theme = "dark";
  }
  else
  {
 	 currTheme = lightTheme;
 	 theme = "light";
  }

  link.setAttribute("href", currTheme);
}
