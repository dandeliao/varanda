import MalocaElement from "./MalocaElement.js";
import { serverFetch } from "../utils/fetching.js";

class MAlbuns extends MalocaElement {
    constructor() {

        let html = `
        <div class="albuns">

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

		let res = await serverFetch(`/${tipo}s/${id}/objetos/albuns`, 'GET');
		let resAlbuns = (await res.json()).rows;
        let arrayAlbuns = [];

        for (let i=0; i < resAlbuns.length; i++) {
            if (estado.view.tipo === 'comunidade') {
                arrayAlbuns.push({
                    nome: resAlbuns[i].album_comunitario_id,
                    capa_id: resAlbuns[i].capa_id,
                });
            } else if (estado.view.tipo === 'pessoa') {
                arrayAlbuns.push({
                    nome: resAlbuns[i].album_pessoal_id,
                    capa_id: resAlbuns[i].capa_id,
                });
            }
        }

        let divLista = document.createElement('div');

        if (arrayAlbuns.length > 0) {
            let botao;
            let capa;
            let nome;
            arrayAlbuns.forEach(async album => {

                botao = document.createElement('button');
				botao.style.maxWidth = "10rem";
                botao.style.padding = "0.4rem";

                capa = document.createElement('img');
                capa.setAttribute('src', `http://localhost:4000/${tipo}s/${id}/objetos/album?id=${album.nome}&capa=true`);
                capa.setAttribute('alt', `álbum ${album.nome}`);
                capa.setAttribute('title', `álbum ${album.nome}`);
                capa.style.backgroundColor = "var(--cor-fundo)";
                capa.style.width = "100%";

                nome = document.createElement('p');
                nome.textContent = album.nome;
                
				botao.appendChild(capa);
                botao.appendChild(nome);
                divLista.appendChild(botao);

                // define atributos para facilitar uso no event listener
                botao.setAttribute('album', album.nome);
                botao.setAttribute('tipo', estado.view.tipo);
                botao.setAttribute('localId', estado.view.id);

                if (!noEvent) {
                    botao.addEventListener('click', async e => {
                        let nomeAlbum = e.currentTarget.getAttribute('album');
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
                        
                        let modalImagens = document.createElement('div');
                        modalImagens.style.display = "block";
                        modalImagens.style.position = "absolute";
                        modalImagens.style.textAlign = "center";
                        modalImagens.style.left = "50%";
                        modalImagens.style.top = "5%";
                        modalImagens.style.transform = "translate(-50%, 0)";
                        modalImagens.style.margin = "0 auto";
                        modalImagens.style.width = "90%";
                        modalImagens.style.maxWidth = "860px";
                        modalImagens.style.maxHeight = "90%";
                        modalImagens.style.zIndex = "3";
                        modalImagens.style.backgroundColor = "rgba(255, 255, 255, 0)";
                        modalImagens.style.overflowY = "scroll";
    
                        let album = document.createElement('m-album');
                        album.setAttribute(`${tipoLocal}`, idLocal);
                        album.setAttribute('nome', nomeAlbum);
                        modalImagens.appendChild(album);
                        
                        this.appendChild(modalImagens);
                        this.appendChild(overlay);
    
                        album.renderizar(estado);
    
                        overlay.addEventListener('click', e => {
                            e.preventDefault();
                            while (modalImagens.lastChild) {
                                modalImagens.removeChild(modalImagens.lastChild);
                            }
                            modalImagens.remove();
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
            console.log("não há álbuns para mostrar");
        }
    }
}

window.customElements.define('m-albuns', MAlbuns);