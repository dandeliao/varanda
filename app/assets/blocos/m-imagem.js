import MalocaElement from "./MalocaElement.js";
import { serverFetch } from "../utils/fetching.js";

class MImagem extends MalocaElement {
    constructor() {

        let html = `
        <div class="imagem">

            <slot></slot>

        </div>
        `
        super(html);

    }

    async renderizar(estado) {

        while (this.lastChild) {
			this.removeChild(this.lastChild);
		}

		this.style.display = 'inline-block';

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
		let imagemId = this.getAttribute('numero');

		let elImg = document.createElement('img');

		elImg.src = `http://localhost:4000/${tipoOrigem}s/${idOrigem}/objetos/imagem?id=${imagemId}`;
		elImg.style.maxWidth = '100%';

		let res = await serverFetch(`/${tipoOrigem}s/${idOrigem}/objetos/imagem?id=${imagemId}&info=true`, 'GET');
		let imagemInfo = await res.json();

		elImg.setAttribute('alt', imagemInfo.descricao);
		elImg.setAttribute('title', imagemInfo.descricao);

		this.appendChild(elImg);

    }
}

window.customElements.define('m-imagem', MImagem);