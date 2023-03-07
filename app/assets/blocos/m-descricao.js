import MalocaElement from "./MalocaElement.js";
import { serverFetch } from "../utils/fetching.js";

class MDescricao extends MalocaElement {
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

window.customElements.define('m-descricao', MDescricao);