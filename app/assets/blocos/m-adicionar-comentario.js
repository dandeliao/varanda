import MalocaElement from "./MalocaElement.js";
import { serverFetch } from "../utils/fetching.js";
import { renderBlocos } from "../utils/rendering.js";

class MAdicionarComentario extends MalocaElement {
    constructor() {

        let html = `
        <div class="adicionar-comentario">

            <slot></slot>

        </div>
        `
        super(html);

    }

    async renderizar(estado, noEvent) {

        while (this.lastChild) {
			this.removeChild(this.lastChild);
		}

        const textoId = this.getAttribute('texto');
		const imagemId = this.getAttribute('imagem');
		const topicoId = this.getAttribute('topico');
		let midiaTipo;
		let midiaId;
		if (textoId) {
			midiaTipo = 'texto';
			midiaId = textoId;
		} else if (imagemId) {
			midiaTipo = 'imagem';
			midiaId = imagemId;
		} else if (topicoId) {
			midiaTipo = 'topico';
			midiaId = topicoId;
		}

		const comunidadeId = this.getAttribute('comunidade') ? this.getAttribute('comunidade') : estado.view.id;

		// cria form para adicionar novo comentário
		let formAdicionar = document.createElement('form');
		formAdicionar.innerHTML = `
			<label for="comentario" hidden>novo comentário</label>
			<textarea id="novo-comentario" placeholder="novo comentário" name="comentario" required style="width: 100%; min-height: 6rem; background-color: var(--cor-fundo); color: var(--cor-fonte-view);"></textarea>
			<br>
			<br>
			<button type="submit">comentar</button>
			`;
		formAdicionar.style.margin = '1rem 0';
		formAdicionar.classList.add('comentario');
		this.appendChild(formAdicionar);

		if (!noEvent) {
			formAdicionar.addEventListener('submit', async e => {
				e.preventDefault();
	
				const dados = {
					texto: 	formAdicionar.elements['comentario'].value
				}
	
				serverFetch(`/comunidades/${comunidadeId}/objetos/comentarios?${midiaTipo}=${midiaId}`, 'POST', dados)
					.then(res => res.json())
					.then(data => {            
						renderBlocos(estado);
				});
			});
		}
    }
}

window.customElements.define('m-adicionar-comentario', MAdicionarComentario);