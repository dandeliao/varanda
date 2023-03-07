import { serverFetch } from "../utils/fetching.js";
import { convertBlobToBase64 } from "../utils/rendering.js";


class MalocaMenu extends HTMLElement {
	constructor() {

		super();

		let html = `
			<main class="gaveta-fechada">
			
				<div>
					<img />
					<span></span>
				</div>
				<ul></ul>
			
				<style>

					* {
						color: var(--cor-fonte-view);
						background-color: var(--cor-fundo-2);
						font-family: var(--familia-fonte);
						box-sizing: border-box;
					}

					main {
						width: 100%;
						overflow: hidden;
						padding: 1rem;
						box-shadow: 2px 3px 4px rgba(26, 26, 26, 0.2);
						border-left: none;
						line-height: 1.75;
						border-radius: 0.4rem;
					}

					img {
						border-radius: 100%;
						height: 2rem;
						width: 2rem;
					}

					img.cover { object-fit: cover; } /* amplia imagem se necessário, para manter proporções */

					ul {
						list-style-type: none;
						padding: 0;
						margin: 0;
					}

					li {
						position: relative;
					}

					li:hover {
						background-color: var(--cor-destaque);
					}

					a {
						text-decoration: none;
						font-size: 1.25rem;
						cursor: pointer;
						background-color: inherit;
						color: inherit;
						width: 100%;
						padding: 0 0.5rem;
					}

					a::after { /* expande o link para ocupar todo o espaço do item, permitindo clique fora do texto do link */
						content: '';
						position: absolute;
						top: 0;
						right: 0;
						bottom: 0;
						left: 0;
						z-index: 1;
					}

					div {
						margin-bottom: 0.75rem;
						display: flex;
						flex-direction: row;
						justify-content: left;
						align-items: center;
						gap: 0.5rem;
					}

					.gaveta-fechada {
						transform: translate(-45%, -55%) scale(0);
						transition: transform ease-out 0.3s;
					}
					
					.gaveta-aberta {
						transform: translate(3%, -4%) scale(1) ;
					}
					

				</style>

			</main>
			`
		
        let template = document.createElement('template');
        template.innerHTML = html;
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.firstElementChild.cloneNode(true));
	}

	async renderizar(estado) {

		if (estado.auth.id) {
			let res = await serverFetch(`/pessoas/${estado.auth.id}`);
			let perfil = await res.json();
		
			let fetchedImage = await serverFetch(`/pessoas/${estado.auth.id}/objetos/avatar`, 'GET');
			let imageBase64 = await convertBlobToBase64(await fetchedImage.blob());
			this.addProfile(imageBase64, perfil.nome);
			this.addItem('Meu perfil', `/pessoa/${estado.auth.id}`);
		} else {
			this.addProfile(`/assets/images/avatar.jpg`, 'pessoa não logada');
		}
		
		
		this.addItem('Início', '/');
		this.addItem('Configuração', '/configuracao');
		this.addItem('Sair', '/logout');
	
		this.style.position = 'absolute';
		this.style.zIndex = 500;
		this.style.top = '2rem';
		this.style.left = '0px';
		this.style.width = '22rem';
		this.style.maxWidth = '300px';
		this.style.minWidth = '100px';
		this.style.zIndex = '110';

		let elMain = this.shadowRoot.querySelector('main');
		elMain.classList.add('gaveta-aberta');

	}

	addItem (texto, caminho) {
		try {
			let lista = this.shadowRoot.querySelector('ul');
			let novoItem = document.createElement('li');
			novoItem.innerHTML = `<a href="${caminho}" data-link>${texto}</a>`;
			lista.appendChild(novoItem);
		} catch (erro) {
			console.log('erro ao adicionar item ao menu:', erro);
		}
	}

	addProfile (imgSource, name) {
		try {
			let img = this.shadowRoot.querySelector('img');
			let nome = this.shadowRoot.querySelector('span');
			img.setAttribute('src', imgSource);
			nome.innerText = name;
		} catch (erro) {
			console.log('erro ao adicionar perfil ao menu:', erro);
		}
	}
}

window.customElements.define('maloca-menu', MalocaMenu);