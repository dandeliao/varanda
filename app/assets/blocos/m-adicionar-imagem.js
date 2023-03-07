import MalocaElement from "./MalocaElement.js";
import { serverFetch } from "../utils/fetching.js";
import { renderBlocos } from "../utils/rendering.js";

class MAdicionarImagem extends MalocaElement {
    constructor() {

        let html = `
        <div class="adicionar-imagem">

            <slot></slot>

			<style>
				.adicionar-imagem {
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

		let nomeAlbum = this.getAttribute('album');

        let botaoAdicionar = document.createElement('button');
		botaoAdicionar.style.display = "inline-block";
		botaoAdicionar.style.position = "relative";
		botaoAdicionar.style.maxWidth = "15rem";
		botaoAdicionar.style.width = "100%";
		botaoAdicionar.style.height = "100%";
		botaoAdicionar.innerText = "adicionar imagem";
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
				modalAdicionar.style.minWidth = "24rem";
				modalAdicionar.style.maxWidth = "64rem";
				modalAdicionar.style.zIndex = "3";
				
	
				let formAdicionar = document.createElement('form');
				formAdicionar.setAttribute('enctype', 'multipart/form-data');
				formAdicionar.innerHTML = `
				<h3>Adicionar Imagem</h3>
				<br>
				<div style="display: block; max-height: 12rem; width: 100%; text-align: center; margin-bottom: 1rem;">
					<img id="preview-imagem" title="prévia da imagem" style="display: hidden; max-width: 12rem;" />
				</div>
				<label for="arquivo">Selecione uma imagem:</label>
				<input id="arquivo-imagem" name="arquivo" type="file" />
				<br>
				<br>
				<label for="descricao" hidden>descrição</label>
				<textarea id="descricao-imagem" placeholder="descreva a imagem para pessoas com deficiência visual. Exemplo: foto de uma árvore alta sem folhas em um parque com grama esverdeada em um dia ensolarado" name="descricao" required style="width: 100%; min-height: 8rem; font-size: 1rem; background-color: var(--cor-fundo); color: var(--cor-fonte-view);"></textarea>
				<br>
				<br>
				<label for="titulo" hidden>álbum</label>
				<input type="text" id="titulo-imagem" placeholder="Título" name="titulo" style="width: 100%; font-size: 1rem; background-color: var(--cor-fundo); color: var(--cor-fonte-view);">
				<br>
				<br>
				<br>
				<button type="submit">salvar imagem</button>
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
	
				let inputImagem = this.querySelector('#arquivo-imagem');
				inputImagem.addEventListener('change', e => {
					console.log('change e.target:', e.target);
					if (e.target.files.length > 0) {
						let preview = this.querySelector('#preview-imagem');
						let imgSrc = URL.createObjectURL(e.target.files[0]);
						preview.setAttribute('src', imgSrc);
						preview.style.display = 'inline-block';
					}
				});
	
				formAdicionar.addEventListener('submit', async e => {
					e.preventDefault();
	
					const arquivo = formAdicionar.elements['arquivo-imagem'].files[0];
					const descricao = formAdicionar.elements['descricao'].value;
					const titulo = formAdicionar.elements['titulo'].value;
					const album = nomeAlbum;
	
					let formData = new FormData();
					formData.append('descricao', descricao);
					formData.append('titulo', titulo);
					if (estado.view.tipo === 'comunidade') {
						formData.append('album_comunitario_id', album);
					} else if (estado.view.tipo === 'pessoa') {
						formData.append('album_pessoal_id', album);
					}
					formData.append('arquivo', arquivo);
	
					serverFetch(`/${estado.view.tipo}s/${estado.view.id}/objetos/imagens`, 'POST', formData)
						.then(res => res.json())
						.then(data => {            
							renderBlocos(estado);
					  });
				});
			});
		}
    }
}

window.customElements.define('m-adicionar-imagem', MAdicionarImagem);