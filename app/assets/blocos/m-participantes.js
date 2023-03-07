import MalocaElement from "./MalocaElement.js";
import { serverFetch } from "../utils/fetching.js";

class MParticipantes extends MalocaElement {
    constructor() {

        let html = `
        <div class="participantes">

            <slot></slot>

        </div>
        `
        super(html);

    }

    async renderizar(estado) {

        while (this.lastChild) {
			this.removeChild(this.lastChild);
		}

        let tipo = estado.view.tipo
        let id = estado.view.id;
		let endereco = `/${tipo}s/${id}/objetos/pessoas`;


        let divLista = document.createElement('div');

        serverFetch(endereco, 'GET')
        .then(res => res.json())
        .then(data => {
            
            if (data.length > 0) {
                data.forEach(async pessoinha => {

                    let card;
                    let linkzinho;
                    let avatar;
                    let divDados;
                    let divHabilidades;

                    card = document.createElement('div');
					card.style.display = "flex";
                    card.style.flexDirection = "column";
                    card.style.justifyContent = "start";
                    card.style.alignItems = "center";
                    card.style.gap = "0.25rem";
                    card.style.maxWidth = "5rem";

                    avatar = document.createElement('img');
                    avatar.setAttribute('src', `http://localhost:4000/pessoas/${pessoinha.pessoa_id}/objetos/avatar`);
                    avatar.setAttribute('alt', `avatar de ${pessoinha.pessoa_id}`);
                    avatar.setAttribute('title', `avatar de ${pessoinha.pessoa_id}`);
                    avatar.style.width = "100%";

                    divDados = document.createElement('div');
                    divDados.style.display = "flex";
                    divDados.style.flexDirection = "column";
                    divDados.style.justifyContent = "space-between";
                    divDados.style.alignItems = "center";
                    divDados.style.gap = "0.2rem";

                    linkzinho = document.createElement('a');
                    linkzinho.textContent = '@' + pessoinha.pessoa_id;
                    linkzinho.setAttribute('data-link', 'true');
                    linkzinho.setAttribute('href', `/pessoa/${pessoinha.pessoa_id}`);
                    /* linkzinho.style.display = "block";
                    linkzinho.width = "100%"; */

                    divHabilidades = document.createElement('div');
                    divHabilidades.style.height = '100%';
                    divHabilidades.style.display = 'flex';
                    divHabilidades.style.justifyContent = "center";
                    divHabilidades.style.gap = "0.4rem";


                    let resHab = await serverFetch(`/pessoas/${pessoinha.pessoa_id}/objetos/comunidade?id=${id}`);
                    let objHabilidades = await resHab.json();
                    console.log('objHabilidades:', objHabilidades);
                    let arrayCaminhos = [];
                    if (objHabilidades.cuidar) {
                        arrayCaminhos.push('/assets/images/habilidade-cuidar.svg');
                    }
                    if (objHabilidades.moderar) {
                        arrayCaminhos.push('/assets/images/habilidade-moderar.svg');
                    }
                    if (objHabilidades.editar) {
                        arrayCaminhos.push('/assets/images/habilidade-editar.svg');
                    }
                    
                    for(let i = 0; i < arrayCaminhos.length; i++) {
                        let caminho = arrayCaminhos[i];
                        let svg = document.createElement('svg');
                        /* svg.setAttribute('viewBox', '0 0 100 100');
                        svg.style.fill = 'var(--cor-fonte-view)'; */
                        fetch(caminho) // fetch local
                            .then(response => response.text())
                            .then(markupSVG => {
                                svg.outerHTML = markupSVG;
                            });
                        divHabilidades.appendChild(svg);
                    }

                    divDados.appendChild(linkzinho);
                    divDados.appendChild(divHabilidades);
                    
                    card.appendChild(avatar);
                    card.appendChild(divDados);
                    divLista.appendChild(card);
                });

				
                divLista.style.display = "flex";
                divLista.style.flexDirection = "row";
                divLista.style.gap = "1.75rem";
                divLista.style.flexWrap = "wrap";
                this.appendChild(divLista);
            
            } else {
                console.log("não há pessoas para mostrar");
            }
        });
    }
}

window.customElements.define('m-participantes', MParticipantes);