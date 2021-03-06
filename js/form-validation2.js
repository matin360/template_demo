'use strict'

document.addEventListener('DOMContentLoaded', () => {
    applyMask('input[type="tel"]', '+(994)99-999-9999');
    const validator =  new ValidatorForm('form-consult');
    document.getElementById('submit-form').addEventListener('click', (e) => {
        e.preventDefault();
        if (validator.IsValid()) {
            let data = new FormData(validator.getForm);
            data = Object.fromEntries(data);
            ajaxSend(data);
        }
    });
    
    const inputs = validator._getFormInputs();
    for (let inp of inputs) {
        inp.addEventListener('change', (e) => {
            e.preventDefault();
            validator.IsValid();
        });
    }
});

function applyMask(selector, mask) {
    const inp = document.querySelector(selector);
    const inpMask = new Inputmask(mask);
    inpMask.mask(inp);
}

class ValidatorForm{
    #form;
    constructor(formId){
        this.#form = document.getElementById(formId);
    }
    // form element
    #patterns = {
        'email': /^([a-zA-Z0-9_.]+)@([a-zA-Z0-9_.]+)\.([a-zA-Z]{2,5})$/,
        'tel': /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/
    }
    get getForm(){
        return this.#form;
    }
    _definePattern(inputId){
        let pattern = this.#patterns[inputId];
        if (pattern =! null || pattern != '') {
            return this.#patterns[inputId];
        } else return '';
    }
    _getFormInputs(){
        return this.#form.getElementsByClassName('form-input');
    }

    _IsEmpty(input) {
        if (input != null) {
            let isEmptyElm = false;
            if (input.value === '' || input.value === null) {
                isEmptyElm = true;
            }
            return isEmptyElm;
        }
        else{
            throw new Error();
        }
    }

    _isPatternMathcing(input, pattern) {
        if (input != null && pattern != '') {
            let isValid = pattern.test(input.value) ? true : false;
            return isValid;
        } 
    }

    _getErrorMessage(input, pattern = '') {
        let msg = '';
        if (input != null) {
            if(pattern === '' || input.value === '') {
                if(this._IsEmpty(input)){
                    msg = `Please, fill out ${input.id} field`;
                }
            }
            else {
                if(!this._isPatternMathcing(input, RegExp(pattern))){
                    msg = `Please, fullfil ${input.id} field correctly. Input is wrong!`;
                }
            }
        }
        return msg;
    }
  

    _displayError(input, message) {
        document.getElementById(input.id+'-lbl').innerHTML = message;
        this._setStyleToElms(document.getElementById(input.id+'-lbl'), '#ff0000', '10px');
    }

    _setStyleToElms(elm, color, fontSize) {
        elm.style.color = color;
        elm.style.fontSize = fontSize;
    }

    IsValid(){
        let isValid = false;
        const inputs = this._getFormInputs();
        for(let input of inputs){
            let msg = this._getErrorMessage(input, this._definePattern(input.type));
            if (msg === '') {
                isValid = true;
                this._displayError(input, msg);
            } else {
                this._displayError(input, msg);
            }
                
        }
    }

}

const ajaxSend = (formData) => {
   fetch('data/data.json', { // файл-обработчик 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // отправляемые данные 
        },
        body: JSON.stringify(formData)
    })
        .then(response => alert('Сообщение отправлено'))
        .catch(error => console.error(error))
};
