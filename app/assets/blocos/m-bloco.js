import MalocaElement from "./MalocaElement.js"; // ver como essa importação se comporta no cliente

class MBloco extends MalocaElement {
    constructor() {
        let html = `
        <div class="bloco">
	        
            <slot></slot>

            <style>
            .bloco {
                box-sizing: border-box;
                margin: 0 auto;
                width: 100%;
                padding: 1.5rem;
                background: var(--cor-fundo-2);
                color: var(--cor-fonte);
                box-shadow: var(--sombreado);
                font-family: var(--familia-fonte);
                border-style: var(--estilo-borda);
                border-width: var(--espessura-borda);
                border-radius: var(--raio-borda);
                border-color: var(--cor-destaque);
            }
            </style>

        </div>
        `;

        super(html);
    }

    renderizar(estado) {

    }
}

window.customElements.define('m-bloco', MBloco);