import { estadoPadrao } from "../utils/state.js";
import MalocaElement from "./MalocaElement.js";

class MFundo extends MalocaElement {
    constructor() {
        let html = `
        <div class="bloco">
			<div id="fundo">
            	<slot></slot>
			</div>
			<style>
				div {
					height: 100%;
					width: 100%;
				}
			</style>

        </div>
        `;

        super(html);
    }

	renderizar(estado) {
		
		let tipoOrigem = estado.view.tipo;
		let idOrigem = estado.view.id;

		let comunidade = this.getAttribute('comunidade');
		let pessoa = this.getAttribute('pessoa');
		if (comunidade) {
			tipoOrigem = 'comunidade';
			idOrigem = comunidade;
		} else if (pessoa) {
			tipoOrigem = 'pessoa';
			idOrigem = pessoa;
		}

		let fundo = this.shadowRoot.querySelector('#fundo');
		let	url = `url("${estadoPadrao.urlServidor}/${tipoOrigem}s/${idOrigem}/objetos/fundo")`;

		fundo.style.backgroundImage = url;
    }
}

window.customElements.define('m-fundo', MFundo);