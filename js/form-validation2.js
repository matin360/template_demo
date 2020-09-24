class ValidatorForm{
    #form;
    constructor(formId){
        this.#form = document.getElementById(formId);
    }
    // form element
    #patterns = {
        'email': /^([a-zA-Z0-9_.]+)@([a-zA-Z0-9_.]+)\.([a-zA-Z]{2,5})$/,
        'phone': /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/
    }
    _definePattern(inputId){
        let pattern = this.#patterns[inputId];
        if (pattern =! null && pattern != '') {
            return pattern;
        } else return '';
    }
    _getFormInputs(form){
        return form.getElementsByTagName('input');
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

    _getErrorMessage(input) {
        let msg = '';
        if (input != null) {
            if (pattern === '') {
                if(this._IsEmpty(input)){
                    msg = `Please, fill out ${input.id} field`;
                }
            } else {
                if(this._isPatternMathcing(input, this._definePattern(input.id))){
                    msg = `Please, fullfil ${input.id} field correctly. Input is wrong!`;
                }
            }
        }
        return msg;
    }
  

    _displayError(errorElement, message) {
        errorElement.innerHTML = message;
        _setStyleToElms(errorElement, '#ff0000', '10px');
    }

    _setStyleToElms(elm, color, fontSize) {
        elm.style.color = color;
        elm.style.fontSize = fontSize;
    }

    validate(){
        let inputs = this._getFormInputs(this.#form);
        for(let input of inputs){
            input.addEventListener('change', (e) => {
                e.preventDefault();
               let msg = this._getErrorMessage(input);
               this._displayError(document.getElementById(input.id+'-lbl'), msg);
            }); 
        }
    }

}

document.addEventListener('DOMContentLoaded', () => {
    ValidatorForm; v =  new ValidatorForm('form-consult');
    v.validate();
});