import VarandaElement from "./VarandaElement.js";
import { serverFetch } from "../utils/fetching.js";

class VNome extends VarandaElement {
    constructor() {
        let html = `
        <div class="bloco">
		
			<span />

            <slot></slot>

        </div>
        `;

        super(html);
    }

	renderizar(estado) {
		
		let spanNome = this.shadowRoot.querySelector('span');
		let	url = `/${estado.view.tipo}s/${estado.view.id}`;

		serverFetch(url, 'GET')
        .then(res => res.json())
        .then(dados => {
            if (dados.nome) {
				spanNome.innerText = dados.nome;
			}
		});
    }
}

window.customElements.define('v-nome', VNome);