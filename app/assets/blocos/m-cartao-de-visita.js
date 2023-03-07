import MalocaElement from "./MalocaElement.js";

class MCartaoDeVisita extends MalocaElement {
    constructor() {
        
        let html = `
        <div class="bloco">

			<slot></slot>

			<style>
            .bloco {
                box-sizing: border-box;
				display: block;
				position: relative;
                margin: 0 auto;
				width: 100%;
                
				background-color: var(--cor-fundo-2);
				color: var(--cor-fonte);
				font-family: var(--familia-fonte);
                box-shadow: var(--sombreado);
                border-style: var(--estilo-borda);
                border-width: var(--espessura-borda);
                border-radius: var(--raio-borda);
                border-color: var(--cor-principal);
            }
            </style>

        </div>
        `;

        super(html);
    }

	renderizar(estado) {
		
		while (this.lastChild) {
			this.removeChild(this.lastChild);
		}

		let divCartao = document.createElement('div');
		let mFundo = document.createElement('m-fundo');
		mFundo.setAttribute('id', 'fundo');
		let divTexto = document.createElement('div');
		divTexto.setAttribute('id', 'texto');
		let mAvatar = document.createElement('m-avatar');
		let divEspaco = document.createElement('div');
		divEspaco.setAttribute('id', 'espaco');
		let mNome = document.createElement('m-nome');
		let mDescricao = document.createElement('m-descricao');

		divCartao.appendChild(mFundo);
		divTexto.appendChild(divEspaco);
		divTexto.appendChild(mNome);
		divTexto.appendChild(mDescricao);
		divCartao.appendChild(divTexto);
		divCartao.appendChild(mAvatar);

		this.style.display = 'block';

		divCartao.style.position = 'relative';

		mFundo.style.height = '7.2rem'
		mFundo.style.display = 'block';
		mFundo.style.position = 'relative';
		mFundo.style.width = '100%';

		divTexto.style.position = 'relative';
		divTexto.style.boxSizing = 'border-box';
		divTexto.style.width = '100%';
		divTexto.style.textAlign = 'left';

		divEspaco.style.display = 'inline-block';
		divEspaco.style.width = '132px';
		divEspaco.style.height = '3.5rem';
		
		mNome.style.display = 'inline-block';
		mNome.style.fontWeight = 'bold';
		mNome.style.fontSize = '1.6rem';
		mNome.style.verticalAlign = 'top';
		mNome.style.padding = '0.68rem 1.5rem';

		mDescricao.style.display = 'block';
		mDescricao.style.fontSize = '0.96rem';
		mDescricao.style.textAlign = 'left';
		mDescricao.style.padding = '0.68rem 1.5rem 1.5rem';

		mAvatar.style.display = 'block';
		mAvatar.style.position = 'absolute';
		mAvatar.style.maxWidth = '128px';
		mAvatar.style.top = '7.2rem';
		mAvatar.style.transform = 'translate(15%, -60%)';
		mAvatar.style.zIndex = '2';

		this.appendChild(divCartao);

		mFundo.renderizar(estado);
		mAvatar.renderizar(estado);
		mNome.renderizar(estado);
		mDescricao.renderizar(estado);

    }
}

window.customElements.define('m-cartao-de-visita', MCartaoDeVisita);