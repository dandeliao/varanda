const templateImgButton = document.createElement('template');

templateImgButton.innerHTML = `
<style>

button {
    border: none;
    margin: 0;
    padding: 0;
    width: auto;
    overflow: visible;
    text-align: inherit;
    background: transparent;

    color: var(--cor-fonte-barra);
    font-family: var(--familia-fonte);

	display: inline-block;
	height: 1.5rem;
	width: 1.5rem;
	border-radius: 100%;
	padding: 0.12rem;
	cursor: pointer;
	transition: 0.07s;
}

button:active {
	background-color: var(--cor-destaque);
}

button.pressed {
	background-color: var(--cor-destaque);
}

button:disabled {
	cursor:default;
	background-color: transparent;
}

</style>

<button>
	<svg></svg>
</button>
`

class ImgButton extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({mode: 'open'});
		
		this.shadowRoot.appendChild(templateImgButton.content.cloneNode(true));

		let svg = this.shadowRoot.querySelector('svg');
		svg.setAttribute('viewBox', '0 0 100 100');
		svg.style.fill = 'var(--cor-fonte-barra)';
		let arquivo = this.getAttribute('imagem');
		fetch(arquivo) // fetch local
  			.then(response => response.text())
  			.then(markupSVG => {
				svg.innerHTML = markupSVG;
			});
	}

	get enabled() {
		let btn = this.shadowRoot.querySelector('button');
		if (btn.disabled) {
			return false;
		} else {
			return true;
		}
	}

	get pressed() {
		let classPressed = this.shadowRoot.querySelector('.pressed');
		if (classPressed) {
			return true;
		} else {
			return false
		}
	}

	set enabled(habilitado) {
		let btn = this.shadowRoot.querySelector('button');
		btn.disabled = !habilitado;

		let svg = this.shadowRoot.querySelector('svg');
		if (habilitado) {
			svg.style.fill = 'var(--cor-fonte-barra)';
		} else {
			svg.style.fill = 'var(--cor-gris-2)';
		}
	}

	set pressed(pressiona) {
		let btn = this.shadowRoot.querySelector('button');
		let svg = this.shadowRoot.querySelector('svg');
		if (pressiona) {
			btn.classList.add('pressed');
			svg.style.fill = 'var(--cor-fundo)'; // não funciona, por quê?
		} else {
			btn.classList.remove('pressed');
			svg.style.fill = 'var(--cor-fonte-barra)'; // não funciona, por quê?
		}
	}

}

window.customElements.define('img-button', ImgButton);