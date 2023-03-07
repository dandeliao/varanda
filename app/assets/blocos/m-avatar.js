import { estadoPadrao } from "../utils/state.js";
import MalocaElement from "./MalocaElement.js";

class MAvatar extends MalocaElement {
    constructor() {
        let html = `
        <div class="bloco">
		
			<img />

            <slot></slot>

            <style>

				img {
					width: 100%;
					border-radius: 4px;
				}
				
				.redondo {
					border-radius: 100%;
				}

            </style>

        </div>
        `;

        super(html);
		this.redondo = true;
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

		let imgAvatar = this.shadowRoot.querySelector('img');
		let	url = `${estadoPadrao.urlServidor}/${tipoOrigem}s/${idOrigem}/objetos/avatar`;

		imgAvatar.setAttribute('src', url);
		imgAvatar.setAttribute('alt', `avatar de ${idOrigem}`);
		imgAvatar.setAttribute('title', `avatar de ${idOrigem}`);
		
		if (this.redondo === true) {
			imgAvatar.classList.add('redondo');
		} else {
			imgAvatar.classList.remove('redondo');
		}

    }

	get redondo() {
		let imgAvatar = this.shadowRoot.querySelector('img');
		if (imgAvatar.classList.contains('redondo')) {
			return true;
		} else {
			return false;
		}
	}

	set redondo(valor) {
		let imgAvatar = this.shadowRoot.querySelector('img');
		if (valor === true) {
			imgAvatar.classList.add('redondo');
		} else {
			imgAvatar.classList.remove('redondo');
		}
	}
}

window.customElements.define('m-avatar', MAvatar);