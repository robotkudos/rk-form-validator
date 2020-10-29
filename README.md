# rk-form-validator

## Install

`npm i --save-dev rk-form-validator`

## Usage

```js
const {RKFormValidator, Validator} = require('rk-form-validator');

const rkFormValidator = new RKFormValidator();)
rkFormValidator.addValidator(new Validator(
    {id: 'email', title: 'Email'},  // el
    ['required', 'email'],          // validations
    {id: 'email-err'},              // errEl
    'is-danger'                     // errClass
));

$('#submit').on('click', e => {
    rkFormValidator.checkAll();
    if (rkFormValidator.hasErrors()) {
        e.preventDefault();
    }
});
```



### Validations

All validations can have `|error message` at the end for custom error message. e.g. `required|Please enter your name`

* `required`
* `email`
* `compare:eq:elId` : `eq`, `ne`, `gt`, `lt`, `ge`, `le`
* `min:8` : Minimum 8 chars
* `max:8` : Max 8 chars
* `include:chars` : chars to include
* `number`

### RKFormValidator Methods

#### addValidator()
    rkFormValidator.addValidator(new Validator(
        el:{id, title},
        validations: string[],
        errEl: {id},
        errClass: string
    ));

#### checkAll()
checks all the elements on the page

#### getValidator(id: string)

returns the validator

#### showErrorsOnPage(el: {id})

shows errors on page in the specified element

#### hasErrors()

### Validator Methods

#### isDirty()

If user typed something or interact with the input

#### isTouched()

#### checkForErrors()

#### hasErrors()

#### 
