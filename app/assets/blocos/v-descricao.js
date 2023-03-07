import VarandaElement from "./VarandaElement.js";
import { serverFetch } from "../utils/fetching.js";

class VDescricao extends VarandaElement {
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
		
		let spanDescricao = this.shadowRoot.querySelector('span');
		let	url = `/${estado.view.tipo}s/${estado.view.id}`;

		serverFetch(url, 'GET')
        .then(res => res.json())
        .then(dados => {
            if (dados.descricao) {
				spanDescricao.innerText = dados.descricao;
			}
		});
    }
}

window.customElements.define('v-descricao', VDescricao);