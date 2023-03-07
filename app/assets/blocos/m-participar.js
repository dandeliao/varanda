import MalocaElement from "./MalocaElement.js";
import { serverFetch } from "../utils/fetching.js";
import { renderBlocos } from "../utils/rendering.js";

class MParticipar extends MalocaElement {
    constructor() {

        let html = `
        <div class="participar">

            <slot></slot>

			<style>
				.participar {
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

    async renderizar(estado, noEvent) {

		while (this.lastChild) {
			this.removeChild(this.lastChild);
		}

        let botaoParticipar = document.createElement('button');
		botaoParticipar.style.display = "inline-block";
		botaoParticipar.style.position = "relative";
		botaoParticipar.style.maxWidth = "15rem";
		botaoParticipar.style.width = "100%";
		botaoParticipar.style.height = "100%";
		botaoParticipar.style.fontSize = "1rem";

		let res = await serverFetch(`/pessoas/${estado.auth.id}/objetos/comunidade?id=${estado.view.id}`, 'GET');
		const habilidades = await res.json();
		botaoParticipar.innerText = "participar";
		if (habilidades) {
			if (habilidades.participar === true) {
				botaoParticipar.innerText = "sair";
			}	
		}
		
		this.appendChild(botaoParticipar);

		if (!noEvent) {
			botaoParticipar.addEventListener('click', e => {

				if (habilidades.participar === true) {
					if (confirm(`Tem certeza que deseja deixar de participar da comunidade ${estado.view.id}?`)) {
						serverFetch(`/pessoas/${estado.auth.id}/objetos/comunidade?id=${estado.view.id}`, 'DELETE')
						.then(res => res.json())
						.then(r => {
							renderBlocos(estado);
						});
					}
				} else {
					serverFetch(`/pessoas/${estado.auth.id}/objetos/comunidade?id=${estado.view.id}`, 'POST')
						.then(res => res.json())
						.then(r => {
							renderBlocos(estado);
						});
				}
			});
		}
    }
}

window.customElements.define('m-participar', MParticipar);