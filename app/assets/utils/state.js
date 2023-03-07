import { renderEstilo, renderMenu, renderNavBar, renderTabBar, renderView } from "./rendering.js";
import { router } from "./routing.js";
import { serverFetch, putPagina, cadastrar, entrar } from "./fetching.js"

const urlCliente = 'http://localhost:4200';

export const estadoPadrao = {
	urlServidor:	'http://localhost:4000',
	href:			'/boas-vindas',
	modos:			['ver'],
	modoAtivo:		'ver',
	estilo:			(JSON.parse(localStorage.getItem('estado'))) ? (JSON.parse(localStorage.getItem('estado'))).estilo : 'padrao', // inicia com o estilo armazenado localmente. Se não encontrar, começa com o estilo padrão
	temas: 			['padrao', 'ema'],
	auth:	{
		logade:			false,
		id:				null,
	},
	view:	{
		tipo:			'boasVindas',
		id:				null,
		paginas: 		null,
		paginaAtiva: 	null,
	}
}

export function getState() {
	return JSON.parse(localStorage.getItem('estado'));
}


export async function setState(estado, noPush) {

	const estadoVelho = getState();
	const textoDaViewVelha = document.querySelector('#viewer').text;
	let renderData = null;

	console.log('estadoVelho:', estadoVelho);
	console.log('estado (pré-render):', estado);

	// renderiza estilo
	renderEstilo(estado);

	// renderiza view. Só é chamado nos seguintes casos: 1) ainda não há estado armazenado, ou 2) o caminho foi alterado, ou 3) uma aba distinta foi clicada, ou 4) acabou de sair do modo editar
	if ((!estadoVelho) || (estadoVelho.href !== estado.href) || (estadoVelho.view.paginaAtiva !== estado.view.paginaAtiva) || ((estadoVelho.modoAtivo === 'editar') && (estadoVelho.modoAtivo !== estado.modoAtivo))) {
		// tenta renderizar a view. Dependendo da resposta, altera estado e tenta novamente.
		let viewer = document.querySelector('#viewer');
		let renderResult = '';
		while(renderResult !== 'rendered') {
			
			// chama o router e retorna os dados básicos da view a ser renderizada
			let dadosDoRouter = await router(estado.href);
			
			// atualiza estado com o resultado do router
			estado.href = dadosDoRouter.href;
			estado.view.tipo = dadosDoRouter.tipo;
			estado.view.id = dadosDoRouter.params.nome ? dadosDoRouter.params.nome : null;
			
			// se foi logout
			if (estado.view.tipo === 'logout') {
				let res = await serverFetch('/autenticacao/logout', 'GET');    
				if (res.status === 200) { // sucesso no logout
					estado.auth.logade = false;
					estado.auth.id = null;
					estado.modoAtivo = 'ver';
					estado.modos = ['ver'];
					estado.href = '/boas-vindas';
					estado.view.tipo = 'boasVindas';
				}
			}
			// se foi mudança de view (e não apenas troca de aba ou mudança de modo), limpa as paginas do estado (para que as novas sejam obtidas do servidor na renderização)
			if ((!estadoVelho) || (estadoVelho.href !== estado.href)) {
				estado.view.paginas = null;
				estado.view.paginaAtiva = null;
				viewer.editable = false;
			} else if ((estadoVelho.modoAtivo === 'editar') && (estado.modoAtivo !== 'editar')) {
				// se foi saída do modo editar, envia os dados da página modificada para servidor (PUT)
				putPagina(estado, viewer.text);
				viewer.editable = false;
				estado.modoAtivo = 'ver';
			}
			
			// renderiza view
			renderData = await renderView(estado);
			renderResult = renderData.resultado;
			estado = renderData.estado; // atualiza estado com as modificações feitas na renderização

			// verifica possíveis erros na renderização
			if (renderResult === '401') { // tentou acessar recurso, mas não está autenticada. Redireciona para boas-vindas
				estado.href = '/boas-vindas';
				estado.auth.logade = false;
				estado.auth.id = null;
			} else if (renderResult === 'autenticade') { // tentou entrar em boas-vindas, mas já está autenticada. Redireciona para início
				estado.href = '/';
				noPush = true;
			} else if (renderResult === 'failed') { // outros erros redirecionam para 404
				estado.href = '/404';
			}
		}

		// após renderizar view, se o push não foi desabilitado por parâmetro, faz push na history API para salvar navegação e permitir que o navegador volte e avance páginas
		if (!noPush) {
			let url = urlCliente + estado.href;
			history.pushState(null, url, url);
		}
	}

	// renderiza navBar
	renderData = await renderNavBar(estado);
	if (renderData.resultado === 'rendered') {
		estado = renderData.estado;
	}

	// renderiza barra de abas
	renderData = await renderTabBar(estado);
	if (renderData.resultado === 'rendered') {
		estado = renderData.estado;
		if (estado.modoAtivo === 'editar') { // no modo editar
			if ((estadoVelho.view.paginaAtiva !== estado.view.paginaAtiva) && (estadoVelho.href === estado.href)) { // se foi mudança de aba
				if (estadoVelho.view.paginas.length <= estado.view.paginas.length)	 { // e se não foi remoção de página
					await putPagina(estadoVelho, textoDaViewVelha); // atualiza página anterior no servidor
				}
			}
			if (((estadoVelho.view.paginaAtiva !== estado.view.paginaAtiva) && (estadoVelho.href === estado.href)) || (estadoVelho.modoAtivo !== 'editar')) {
				// se foi mudança de aba ou ativação do modo editar, ativa edição html do viewer
				let viewer = document.querySelector('#viewer');
				viewer.editable = false; // limpa edição anterior
				let html = await serverFetch(`/${estado.view.tipo}s/${estado.view.id}/${estado.view.paginaAtiva}`, 'GET'); // solicita html ao servidor
				viewer.text = await html.text(); // mostra html para edição
				viewer.editable = true; // habilita edição novamente
				viewer.focusOnIt();
			}
		}
	}

	// caso seja clique no menu, o renderiza
	if (estado.modoAtivo === 'menu') {
		await renderMenu(estado);
	} else if ((estadoVelho !== null) && (estadoVelho.modoAtivo === 'menu')) {
		// caso tenha saído do modo menu, remove o menu da DOM
		document.querySelector('maloca-menu').remove();
	}

	// caso seja a tela de boas-vindas, ativa formulários
	if (estado.view.tipo === 'boasVindas') {
			
		let viewer = document.querySelector('#viewer');
		let formCadastro = viewer.shadowRoot.getElementById('form-cadastro');
		let formLogin = viewer.shadowRoot.getElementById('form-login');

		formCadastro.addEventListener('submit', async e => {
			e.preventDefault();
			cadastrar(formCadastro);
		});

		formLogin.addEventListener('submit', async e => {
			e.preventDefault();
			entrar(formLogin)
				.then(entrou => {
					if (entrou) { // se o login teve sucesso
						estado.auth.logade = true;
						estado.auth.id = formLogin.elements['nome'].value;
						estado.href = '/';
						estado.view.tipo = 'comunidade';
						setState(estado);
					} else {
						alert('Erro ao entrar :( tente novamente');
					}
				})
		});
	}

	// grava o novo estado no armazenamento local
	localStorage.setItem('estado', JSON.stringify(estado));

	console.log('estado novo:', estado);
}