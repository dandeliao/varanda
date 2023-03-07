import MalocaElement from "./MalocaElement.js";
import { serverFetch } from "../utils/fetching.js";
import { renderBlocos } from "../utils/rendering.js";

class MAdicionarTopico extends MalocaElement {
    constructor() {

        let html = `
        <div class="adicionar-topico">

            <slot></slot>

			<style>
				.adicionar-topico {
					display: block;
					padding: 0;
					min-width: 5rem;
					width: 100%;
					text-align: center;
				}
			</style>

        </div>
        `
        super(html);

    }

    renderizar(estado, noEvent) {

		while (this.lastChild) {
			this.removeChild(this.lastChild);
		}

		let nomeForum = this.getAttribute('forum');

        let botaoAdicionar = document.createElement('button');
		botaoAdicionar.style.display = "inline-block";
		botaoAdicionar.style.position = "relative";
		botaoAdicionar.style.maxWidth = "15rem";
		botaoAdicionar.style.width = "100%";
		botaoAdicionar.style.height = "100%";
		botaoAdicionar.innerText = "adicionar tópico";
		this.appendChild(botaoAdicionar);

		if (!noEvent) {
			botaoAdicionar.addEventListener('click', e => {

				let overlay = document.createElement('div');
				overlay.style.display = "block";
				overlay.style.position = "fixed";
				overlay.style.zIndex = "2";
				overlay.style.width = "100%";
				overlay.style.height = "100%";
				overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
				overlay.style.left = "0px";
				overlay.style.top = "0px";
				
				let modalAdicionar = document.createElement('m-bloco');
				modalAdicionar.style.display = "block";
				modalAdicionar.style.position = "fixed";
				modalAdicionar.style.left = "50vw";
				modalAdicionar.style.top = "50vh";
				modalAdicionar.style.transform = "translate(-50%, -50%)";
				modalAdicionar.style.margin = "0 auto";
				modalAdicionar.style.minWidth = "90%";
				modalAdicionar.style.maxWidth = "100%"
				modalAdicionar.style.zIndex = "3";
				
	
				let formAdicionar = document.createElement('form');
				formAdicionar.innerHTML = `
				<h3>Adicionar tópico</h3>
				<br>
				<label for="titulo" hidden>título</label>
				<input type="text" id="titulo-topico" placeholder="Título do tópico" name="titulo" style="width: 100%; font-size: 1rem; background-color: var(--cor-fundo); color: var(--cor-fonte-view);"/>
				<br>
				<br>
				<label for="texto" hidden>texto</label>
				<textarea id="texto-topico" placeholder="Escreva aqui o texto principal do tópico." name="texto" required style="width: 100%; min-height: 16rem; font-size: 1rem; background-color: var(--cor-fundo); color: var(--cor-fonte-view);"></textarea>
				<br>
				<br>
				<br>
				<button type="submit">salvar tópico</button>
				`
				
				modalAdicionar.appendChild(formAdicionar);
				this.appendChild(modalAdicionar);
				this.appendChild(overlay);
	
				overlay.addEventListener('click', e => {
					e.preventDefault();
					while (modalAdicionar.lastChild) {
						modalAdicionar.removeChild(modalAdicionar.lastChild);
					}
					modalAdicionar.remove();
					overlay.remove();
				});
	
				formAdicionar.addEventListener('submit', async e => {
					e.preventDefault();
	
					const dados = {
						titulo: 	formAdicionar.elements['titulo'].value,
						texto: 		formAdicionar.elements['texto'].value,
						forum_id:	nomeForum
					}
	
					serverFetch(`/${estado.view.tipo}s/${estado.view.id}/objetos/topicos`, 'POST', dados)
						.then(res => res.json())
						.then(data => {            
							renderBlocos(estado);
					  });
				});
			});
		}
    }
}

window.customElements.define('m-adicionar-topico', MAdicionarTopico);