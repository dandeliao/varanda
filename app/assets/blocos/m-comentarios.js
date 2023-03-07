import MalocaElement from "./MalocaElement.js";
import { serverFetch } from "../utils/fetching.js";

class MComentarios extends MalocaElement {
    constructor() {

        let html = `
        <div class="comentarios">

            <slot></slot>

        </div>
        `
        super(html);

    }

    async renderizar(estado) {

        while (this.lastChild) {
			this.removeChild(this.lastChild);
		}

        const textoId = this.getAttribute('texto');
		const imagemId = this.getAttribute('imagem');
		const topicoId = this.getAttribute('topico');
		let midiaTipo;
		let midiaId;
		if (textoId) {
			midiaTipo = 'texto';
			midiaId = textoId;
		} else if (imagemId) {
			midiaTipo = 'imagem';
			midiaId = imagemId;
		} else if (topicoId) {
			midiaTipo = 'topico';
			midiaId = topicoId;
		}

		const comunidadeId = this.getAttribute('comunidade') ? this.getAttribute('comunidade') : estado.view.id;

		const res = await serverFetch(`/comunidades/${comunidadeId}/objetos/${midiaTipo}?id=${midiaId}&comentarios=true`, 'GET');
		const comentarios = await res.json();

		// cria elementos com os comentários e suas informações
		for (let i = 0; i < comentarios.length; i++) {

			let comentario = comentarios[i];

			// cria container para agrupar o texto do comentário e as informações de postagem
			let elContainer = document.createElement('div');

			// cria elemento com o texto do comentário
			let elTexto = document.createElement('div');
			elTexto.innerText = comentario.texto;

			// cria elemento que receberá informações (pessoa que postou e data de postagem)
			let elInfo = document.createElement('div');
			
			// cria elementos com informações da pessoa que postou
			let elPessoa = document.createElement('div');
			let elAvatar = document.createElement('m-avatar');
			let elDivNomeArroba = document.createElement('div');
			let elNome = document.createElement('div');
			let elArroba = document.createElement('a');
			let res = await serverFetch(`/pessoas/${comentario.pessoa_id}`, 'GET');
			let pessoa = await res.json();
			elAvatar.setAttribute('pessoa', pessoa.nome);
			elNome.innerText = pessoa.nome;
			elArroba.innerText = '@' + pessoa.pessoa_id;
			elArroba.setAttribute('href', `/pessoa/${pessoa.pessoa_id}`);
			elArroba.setAttribute('data-link', '');
			elDivNomeArroba.appendChild(elNome);
			elDivNomeArroba.appendChild(elArroba);
			elPessoa.appendChild(elAvatar);
			elPessoa.appendChild(elDivNomeArroba);

			// cria elemento com data do comentário
			let elData = document.createElement('div');
			let dataRegex = comentario.data_criacao.matchAll(/(\d*)(?:-|T)/g); // regex para converter formato de data (timestampz do psql) em DD/MM/AAAA
			let dataMatch = [];
			for (const d of dataRegex) {
				dataMatch.push(d);
			}
			elData.innerText = 'postado em ' + dataMatch[2][1] + '/' + dataMatch[1][1] + '/' + dataMatch[0][1];

			elInfo.appendChild(elPessoa);
			elInfo.appendChild(elData);

			// estiliza elementos
			elInfo.style.display = 'flex';
			elInfo.style.justifyContent = 'space-between';
			elInfo.style.alignItems = 'flex-end';
			elInfo.style.marginTop = '0.6rem';
			elInfo.style.color = 'inherit';
			elPessoa.style.display = 'flex';
			elPessoa.style.alignItems = 'flex-end';
			elPessoa.style.gap = '0.6rem';
			elPessoa.style.color = 'inherit';
			elAvatar.redondo = false;
			elAvatar.style.width = '48px';
			elAvatar.style.height = '48px';
			elDivNomeArroba.style.textAlign = 'left';
			elDivNomeArroba.style.color = 'inherit';
			elNome.style.color = 'inherit';
			elNome.style.fontSize = '0.75rem';
			elArroba.style.color = 'inherit';
			elArroba.style.fontSize = '0.75rem';
			elData.style.color = 'inherit';
			elData.style.fontSize = '0.75rem';
			elTexto.style.width = '100%';
			elTexto.style.textAlign = 'justify';
			elTexto.style.color = 'inherit';
			elContainer.style.borderTop = '1px solid var(--cor-gris)';
			elContainer.style.padding = '1rem';
			elContainer.style.backgroundColor = 'var(--cor-fundo)';
			elContainer.style.color = 'var(--cor-fonte-view)';
			let elTotal = this.shadowRoot.querySelector('.comentarios');
			elTotal.style.marginTop = '2rem';

			elContainer.appendChild(elTexto);
			elContainer.appendChild(elInfo);

			this.appendChild(elContainer);

			// renderiza blocos
			elAvatar.renderizar(estado);
		}
    }
}

window.customElements.define('m-comentarios', MComentarios);