import MalocaElement from "./MalocaElement.js";
import { serverFetch } from "../utils/fetching.js";

class MForum extends MalocaElement {
    constructor() {

        let html = `
        <div class="forum">

            <slot></slot>

        </div>
        `
        super(html);

    }

    async renderizar(estado, noEvent) {

        while (this.lastChild) {
			this.removeChild(this.lastChild);
		}

        let tipo = estado.view.tipo;
        let id = estado.view.id;
        let nomeForum = this.getAttribute('nome');

		let elBloco = document.createElement('m-bloco');

		// cria cabeçalho
		let elNomeForum = document.createElement('h2');
		elNomeForum.innerText = nomeForum;
		elBloco.appendChild(elNomeForum);
		this.appendChild(elBloco);
		this.appendChild(document.createElement('br'));

		let res = await serverFetch(`/${tipo}s/${id}/objetos/topicos?forum=${nomeForum}`, 'GET');
		let topicos = await res.json();


		if (topicos.length > 0) {
			
			for (let i = 0; i < topicos.length; i++) {

				let topico = topicos[i];

				// cria elemento com o tópico
				let elTopico = document.createElement('m-topico');
				let topicoId;
				topicoId = topico.topico_id;
				elTopico.setAttribute('numero', topicoId);
				elTopico.setAttribute(`${tipo}`, id); // comunidade=id-da-comunidade
				elTopico.style.padding = '1rem 0';
				elTopico.style.borderBottom = '1px solid var(--cor-destaque)';
				if (i === 0) {
					elTopico.style.borderTop = '1px solid var(--cor-destaque)';
				}

				elBloco.appendChild(elTopico);
				elBloco.appendChild(document.createElement('br'));

				// renderiza tópico
				elTopico.renderizar(estado);
			}

		} else {
			console.log('Não há topicos para mostrar');

			let elBloco = document.createElement('m-bloco');
			let aviso = document.createElement('p');
			aviso.innerText = 'Não há topicos para mostrar';
			elBloco.appendChild(aviso);
			this.appendChild(elBloco);
			this.appendChild(document.createElement('br'));
		}
    }
}

window.customElements.define('m-forum', MForum);