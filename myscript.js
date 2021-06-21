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

function createInput(data, number, form) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < number; i++) {
    var newLabel = document.createElement('label');

    newLabel.setAttribute('for',data.inputs[i].id);
    newLabel.textContent = data.inputs[i].label;

    var newInput = document.createElement('input');
    newInput.type = data.inputs[i].type;
    newInput.id = data.inputs[i].id;

    fragment.appendChild(newLabel);
    fragment.appendChild(newInput);

  }
    form.appendChild(fragment);
}

function createDate(data, form) {
  var fragment = document.createDocumentFragment();
  var newLabel = document.createElement('label');
  newLabel.textContent = data.date[0].label;
  fragment.appendChild(newLabel);
  
  for (var i = 0; i < 3; i++) {
    var newInput = document.createElement('input');
    newInput.type = 'number';
    newInput.min = data.date[i+1].min;
    newInput.max = data.date[i+1].max;
    newInput.step = '1';
    newInput.name = data.date[i+1].name;
    fragment.appendChild(newInput);
  }
  form.appendChild(fragment);

}

function createForm(data) {
  console.log(data);

  var form = document.createElement('form');
  form.action = data.submit.url;
  document.body.appendChild(form);

  createInput(data, data.inputs.length, form);
  createDate(data, form);

  var submit = document.createElement('button');
  submit.textContent = data.submit.text;
  document.body.appendChild(submit);
}
