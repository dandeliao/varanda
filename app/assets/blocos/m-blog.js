import MalocaElement from "./MalocaElement.js";
import { serverFetch } from "../utils/fetching.js";

class MBlog extends MalocaElement {
    constructor() {

        let html = `
        <div class="blog">

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
        let nomeBlog = this.getAttribute('nome');

		// cria cabeçalho
		let blocoCabecalho = document.createElement('m-bloco');
		let elNomeBlog = document.createElement('h2');
		elNomeBlog.innerText = nomeBlog;
		blocoCabecalho.appendChild(elNomeBlog);
		this.appendChild(blocoCabecalho);
		this.appendChild(document.createElement('br'));

		let res = await serverFetch(`/${tipo}s/${id}/objetos/textos?blog=${nomeBlog}`, 'GET');
		let textos = await res.json();


		if (textos.length > 0) {
			
			textos.forEach(async txt => {
				
				let elBloco = document.createElement('m-bloco');

				// cria elemento com o texto da postagem
				let elTexto = document.createElement('m-texto');
				let textoId;
				if (tipo === 'pessoa') {
					textoId = txt.texto_pessoal_id;
				} else if (tipo === 'comunidade') {
					textoId = txt.texto_comunitario_id;
				}
				elTexto.setAttribute('numero', textoId);
				elTexto.setAttribute(`${tipo}`, id); // pessoa=id-da-pessoa ou comunidade=id-da-comunidade

				// cria elemento que receberá informações (pessoa que postou, data de postagem, comentários)
				let elInfo = document.createElement('div');
				
				// cria elementos com informações da pessoa que postou
				let elPessoa = document.createElement('div');
				let elAvatar = document.createElement('m-avatar');
				let elDivNomeArroba = document.createElement('div');
				let elNome = document.createElement('div');
				let elArroba = document.createElement('a');
				let res = await serverFetch(`/pessoas/${txt.pessoa_id}`, 'GET');
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

				// cria elementos com data da postagem e botão para ver os comentários (botão apenas em blogs de comunidade)
				let elDadosPostagem = document.createElement('div');
				let elData = document.createElement('div');
				// regex para converter formato de data (timestampz do psql) em DD/MM/AAAA
				let dataRegex = txt.data_criacao.matchAll(/(\d*)(?:-|T)/g);
				let dataMatch = [];
				for (const d of dataRegex) {
					dataMatch.push(d);
				}
				elData.innerText = 'postado em ' + dataMatch[2][1] + '/' + dataMatch[1][1] + '/' + dataMatch[0][1];
				elDadosPostagem.appendChild(elData);
				let elBotaoComentarios;
				if (tipo === 'comunidade') { // posts em perfis pessoais não têm comentários, só posts em comunidades
					elBotaoComentarios = document.createElement('button');
					elBotaoComentarios.innerText = 'ver comentários';
					elDadosPostagem.appendChild(elBotaoComentarios);
				}

				elInfo.appendChild(elPessoa);
				elInfo.appendChild(elDadosPostagem);

				// estiliza elementos
				elInfo.style.display = 'flex';
				elInfo.style.justifyContent = 'space-between';
				elInfo.style.alignItems = 'flex-end';
				elInfo.style.gap = '2rem';
				elInfo.style.borderTop = '1px dashed var(--cor-destaque)';
				elInfo.style.paddingTop = '0.75rem';
				elTexto.style.width = '100%';
				elPessoa.style.display = 'flex';
				elPessoa.style.alignItems = 'flex-end';
				elPessoa.style.gap = '0.6rem';
				elAvatar.redondo = false;
				elAvatar.style.width = '64px';
				elAvatar.style.height = '64px';
				elDivNomeArroba.style.textAlign = 'left';
				elDadosPostagem.style.display = 'flex';
				elDadosPostagem.style.flexDirection = 'column';
				elDadosPostagem.style.justifyContent = 'flex-end';
				elDadosPostagem.style.gap = '1rem';

				elBloco.appendChild(elTexto);
				elBloco.appendChild(elInfo);
				this.appendChild(elBloco);
				this.appendChild(document.createElement('br'));

				// renderiza blocos
				elAvatar.renderizar(estado);
				elTexto.renderizar(estado);

				if (tipo === 'comunidade') { // posts em perfis pessoais não têm comentários, só posts em comunidades

					// adiciona informações como atributos no botão
					elBotaoComentarios.setAttribute('textoId', textoId);
					elBotaoComentarios.setAttribute(`${tipo}`, id); // pessoa=id-da-pessoa ou comunidade=id-da-comunidade
					
					// quando clicado, exibe comentários
					if (!noEvent) {
						elBotaoComentarios.addEventListener('click', async e => {
						
							// alterna entre botão pressionado/solto
							e.target.classList.toggle('pressionado');
	
							// encontra o bloco m-texto parente do botão
							const textos = this.querySelectorAll('m-texto');
							const blocoTexto = Array.from(textos).find(t => t.getAttribute('numero') == textoId);
	
							if (e.target.classList.contains('pressionado')) {
	
								// estiliza botão pressionado
								e.target.innerText = 'ocultar comentários';
								e.target.style.backgroundColor = 'var(--cor-principal)';
								e.target.style.color = 'var(--cor-fonte-barra)';
								e.target.style.borderTop = '0.1rem solid #1B1B1B';
								e.target.style.borderLeft = '0.1rem solid #1B1B1B';
								e.target.style.borderBottom = '1px solid var(--cor-fundo-2)';
								e.target.style.borderRight = '1px solid var(--cor-fundo-2)';
	
								// cria bloco que exibe comentários
								let elComentarios = document.createElement('m-comentarios');
								elComentarios.setAttribute('texto', textoId);
								elComentarios.setAttribute('comunidade', id);
								elComentarios.classList.add('secao-comentarios');
								blocoTexto.parentElement.appendChild(elComentarios);
								elComentarios.renderizar(estado);
	
								// cria bloco com formulário para adicionar novo comentário
								let elAdicionar = document.createElement('m-adicionar-comentario');
								elAdicionar.setAttribute('texto', textoId);
								elAdicionar.setAttribute('comunidade', id);
								elAdicionar.classList.add('secao-comentarios');
								blocoTexto.parentElement.appendChild(elAdicionar);
								elAdicionar.renderizar(estado);
	
	
							} else {
	
								// estiliza botão não-pressionado
								e.target.innerText = 'ver comentários';
								e.target.style.backgroundColor = 'var(--cor-destaque)';
								e.target.style.color = 'var(--cor-fonte-view)';
								e.target.style.borderTop = '0.1rem solid var(--cor-fundo-2)';
								e.target.style.borderLeft = '0.1rem solid var(--cor-fundo-2)';
								e.target.style.borderBottom = '1px solid #1B1B1B';
								e.target.style.borderRight = '1px solid #1B1B1B';
								
								blocoTexto.parentElement.querySelectorAll('.secao-comentarios').forEach(el => {
									el.parentNode.removeChild(el)
								})
	
							}
						});
					}
				}
			});
		} else {
			console.log('Não há textos para mostrar');

			let elBloco = document.createElement('m-bloco');
			let aviso = document.createElement('p');
			aviso.innerText = 'Não há textos para mostrar';
			elBloco.appendChild(aviso);
			this.appendChild(elBloco);
			this.appendChild(document.createElement('br'));
		}
    }
}

window.customElements.define('m-blog', MBlog);