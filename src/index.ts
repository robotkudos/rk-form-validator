import {RKFormValidator, Validator, IElement} from "./RKFormValidator";

const rkFormValidator = new RKFormValidator();

rkFormValidator.addValidator(new Validator(
    {id: 'sel', title: 'My Select', type: 'select'},
    ['required'],
    {id: 'err'},
    'is-danger'));

rkFormValidator.addValidator(new Validator(
    {id: 'myCheck', title: 'My Checkbox', type: 'checkbox'},
    ['required'],
    {id: 'myCheckErr'},
    'is-danger'
));

rkFormValidator.addValidator(new Validator(
    {id: 'myText', title: 'My Text', type: 'text'},
    ['required', 'min:3'],
    {id: 'myTextErr'},
    'is-danger'
));

rkFormValidator.addValidator(new Validator(
    {id: 'number1', title: 'Number 1'},
    ['required'],
    {id: 'numberErr'},
    'is-danger'
));
rkFormValidator.addValidator(new Validator(
    {id: 'number2', title: 'Number 2'},
    ['required|Where is {el} dude!', 'compare:eq:number1|{el} and {el2} don\'t match.'],
    {id: 'numberErr2'},
    'is-danger'
));

rkFormValidator.addValidator(new Validator(
    {id: 'no'},
    ['required|dude! add the no', 'number|dude?, this is not a number!'],
    {id: 'noErr'},
    'is-danger'
));

const check = document.getElementById('check');

check.addEventListener('click', e => {
    // console.log(rkFormValidator.getValidator('pass'));
    // console.log(rkFormValidator.getValidator('pass').errors);
    rkFormValidator.checkAll();
});

