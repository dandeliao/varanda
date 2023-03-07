export default class extends HTMLElement {

    constructor(html) {
        super();
        let template = document.createElement('template');
        template.innerHTML = html;
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.firstElementChild.cloneNode(true));
        this.loadScripts();
    }

    loadScripts () {
        Array.from(this.shadowRoot.firstElementChild.getElementsByTagName("script"))
        .forEach(oldScript => {
            const newScript = document.createElement("script");
            Array.from(oldScript.attributes)
                .forEach(attr => newScript.setAttribute(attr.name, attr.value));
            newScript.appendChild(document.createTextNode(oldScript.innerHTML));
            oldScript.parentNode.replaceChild(newScript, oldScript);
        });
    }
}