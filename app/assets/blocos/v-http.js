import VarandaElement from "./VarandaElement.js";
import { serverFetch } from "../utils/fetching.js";
import { renderBlocos } from "../utils/rendering.js";

class VHttp extends VarandaElement {
    constructor() {

        let html = `
        <div id="maindiv">

            <slot></slot>

			<style>
				.http {
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

    renderizar(estado, noEvent) {
        
        console.log('renderizando bloco...');

		while (this.lastChild) {
			this.removeChild(this.lastChild);
		}

        let divContainer = this.shadowRoot.getElementById('maindiv');
        divContainer.style.width = "100%";
        divContainer.style.height = "100%";
        divContainer.style.display = "flex";

        let formHttp = document.createElement('form');
        formHttp.setAttribute('enctype', 'multipart/form-data');
        formHttp.innerHTML = `
        <h3>Requisição Http</h3>
        <br>
        <label for="metodo" hidden>método</label>
        <select name="metodo" id="metodo">
            <option value="">--Escolha um método--</option>
            <option value="get">GET</option>
            <option value="post">POST</option>
            <option value="put">PUT</option>
            <option value="delete">DELETE</option>
        </select>
        <br>
        <br>
        <label for="caminho" hidden>caminho</label>
        <input type="text" id="caminho" placeholder="/bichos/etc" name="caminho" style="width: 100%; font-size: 1rem; background-color: var(--cor-fundo); color: var(--cor-fonte-view);"/>
        <br>
        <br>
        <label for="corpo" hidden>body</label>
        <textarea id="corpo" placeholder="Corpo da requisição (opcional)" name="corpo" style="width: 100%; min-height: 16rem; font-size: 1rem; background-color: var(--cor-fundo); color: var(--cor-fonte-view);"></textarea>
        <br>
        <br>
        <br>
        <button type="submit">Enviar!</button>
        `

        let resposta = document.createElement('div');
        /* style="width: 100%; min-height: 16rem; font-size: 1rem; background-color: var(--cor-fundo); color: var(--cor-fonte-view);" */
        resposta.setAttribute("id", "respostaHttp");
        resposta.style.width = "100%";
        resposta.style.height = "100%";
        resposta.style.fontSize = "1rem";
        resposta.style.backgroundColor = "var(--cor-fundo)";
        resposta.style.color = "var(--cor-fonte-view)";

        let respostaHtml = document.createElement('iframe');
        respostaHtml.setAttribute("id", "paginaHtml");
        respostaHtml.style.width = "100%";
        respostaHtml.style.height = "100%";
        respostaHtml.style.fontSize = "1rem";
        respostaHtml.style.backgroundColor = "var(--cor-fundo)";
        respostaHtml.style.color = "var(--cor-fonte-view)";

        divContainer.appendChild(formHttp);
		divContainer.appendChild(resposta);
        divContainer.appendChild(respostaHtml);
        /* this.appendChild.divContainer; */

		if (!noEvent) {
            formHttp.addEventListener('submit', async e => {
                e.preventDefault();

                if (formHttp.elements['corpo'].value != "") {
                    const dados = JSON.parse(formHttp.elements['corpo'].value);
                    serverFetch(formHttp.elements['caminho'].value, formHttp.elements['metodo'].value, dados)
                    .then(res => {
                        // testa se é JSON
                        const contentType = res.headers.get("content-type");
                        if (contentType && contentType.indexOf("application/json") !== -1) {
                            return res.json().then(data => {
                                let respostinha = this.shadowRoot.getElementById("respostaHttp");
                                respostinha.innerText = JSON.stringify(data);
                                //renderBlocos(estado);
                            });
                        } else {
                            return res.text().then(text => {
                                let respostona = this.shadowRoot.getElementById("paginaHtml");
                                respostona.srcdoc = text;
                            });
                        }                  
                    })
                } else {
                    serverFetch(formHttp.elements['caminho'].value, formHttp.elements['metodo'].value)
                    .then(res => res.json())
                    .then(data => {
                        console.log("data:", data);
                        let respostinha = this.shadowRoot.getElementById("respostaHttp");
                        respostinha.innerText = JSON.stringify(data);
                        //renderBlocos(estado);
                    });
                }
            });
		}
    }
}

window.customElements.define('v-http', VHttp);