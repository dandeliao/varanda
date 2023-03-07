import MalocaElement from "./MalocaElement.js";
import { serverFetch } from "../utils/fetching.js";

class MBlogs extends MalocaElement {
    constructor() {

        let html = `
        <div class="blogs">

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

		let res = await serverFetch(`/${tipo}s/${id}/objetos/blogs`, 'GET');
		let arrayBlogs = (await res.json()).rows;

        let divLista = document.createElement('div');

        if (arrayBlogs.length > 0) {
            let botao;
            arrayBlogs.forEach(blog => {

                botao = document.createElement('button');
                botao.innerText = blog.blog_comunitario_id ? blog.blog_comunitario_id : blog.blog_pessoal_id;
                botao.style.display = "block";
				botao.style.width = "100%";
                botao.style.border = "none";
                
                divLista.appendChild(botao);

                // define atributos para facilitar uso no event listener
                botao.setAttribute('blog', botao.innerText);
                botao.setAttribute('tipo', estado.view.tipo);
                botao.setAttribute('localId', estado.view.id);

                if (!noEvent) {
                    botao.addEventListener('click', async e => {
                        let nomeBlog = e.currentTarget.getAttribute('blog');
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
                        
                        let modalTextos = document.createElement('div');
                        modalTextos.style.display = "block";
                        modalTextos.style.position = "absolute";
                        modalTextos.style.textAlign = "center";
                        modalTextos.style.left = "50%";
                        modalTextos.style.top = "5%";
                        modalTextos.style.transform = "translate(-50%, 0)";
                        modalTextos.style.margin = "0 auto";
                        modalTextos.style.width = "90%";
                        modalTextos.style.maxWidth = "860px";
                        modalTextos.style.maxHeight = "90%";
                        modalTextos.style.zIndex = "3";
                        modalTextos.style.backgroundColor = "rgba(255, 255, 255, 0)";
                        modalTextos.style.overflowY = "scroll";
                        
                        let blog = document.createElement('m-blog');
                        blog.setAttribute(`${tipoLocal}`, idLocal);
                        blog.setAttribute('nome', nomeBlog);
                        modalTextos.appendChild(blog);
    
                        this.appendChild(modalTextos);
                        this.appendChild(overlay);
    
                        blog.renderizar(estado);
    
                        overlay.addEventListener('click', e => {
                            e.preventDefault();
                            while (modalTextos.lastChild) {
                                modalTextos.removeChild(modalTextos.lastChild);
                            }
                            modalTextos.remove();
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
            console.log("não há blogs para mostrar");
        }
    }
}

window.customElements.define('m-blogs', MBlogs);