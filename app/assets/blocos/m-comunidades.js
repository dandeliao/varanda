import MalocaElement from "./MalocaElement.js";
import { serverFetch } from "../utils/fetching.js";

class MComunidades extends MalocaElement {
    constructor() {

        let html = `
        <div class="comunidades">

            <slot></slot>

        </div>
        `
        super(html);

    }

    async renderizar(estado) {

        while (this.lastChild) {
			this.removeChild(this.lastChild);
		}

        let tipo = estado.view.tipo;
        let id = estado.view.id;
        let arrayComunas = [];

        if (tipo === 'pessoa') {
            let res = await serverFetch(`/pessoas/${id}/objetos/comunidades`, 'GET');
            let comunidadesPessoais = await res.json();
            for (let i = 0; i < comunidadesPessoais.length; i++) {
                let r = await serverFetch(`/comunidades/${comunidadesPessoais[i].comunidade_id}`, 'GET');
                let c = await r.json();
                arrayComunas.push(c);
            }
        } else if (tipo === 'comunidade') {
            let res = await serverFetch('/comunidades', 'GET');
            arrayComunas = await res.json();
        }

        let divLista = document.createElement('div');

        if (arrayComunas.length > 0) {
            let card;
            let linkzinho;
            let avatar;
            arrayComunas.forEach(comuna => {

                card = document.createElement('div');
                card.style.display = "flex";
                card.style.flexDirection = "column";
                card.style.justifyContent = "start";
                card.style.alignItems = "center";
                card.style.gap = "0.25rem";
                card.style.maxWidth = "5rem";

                avatar = document.createElement('img');
                avatar.setAttribute('src', `http://localhost:4000/comunidades/${comuna.comunidade_id}/objetos/avatar`);
                avatar.setAttribute('alt', `avatar de ${comuna.nome}`);
                avatar.style.width = "100%";

                linkzinho = document.createElement('a');
                linkzinho.textContent = comuna.nome;
                linkzinho.setAttribute('data-link', 'true');
                linkzinho.setAttribute('href', `/${comuna.comunidade_id}`);
                linkzinho.style.display = "block";
                linkzinho.width = "100%";
                
                card.appendChild(avatar);
                card.appendChild(linkzinho);
                divLista.appendChild(card);
            });

            divLista.style.display = "flex";
            divLista.style.flexDirection = "row";
            divLista.style.gap = "1.75rem";
            divLista.style.flexWrap = "wrap";
            this.appendChild(divLista);
        
        } else {
            console.log("não há comunidades para mostrar");
        }
    }
}

window.customElements.define('m-comunidades', MComunidades);