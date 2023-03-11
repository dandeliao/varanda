const templateViewer = document.createElement('template');

templateViewer.innerHTML = `
<style>

* {
	color: var(--cor-fonte-view);
	box-sizing: border-box;
	font-family: var(--familia-fonte);
}

main {
    background-color: var(--cor-fundo);
	color: var(--cor-fonte-view);
	min-height: 40rem;
	width: 100%;
}

#flex-container {
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	flex-wrap: wrap;
	overflow: auto;
	height: 100%;
}

#flex-interno {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	width: 60%;
	height: 100%;
}

#previa {
	min-width: 260px;
	width: 100%;
	height: 58%;
	border: 1px solid var(--cor-fonte-view);
	border-radius: 6px;
	overflow: auto;
}

#controles {
	min-width: 260px;
	width: 100%;
	height: 38%;
	border: 1px solid var(--cor-fonte-view);
	background: var(--cor-fundo-2);
    color: var(--cor-fonte);
	border-radius: 6px;
}

.codigo {
	minWidth: 260px;
	width: 36%;
	height: 100%;
	border: 1px solid var(--cor-fonte-view);
	borderRadius: 6px;
	overflow: auto;
}

a {
    text-decoration: underline;
    cursor: pointer;
	color: var(--cor-fonte-view);
}

a:hover {
    text-decoration:overline;
}

button {
    border-top: none;
    border-left: none;
    border-bottom: 0.1rem solid var(--cor-gris-2);
    border-right: 0.1rem solid var(--cor-gris-2);
    padding: 0.5rem;
    border-radius: 0.2rem;
    cursor: pointer;
    transition: 0.05s;
	background-color: var(--cor-destaque);
	color: var(--cor-fonte-barra);
}

button:active {
    border-top: 0.1rem solid var(--cor-gris-2);
    border-left: 0.1rem solid var(--cor-gris-2);
    border-bottom: 0.1rem solid var(--cor-fundo-2);
    border-right: 0.1rem solid var(--cor-fundo-2);
	background-color: var(--cor-principal);
	color: var(--cor-fonte-barra);
}

</style>

<div id="flex-container">
<main></main>
</div>
`

class VarandaViewer extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({mode: 'open'});
		this.shadowRoot.appendChild(templateViewer.content.cloneNode(true));

		// limita o tamanho da view à viewport
		const navBar = document.getElementById('nav-bar');
		const tabBar = document.getElementById('tab-bar');
		const alturaBarras = navBar.offsetHeight + tabBar.offsetHeight;
		const styleView = window.getComputedStyle(this);
		const padding = parseInt(styleView.getPropertyValue('padding-top')) + parseInt(styleView.getPropertyValue('padding-bottom'));
		const alturaView = 100 - (alturaBarras / window.innerHeight) * 100 - (padding / window.innerHeight) * 100;
		this.style.height = `${alturaView}vh`;
		this.style.overflow = 'auto';
	}

	get html() {
		return this.shadowRoot.querySelector('main').innerHTML;
	}

	set html(html) {
		this.shadowRoot.querySelector('main').innerHTML = html;
	}

	get text() {
		return this.shadowRoot.querySelector('main').innerText;
	}

	set text(texto) {
		this.shadowRoot.querySelector('main').innerText = texto;
	}

	get editable() {
		return this.shadowRoot.querySelector('main').contentEditable;
	}

	set editable(valor) {
		
		// ativa/desativa edição do html
		let elHtml = this.shadowRoot.querySelector('main');
		elHtml.contentEditable = valor;
		
		// exibe campos de edição (são 3: html, prévia e controles)
		if (valor === true) {

			// cria colunas prévia e controles
			let container = this.shadowRoot.querySelector('#flex-container');
			let containerInterno = document.createElement('div');
			containerInterno.setAttribute("id", 'flex-interno');
			let elPrevia = document.createElement('div');
			let elControles = document.createElement('div');
			elPrevia.setAttribute('id', 'previa');
			elControles.setAttribute('id', 'controles');
			containerInterno.appendChild(elPrevia);
			containerInterno.appendChild(elControles);
			container.appendChild(containerInterno);

			// formata coluna html
			elHtml.classList.add('codigo');

			// ------
			// Prévia
			// ------

			this.renderizarPrevia();
			
			// função debounce (espera pessoa parar de digitar para executar comando)
			function debounce(func, timeout){
				let timer;
				return (...args) => {
					clearTimeout(timer);
					timer = setTimeout(() => { func.apply(this, args); }, timeout);
				};
			}
			
			// renderiza prévia sempre que html é alterado (usa debounce)
			elHtml.addEventListener('keydown', debounce(() => {
				this.renderizarPrevia(), 2000;
			}, 2000));

			// ---------
			// Controles
			// ---------
			
			this.renderizarControles();

			// altera prévia e/ou html quando controles são alterados
			//	- pensar uso do debounce
			//  - prévia pode ser alterada diretamente? por exemplo slider para max-width de container
			function controlaHtml(evento) {
				console.log("evento: ", evento);
			}
			elControles.addEventListener('click', e => controlaHtml(e));
			elControles.addEventListener('change', e => controlaHtml(e));
			

		} else {

			// remove prévia e controles
			let container = this.shadowRoot.querySelector('#flex-container');
			let containerInterno = this.shadowRoot.querySelector('#flex-interno');
			let elPrevia = this.shadowRoot.querySelector('#previa');
			let elControles = this.shadowRoot.querySelector('#controles');
			if (containerInterno) {
				containerInterno.removeChild(elPrevia);
				containerInterno.removeChild(elControles);
				container.removeChild(containerInterno);
			}
			
			// limpa formatação da coluna 'html'
			elHtml.classList.remove('codigo');

		}
	}

	focusOnIt() {
		this.shadowRoot.querySelector('main').focus();
	}

	renderizarPrevia() {
		let elHtml = this.shadowRoot.querySelector('main');
		let elPrevia = this.shadowRoot.querySelector('#previa');
		
		let html = elHtml.innerHTML;
		html = html.replace(/<br>/g, '\n');
		html = html.replace(/&lt;/g, '<');
		html = html.replace(/&gt;/g, '>');
		
		elPrevia.innerHTML = html;
		
		let blocoRegex = /<(v-(?:\w+-*)+)(?:\s+(?:\w+="(?:\s*[A-Za-zÀ-ü0-9]*(?:-[A-Za-zÀ-ü0-9]*)*\s*(?::*(?:\s*\w+)+;)?)*")*)*>/g; // regex captura formatos <v-nome-do-bloco> e <v-nome-do-bloco prop1="valor" style="margin: 0 auto; font-family: monospace">
		let blocos = html.matchAll(blocoRegex);
		let arrayBlocos = [];
		for (const bloco of blocos) {
			arrayBlocos.push({tag: bloco[0], bloco_id: bloco[1], index: bloco['index']});
		}
		arrayBlocos.forEach(bloco => {
			
			let elBloco = elPrevia.querySelector(bloco.bloco_id);
			elBloco.renderizar(JSON.parse(localStorage.getItem('estado')), 'noEvent');
			
			elBloco.addEventListener('mouseover', e => {
				e.target.style.opacity = '0.5';
				e.target.style.cursor = 'pointer';
			});

			elBloco.addEventListener('mouseout', e => {
				e.target.style.opacity = '1';
				e.target.style.cursor = 'default';
			});

			elBloco.addEventListener('click', e => {

				e.stopPropagation();
				e.stopImmediatePropagation();
				e.preventDefault();
				this.renderizarControles(e);

				

			})
		});

		// reduz o tamanho dos elementos da prévia
		let children = elPrevia.children;
		for (let i = 0; i < children.length; i++) {
			children[i].style.transform = 'scale(0.6)';
			children[i].style.transformOrigin =  'top center';
		}

	}

	renderizarControles(evento) {

		console.log("renderizar controles...")
		
		// limpa elementos-filhos
		let elControles = this.shadowRoot.querySelector('#controles');
		while (elControles.lastChild) {
			elControles.removeChild(elControles.lastChild);
		}
		
		// pensar:
		// 	- itens gerais são necessários?
		//  - talvez manter apenas "inserir bloco" como item geral
		// 	- talvez criar bloco v-container e alterá-lo como um bloco normal na renderização de item clicado
		
		/* // renderiza itens gerais: propriedades da página, inserir bloco
		let formPagina = document.createElement('form');
		formPagina.style.border = '1px solid var(--cor-fonte-view)';
		formPagina.innerHTML = `
			
		`;
		
		
		let formInserirBloco = document.createElement('form');
		formInserirBloco.style.border = '1px solid var(--cor-fonte-view)';

		elControles.appendChild(formPagina);
		elControles.appendChild(formInserirBloco); */

		// renderizar item clicado (a partir do evento)
		if (evento) {
			evento.composedPath().forEach(elemento => {
				if (elemento.tagName) {
					if (elemento.tagName.slice(0, 2) === 'V-') {
						console.log(elemento.tagName);
						console.log(elemento.getAttribute('m_id'));
					}
				}
			});
		}
	}
}

window.customElements.define('varanda-viewer', VarandaViewer);