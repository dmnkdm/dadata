import Suggestions from './suggestions.js';
import DadataRequest from './request.js';

export default class FormSuggestions extends HTMLElement {
    constructor() {
        super();

        let template = document.getElementById("form-template");
        this.attachShadow({mode: "open"}).appendChild(template.content.cloneNode(true));
                
        this.setFormElementsAsProps();
        
        this.inputOrgName = this.shadowRoot.querySelector('.js-input');
        this.inputOrgName.addEventListener('input', () => {this.getData()});
        
        this.sugList = this.shadowRoot.querySelector('.js-suggestions');
        this.sugList.addEventListener('click', (e)=>this.showResult(e));
        this.suggestionsList = new Suggestions(this.sugList);
    }
    
    async getData() {
        if (this.canContinue()) {
            let dadata_request = new DadataRequest();
            let result = await dadata_request.send(this.inputOrgName.value);
            this.showSuggestions(result);
        }
    }
        
    showSuggestions(result) {
        this.suggestions = result.suggestions;
        this.suggestionsList.set(this.suggestions);
    }
    
    showResult(event) {
        if (!event.target.matches('li') && !event.target.parentElement.matches('li')) return;
        
        let target = this.getLiTarget(event);
        let index = this.getLiIndex(target)
        this.resultData = this.suggestions[index].data;
        
        this.setDataToForm();
        this.suggestionsList.reset();
    }
    
    setDataToForm() { 
        if (this.resultData.name) {
            this.name_short.value = this.resultData.name.short_with_opf || "";
            this.name_full.value = this.resultData.name.full_with_opf || "";
            this.inputOrgName.value = this.resultData.name.short_with_opf || "";
        }
        this.inn_kpp.value = this.resultData.inn;
        if (this.resultData.kpp) {
            this.inn_kpp.value+= " / " + this.resultData.kpp;
        }
        if (this.resultData.address) {
            this.address.value = this.resultData.address.value;
        }
        this.type.innerHTML = this.getTypeDescription(this.resultData.type) + " (" + this.resultData.type + ")"; 
    }
        
    getLiTarget(event) {
        let target = event.target;
        if (event.target.parentElement.matches('li')) {
            target = event.target.parentElement;
        }
        return target;
    }
    
    getLiIndex(target) {
        let liArray = [...this.sugList.querySelectorAll('li')];
        return liArray.indexOf(target);
    }
        
    setFormElementsAsProps() {
        const props = ['name_short','name_full', 'inn_kpp', 'address', 'type'];
        for(let prop of props) {
            this[prop] = this.shadowRoot.getElementById(prop);
        }
    }
    
    getTypeDescription(type) {
        const TYPES = {
            'INDIVIDUAL': 'Индивидуальный предприниматель',
            'LEGAL': 'Организация'
        }
        return TYPES[type];
    }
    
    canContinue() {
        return this.inputOrgName.value.length > 0;
    }
}
