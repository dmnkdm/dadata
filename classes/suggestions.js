export default class FormSuggestions {
    constructor(elem) {
        this.elem = elem;
    }
    
    reset() {
        this.elem.innerHTML = '';
        this.elem.style.display = 'none';
    }
    
    set(suggestions) {
        this.reset();
        if (suggestions.length) {
            suggestions.forEach((value)=>this.add(value));
            this.elem.style.display = 'block';
        }
    }
    
    add(value) {
        const element = document.createElement('li');
        element.innerHTML = value.value + ' <span class="suggestions-item-inn">ИНН:' +value.data.inn+'</span>';
        this.elem.append(element);
    }
}