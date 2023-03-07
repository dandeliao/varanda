import MalocaElement from "./MalocaElement.js";
import { serverFetch } from "../utils/fetching.js";

class MTopico extends MalocaElement {
    constructor() {

        let html = `
        <div class="topico">

            <slot></slot>

        </div>
        `
        super(html);

    }

    async renderizar(estado, noEvent) {

        while (this.lastChild) {
			this.removeChild(this.lastChild);
		}

		this.style.display = 'inline-block';

		let tipoOrigem = estado.view.tipo;
		let idOrigem = estado.view.id;

		let topicoID = this.getAttribute('numero');
		let res = await serverFetch(`/${tipoOrigem}s/${idOrigem}/objetos/topico?id=${topicoID}`, 'GET');
		let topico = await res.json();

		// cria div para englobar título e info
		let elTituloEInfo = document.createElement('div');

		// cria div com o título do tópico
		let elTitulo = document.createElement('p');
		elTitulo.innerText = topico.titulo;
		elTitulo.style.textAlign = 'left';
		elTitulo.style.fontWeight = 'bold';

		// cria div info, que receberá informações (pessoa que postou, data de postagem)
		let elInfo = document.createElement('div');
				
		// cria elementos com informações da pessoa que postou
		let elPessoa = document.createElement('div');
		let elAvatar = document.createElement('m-avatar');
		let elDivNomeArroba = document.createElement('div');
		let elNome = document.createElement('div');
		let elArroba = document.createElement('a');
		res = await serverFetch(`/pessoas/${topico.pessoa_id}`, 'GET');
		let pessoa = await res.json();
		elAvatar.setAttribute('pessoa', pessoa.nome);
		elNome.innerText = pessoa.nome;
		elArroba.innerText = '@' + pessoa.pessoa_id;
		elArroba.setAttribute('href', `/pessoa/${pessoa.pessoa_id}`);
		elArroba.setAttribute('data-link', '');
		elDivNomeArroba.appendChild(elNome);
		elDivNomeArroba.appendChild(elArroba);
		elPessoa.appendChild(elDivNomeArroba);
		elPessoa.appendChild(elAvatar);

		// cria elemento com data da postagem
		let elData = document.createElement('div');
		// regex para converter formato de data (timestampz do psql) em DD/MM/AAAA
		let dataRegex = topico.data_criacao.matchAll(/(\d*)(?:-|T)/g);
		let dataMatch = [];
		for (const d of dataRegex) {
			dataMatch.push(d);
		}
		elData.innerText = dataMatch[2][1] + '/' + dataMatch[1][1] + '/' + dataMatch[0][1];
		
		// popula a div de informações
		elInfo.appendChild(elPessoa);
		elInfo.appendChild(elData);

		// estiliza elementos
		elInfo.style.display = 'flex';
		elInfo.style.flexDirection = 'row';
		elInfo.style.justifyContent = 'space-between';
		elInfo.style.alignItems = 'flex-end';
		elInfo.style.gap = '0.4rem';
		elPessoa.style.display = 'flex';
		elPessoa.style.alignItems = 'flex-end';
		elPessoa.style.gap = '0.4rem';
		elAvatar.redondo = false;
		elAvatar.style.width = '48px';
		elAvatar.style.height = '48px';
		elDivNomeArroba.style.textAlign = 'right';
		elTituloEInfo.style.display = 'flex';
		elTituloEInfo.style.flexDirection = 'row';
		elTituloEInfo.style.justifyContent = 'space-between';
		elTituloEInfo.style.alignItems = 'flex-end';
		elTituloEInfo.style.width = '100%';
		this.style.width = '100%';

		elTituloEInfo.appendChild(elTitulo);
		elTituloEInfo.appendChild(elInfo);
		this.appendChild(elTituloEInfo);

		// renderiza blocos
		elAvatar.renderizar(estado);

		if (!noEvent) {

			// muda ponteiro ao passar o mouse por cima
			elTituloEInfo.addEventListener('mouseover', e => {
				elTituloEInfo.style.cursor = "pointer";
			})
			
			// quando clicado, exibe comentários
			elTituloEInfo.addEventListener('click', async e => {

				// alterna entre pressionado/solto
				e.target.classList.toggle('pressionado');

				if (e.target.classList.contains('pressionado')) {

					// cria div para exibir o texto do tópico
					let elTexto = document.createElement('div');
					elTexto.innerText = topico.texto;
					elTexto.classList.add('secao-comentarios');
					this.appendChild(elTexto);

					// cria bloco que exibe comentários
					let elComentarios = document.createElement('m-comentarios');
					elComentarios.setAttribute('topico', topicoID);
					elComentarios.setAttribute('comunidade', idOrigem);
					elComentarios.classList.add('secao-comentarios');
					this.appendChild(elComentarios);
					elComentarios.renderizar(estado);

					// cria bloco com formulário para adicionar novo comentário
					let elAdicionar = document.createElement('m-adicionar-comentario');
					elAdicionar.setAttribute('topico', topicoID);
					elAdicionar.setAttribute('comunidade', idOrigem);
					elAdicionar.classList.add('secao-comentarios');
					this.appendChild(elAdicionar);
					elAdicionar.renderizar(estado);


				} else {
					
					let comentarios = this.querySelectorAll('.secao-comentarios');
					comentarios.forEach(el => {
						console.log(el);
						el.parentNode.removeChild(el)
					})

				}
			});
		}
    }
}

window.customElements.define('m-topico', MTopico);