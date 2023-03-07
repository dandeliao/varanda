import MalocaElement from "./MalocaElement.js";
import { serverFetch } from "../utils/fetching.js";
import { renderBlocos } from "../utils/rendering.js";

class MCriarComunidade extends MalocaElement {
    constructor() {

        let html = `
        <div class="criar-comunidade">

            <slot></slot>

			<style>
				.criar-comunidade {
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

        let botaoCriar = document.createElement('button');
		botaoCriar.style.display = "inline-block";
		botaoCriar.style.position = "relative";
		botaoCriar.style.maxWidth = "15rem";
		botaoCriar.style.width = "100%";
		botaoCriar.style.height = "100%";
		botaoCriar.style.fontSize = "1rem";
		botaoCriar.innerText = "criar comunidade";
		this.appendChild(botaoCriar);

		if (!noEvent) {
			botaoCriar.addEventListener('click', e => {

				let overlay = document.createElement('div');
				overlay.style.display = "block";
				overlay.style.position = "fixed";
				overlay.style.zIndex = "2";
				overlay.style.width = "100%";
				overlay.style.height = "100%";
				overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
				overlay.style.left = "0px";
				overlay.style.top = "0px";
				
				let modalCriar = document.createElement('m-bloco');
				modalCriar.style.display = "block";
				modalCriar.style.position = "fixed";
				modalCriar.style.left = "50vw";
				modalCriar.style.top = "50vh";
				modalCriar.style.transform = "translate(-50%, -50%)";
				modalCriar.style.margin = "0 auto";
				modalCriar.style.minWidth = "24rem";
				modalCriar.style.maxWidth = "64rem";
				modalCriar.style.zIndex = "3";
				
	
				let formCriar = document.createElement('form');
				formCriar.innerHTML = `
				<h3>Digite os dados da comunidade:</h3>
				<br>
				<label for="arroba" hidden>arroba</label>
				<input type="text" id="arroba-comunidade-nova" placeholder="@" name="arroba" required style="width: 100%; font-size: 1rem; background-color: var(--cor-fundo); color: var(--cor-fonte-view);">
				<br>
				<br>
				<label for="nome" hidden>nome</label>
				<input type="text" id="nome-comunidade-nova" placeholder="Nome da Comunidade" name="nome" required style="width: 100%; font-size: 1rem; background-color: var(--cor-fundo); color: var(--cor-fonte-view);">
				<br>
				<br>
				<label for="descricao" hidden>descricao</label>
				<textarea id="descricao-comunidade-nova" placeholder="Descrição da Comunidade" name="descricao" required style="width: 100%; min-height: 6rem; background-color: var(--cor-fundo); color: var(--cor-fonte-view);"></textarea>
				<br>
				<br>
				<br>
				<button type="submit">criar</button>
				`
				
				modalCriar.appendChild(formCriar);
				this.appendChild(modalCriar);
				this.appendChild(overlay);
	
				overlay.addEventListener('click', e => {
					e.preventDefault();
					while (modalCriar.lastChild) {
						modalCriar.removeChild(modalCriar.lastChild);
					}
					modalCriar.remove();
					overlay.remove();
				});
	
				formCriar.addEventListener('submit', async e => {
					e.preventDefault();
					let dadosNovaComuna = {
						comunidade_id: formCriar.elements['arroba'].value,
						nome: formCriar.elements['nome'].value,
						descricao: formCriar.elements['descricao'].value
					};
					serverFetch('/comunidades', 'POST', dadosNovaComuna)
						.then(res => res.json())
						.then(data => {            
							 renderBlocos(estado);
					  });
				});
			});
		}
    }
}

window.customElements.define('m-criar-comunidade', MCriarComunidade);