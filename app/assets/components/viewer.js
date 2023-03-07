const templateMalocaViewer = document.createElement('template');

templateMalocaViewer.innerHTML = `
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
}

#previa {
	min-height: 40rem;
	min-width: 260px;
	width: 30%;
	border: 1px solid var(--cor-fonte-view);
}

#controles {
	min-height: 40rem;
	min-width: 260px;
	width: 30%;
	border: 1px solid var(--cor-fonte-view);
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

class MalocaViewer extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({mode: 'open'});
		this.shadowRoot.appendChild(templateMalocaViewer.content.cloneNode(true));
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
		
		// exibe/esconde colunas
		if (valor === true) {
			let container = this.shadowRoot.querySelector('#flex-container');
			let elPrevia = document.createElement('div');
			let elControles = document.createElement('div');
			elPrevia.setAttribute('id', 'previa');
			elControles.setAttribute('id', 'controles');
			container.appendChild(elPrevia);
			container.appendChild(elControles);

			elHtml.style.minWidth = '260px';
			elHtml.style.width = '30%';
			elHtml.style.border = '1px solid var(--cor-fonte-view)';

			this.renderizarPrevia();

			// debounce (espera pessoa parar de digitar para atualizar prévia)
			function debounce(func, timeout){
				let timer;
				return (...args) => {
					clearTimeout(timer);
					timer = setTimeout(() => { func.apply(this, args); }, timeout);
				};
			}
			elHtml.addEventListener('keydown', debounce(() => {
				this.renderizarPrevia(), 2000;
			}, 2000));
			
		} else {
			let container = this.shadowRoot.querySelector('#flex-container');
			let elPrevia = this.shadowRoot.querySelector('#previa');
			let elControles = this.shadowRoot.querySelector('#controles');
			if (elPrevia) {
				container.removeChild(elPrevia);
			}
			if (elControles) {
				container.removeChild(elControles);
			}
			
			elHtml.style.minWidth = '0';
			elHtml.style.width = '100%';
			elHtml.style.border = 'none';
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
		
		let blocoRegex = /<(m-(?:\w+-*)+)(?:\s+(?:\w+="(?:\s*[A-Za-zÀ-ü0-9]*(?:-[A-Za-zÀ-ü0-9]*)*\s*(?::*(?:\s*\w+)+;)?)*")*)*>/g; // regex captura formatos <m-nome-do-bloco> e <m-nome-do-bloco prop1="valor" style="margin: 0 auto; font-family: monospace">
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

				e.composedPath().forEach(elemento => {
					if (elemento.tagName) {
						if (elemento.tagName.slice(0, 2) === 'M-') {
							console.log(elemento.tagName);
						}
					}
				});

			})
		});
	} 
}

window.customElements.define('maloca-viewer', MalocaViewer);