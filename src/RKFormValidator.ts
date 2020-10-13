import {fadeIn, fadeOut } from './fade';
import isEmail from 'validator/lib/isEmail';

export type fieldType = 'text' | 'select' | 'checkbox';

export interface IElement {
    id: string,
    title?: string,
    type?: fieldType
}

export class Validator {
    private _isDirty: boolean = false;
    private _isTouched: boolean = false;
    private _value: string;
    private _errors: string[];
    private _domEl;


    constructor(
        public el: IElement,
        public validations: string[],
        public errEl?: IElement,
        public errClass?: string,
        public compareEl?: IElement
    ) {
        if (el.title === undefined)
            el.title = el.id;

        const domEl = document.getElementById(this.el.id);
        if (domEl === undefined)
            throw Error(`${this.el.id} is undefined.`);

        this._domEl = domEl;

        this._domEl.addEventListener("focusin", e => {
            this._isTouched = true;
        });
        if (!this.el.type) this.el.type = 'text';
        switch (this.el.type) {
            case 'text':
                this._domEl.addEventListener('keydown', e => {
                    this._isDirty = true;
                });
                break;
            case 'select':
            case 'checkbox':
                this._domEl.addEventListener('change', e => {
                    this._isDirty = true;
                    this.checkForErrors();
                });
                break;
        }
        this._domEl.addEventListener('focusout', e => {
            if (!this._isDirty) return;
            this.checkForErrors();
        });
    }

    private getErrMessage(validation: string) {
        const validationSplit = validation.split('|');
        // custom message
        if (validationSplit.length > 1 && validation.substr(0, 7) !== 'compare') {
            return validationSplit[1].replace('\{el\}', this.el.title);
        }
        if (validation.substr(0, 8) === 'required') {
            return `${this.el.title} is required.`;
        } else if (validation.substr(0, 5) === 'email') {
            return `${this.el.title} is not a valid email.`;
        } else if (validation.substr(0, 3) === 'min') {
            const min = validation.split(':');
            const s = (parseInt(min[1]) > 1) ? 's' : '';
            return `${this.el.title} must be at least ${min[1]} letter${s}.`;
        } else if (validation.substr(0, 3) === 'max') {
            const min = validation.split(':');
            const s = (parseInt(min[1]) > 1) ? 's' : '';
            return `${this.el.title} cannot be more than ${min[1]} letter${s}.`;
        } else if (validation.substr(0, 7) === 'include') {
            const include = validation.split(':');
            const s = (include[2].length > 1) ? 'these' : 'this';
            const chars = include[2];
            return `${this.el.title} must contain at least ${include[1]} of ${s} letters: ${chars}`;
        } else if (validation.substr(0, 7) === 'compare') {
            const compare = validationSplit[0].split(':');
            const compareType = compare[1];
            let compareTypeLong;
            const compareElId = compare[2];
            const compareElTitle = compare.length > 3 ? compare[3] : compareElId;

            //custom message
            if (validationSplit.length > 1) {

                console.log(validationSplit[1]);
                let retMessage = validationSplit[1].replace('{el}', this.el.title);
                console.log(retMessage);
                retMessage = retMessage.replace('{el2}', compareElTitle);
                return retMessage;
            }

            switch(compareType) {
                case 'eq':
                    compareTypeLong = 'equal to';
                    break;
                case 'ge':
                    compareTypeLong = 'greater than or equal';
                    break;
                case 'gt':
                    compareTypeLong = 'greater than';
                    break;
                case 'le':
                    compareTypeLong = 'less than or equal';
                    break;
                case 'lt':
                    compareTypeLong = 'less than';
                    break;
                case 'ne':
                    compareTypeLong = 'not equal';
                    break;
            }
            return `${this.el.title} must be ${compareTypeLong} ${compareElTitle}.`;
        } else if (validation === 'number') {
            return `${this.el.title} must be a number.`;

        }
    }

    public get isDirty() {
        return this._isDirty;
    }

    public get value() {
        return this._value;
    }

    public get errors() {
        return this._errors;
    }

    public hasError(): boolean {
        return this._errors.length > 0;
    }

    public get isTouched() {
        return this._isTouched;
    }

    public checkForErrors() {
        this._errors = [];
        this.validations.forEach(validation => {
            const result = this.check(validation);
            if (!result.passed) {
                this._errors.push(result.err);
            }
        });
        this.showErrors();
    }

    private showErrors() {
        if (this._errors.length) {
            if (this.errEl) {
                const domErrEl:HTMLElement = document.getElementById(this.errEl.id);
                if (domErrEl === undefined)
                    throw Error(`${this.errEl.id} is not found.`);

                domErrEl.innerText = this._errors[0];
                fadeIn(domErrEl);
            }

            if (this.errClass) {
                this._domEl.classList.add(this.errClass);
            }
        } else {
            if (this.errEl) {
                const domErrEl:HTMLElement = document.getElementById(this.errEl.id);
                if (domErrEl === undefined)
                    throw Error(`${this.errEl.id} is not found.`);

                fadeOut(domErrEl);
            }

            if (this.errClass) {
                this._domEl.classList.remove(this.errClass);
            }

        }

    }

    private check(validation: string): {passed: boolean, err: string|null} {
        const validationCheck = validation.split('|')[0];
        if (validationCheck === 'required') {
            switch (this.el.type) {
                case "text":
                    if (this._domEl.value.length === 0) {
                        return {passed: false, err: this.getErrMessage(validation)};
                    }
                    break;
                case "select":
                    if (this._domEl.selectedIndex === 0) {
                        return {passed: false, err: this.getErrMessage(validation)};
                    }
                    break;
                case "checkbox":
                    if (this._domEl.checked === false) {
                        return {passed: false, err: this.getErrMessage(validation)};
                    }
                    break;
            }
        } else if (validationCheck === 'email') {
            if (!isEmail(this._domEl.value)) {
                return {passed: false, err: this.getErrMessage(validation)};
            }
        } else if (validationCheck.substr(0, 3) === 'min') {
            const min = validationCheck.split(':');
            if (min.length < 2)
                throw Error('min is not in correct format');
            if (this._domEl.value.length < min[1]) {
                return {passed: false, err: this.getErrMessage(validation)}
            }
        } else if (validationCheck.substr(0, 3) === 'max') {
            const max = validationCheck.split(':');
            if (max.length < 2)
                throw Error('max is not in correct format');
            if (this._domEl.value.length > max[1]) {
                return {passed: false, err: this.getErrMessage(validation)}
            }

        } else if (validationCheck.substr(0, 7) === 'include') {
            const include = validationCheck.split(':');
            const reqCount = parseInt(include[1]);
            const reqChars = include[2].split('');
            let count: number = 0;
            const typedChars = this._domEl.value.split('');

            typedChars.forEach(char => {
                reqChars.some(c => c == char) && count++;
            });

            if (count < reqCount) {
                return {passed: false, err: this.getErrMessage(validation)};
            }
        } else if (validationCheck.substr(0, 7) === 'compare') {
            const compare = validationCheck.split(':');
            const compareType = compare[1];
            let compareTypeLong;
            const compareElId = compare[2];
            const compareElTitle = compare.length > 3 ? compare[3] : compareElId;
            const domCompareEl:HTMLInputElement | HTMLSelectElement = <HTMLSelectElement|HTMLInputElement>document.getElementById(compareElId);

            let value1: number, value2: number;
            switch(compareType) {
                case 'eq':
                    if (this._domEl.value != domCompareEl.value) {
                        return {passed: false, err: this.getErrMessage(validation)};
                    }
                    break;
                case 'ge':
                    value1 = parseInt(this._domEl.value);
                    value2 = parseInt(domCompareEl.value);
                    if ((value1 && value2) && !(value1 >= value2)) {
                        return {passed: false, err: this.getErrMessage(validation)};
                    }
                    break;
                case 'gt':
                    value1 = parseInt(this._domEl.value);
                    value2 = parseInt(domCompareEl.value);
                    if ((value1 && value2) && !(value1 > value2)) {
                        return {passed: false, err: this.getErrMessage(validation)};
                    }
                    break;
                case 'le':
                    value1 = parseInt(this._domEl.value);
                    value2 = parseInt(domCompareEl.value);
                    if ((value1 && value2) && !(value1 <= value2)) {
                        return {passed: false, err: this.getErrMessage(validation)};
                    }
                    break;
                case 'lt':
                    value1 = parseInt(this._domEl.value);
                    value2 = parseInt(domCompareEl.value);
                    if ((value1 && value2) && !(value1 < value2)) {
                        return {passed: false, err: this.getErrMessage(validation)};
                    }
                    break;
                case 'ne':
                    value1 = parseInt(this._domEl.value);
                    value2 = parseInt(domCompareEl.value);
                    if ((value1 && value2) && !(value1 != value2)) {
                        return {passed: false, err: this.getErrMessage(validation)};
                    }
                    break;
            }
        } else if (validationCheck === 'number') {
            if (isNaN(this._domEl.value)) {
                return {passed: false, err: this.getErrMessage(validation)};
            }
        }
        return {passed: true, err: null};
    }
}

export class RKFormValidator {
    private _validators: Validator[] = [];
    private _errors: string[] = [];

    addValidator(validator: Validator) {
        this._validators.push(validator);
    }

    public setErrors(errors) {
        this._errors = errors;
    }

    public get errors() {
        return this._errors;
    }
    public hasErrors(): boolean {
        if (this._validators.some(validator => validator.hasError())) {
            return true;
        } else {
            return false;
        }
    }

    checkAll() {
        this._validators.forEach(validator => validator.checkForErrors());
    }

    public getValidator(id: string) {
        const validator = this._validators.find(validator => validator.el.id === id);
        if (validator === undefined) {
            throw Error('Validator "' + id + '" not found');
        }
        return validator;
    }
}

