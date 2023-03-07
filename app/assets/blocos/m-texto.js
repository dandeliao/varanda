import MalocaElement from "./MalocaElement.js";
import { serverFetch } from "../utils/fetching.js";

class MTexto extends MalocaElement {
    constructor() {

        let html = `
        <div class="texto">

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
		let textoId = this.getAttribute('numero');

		let arquivo = await serverFetch(`/${tipoOrigem}s/${idOrigem}/objetos/texto?id=${textoId}`, 'GET');
		let textinho = await arquivo.text();
		let paragrafos = textinho.split(/\r?\n/); // gera array de parágrafos. A expressão regex identifica quebra de linha
		let elTexto = document.createElement('div');
		paragrafos.forEach(p => {
			let elP = document.createElement('p');
			elP.innerText = p;
			elTexto.appendChild(elP);
		});
		elTexto.style.textAlign = 'justify';

		let res = await serverFetch(`/${tipoOrigem}s/${idOrigem}/objetos/texto?id=${textoId}&info=true`, 'GET');
		let textoInfo = await res.json();

		let elTitulo = document.createElement('h2');
		elTitulo.innerText = textoInfo.titulo;
		elTitulo.style.textAlign = 'center';
		elTitulo.style.marginBottom = '2rem';

		this.appendChild(elTitulo);
		this.appendChild(elTexto);

    }
}

window.customElements.define('m-texto', MTexto);