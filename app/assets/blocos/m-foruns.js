import MalocaElement from "./MalocaElement.js";
import { serverFetch } from "../utils/fetching.js";

class MForuns extends MalocaElement {
    constructor() {

        let html = `
        <div class="foruns">

            <slot></slot>

        </div>
        `
        super(html);

    }

    async renderizar(estado, noEvent) {

        while (this.lastChild) {
			this.removeChild(this.lastChild);
		}

        let tipo = estado.view.tipo;
        let id = estado.view.id;

		let res = await serverFetch(`/${tipo}s/${id}/objetos/foruns`, 'GET');
		let arrayForuns = await res.json();

        let divLista = document.createElement('div');

        if (arrayForuns.length > 0) {
            let botao;
            arrayForuns.forEach(forum => {

                botao = document.createElement('button');
                botao.innerText = forum.forum_id;
                botao.style.display = "block";
				botao.style.width = "100%";
                botao.style.border = "none";
                
                divLista.appendChild(botao);

                // define atributos para facilitar uso no event listener
                botao.setAttribute('forum', botao.innerText);
                botao.setAttribute('tipo', estado.view.tipo);
                botao.setAttribute('localId', estado.view.id);

                if (!noEvent) {
                    botao.addEventListener('click', async e => {
                        let nomeForum = e.currentTarget.getAttribute('forum');
                        let tipoLocal = e.currentTarget.getAttribute('tipo');
                        let idLocal = e.currentTarget.getAttribute('localId');
    
                        let overlay = document.createElement('div');
                        overlay.style.display = "block";
                        overlay.style.position = "fixed";
                        overlay.style.zIndex = "2";
                        overlay.style.width = "100%";
                        overlay.style.height = "100%";
                        overlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
                        overlay.style.left = "0px";
                        overlay.style.top = "0px";
                        
                        let modalTopicos = document.createElement('div');
                        modalTopicos.style.display = "block";
                        modalTopicos.style.position = "absolute";
                        modalTopicos.style.textAlign = "left";
                        modalTopicos.style.left = "50%";
                        modalTopicos.style.top = "5%";
                        modalTopicos.style.transform = "translate(-50%, 0)";
                        modalTopicos.style.margin = "0 auto";
                        modalTopicos.style.width = "90%";
                        modalTopicos.style.maxWidth = "860px";
                        modalTopicos.style.maxHeight = "90%";
                        modalTopicos.style.zIndex = "3";
                        modalTopicos.style.backgroundColor = "rgba(255, 255, 255, 0)";
                        modalTopicos.style.overflowY = "scroll";
                        
                        let elForum = document.createElement('m-forum');
                        elForum.setAttribute(`${tipoLocal}`, idLocal);
                        elForum.setAttribute('nome', nomeForum);
                        modalTopicos.appendChild(elForum);
    
                        this.appendChild(modalTopicos);
                        this.appendChild(overlay);
    
                        elForum.renderizar(estado);
    
                        overlay.addEventListener('click', e => {
                            e.preventDefault();
                            while (modalTopicos.lastChild) {
                                modalTopicos.removeChild(modalTopicos.lastChild);
                            }
                            modalTopicos.remove();
                            overlay.remove();
                            window.scrollTo(0, 0);
                        });
                    });
                }
            });

            divLista.style.display = "flex";
            divLista.style.flexDirection = "row";
            divLista.style.gap = "1.75rem";
            divLista.style.flexWrap = "wrap";
            this.appendChild(divLista);
        
        } else {
            console.log("não há fóruns para mostrar");
			let aviso = document.createElement('p');
			aviso.innerText = 'não há fóruns para mostrar';
			this.appendChild(aviso);
        }
    }
}

window.customElements.define('m-foruns', MForuns);