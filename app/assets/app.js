/* nota: colocar sempre a extensão (.js) no final do nome dos arquivos,
       para que o servidor redirecione corretamente os imports. */
import { router } from './utils/routing.js';
import { estadoPadrao, getState, setState } from './utils/state.js';
import { serverFetch } from './utils/fetching.js';

const urlApi = estadoPadrao.urlServidor;
const urlCliente = 'http://localhost:4200';

// history api listener
window.addEventListener('popstate', async () => {
    let dadosDoRouter = await router(location.pathname);
    let estado = getState();
    estado.href = dadosDoRouter.href;
    estado.view.tipo = dadosDoRouter.tipo;
    estado.view.id = dadosDoRouter.params.nome ? dadosDoRouter.params.nome : null;
    await setState(estado, 'noPush');
});

// carregamento inicial
document.addEventListener('DOMContentLoaded', async () => {

    // limpa estado armazenado de carregamento anterior
    localStorage.clear();

    // inicializa com a rota correspondente ao caminho da barra de endereços
    let estadoInicial = estadoPadrao;
    let dadosDoRouter = await router(location.pathname);
    estadoInicial.href = dadosDoRouter.href;
    estadoInicial.view.tipo = dadosDoRouter.tipo;
	estadoInicial.view.id = dadosDoRouter.params.nome ? dadosDoRouter.params.nome : null;
    await setState(estadoInicial);

    // captura o clique em links internos
    document.body.addEventListener('click', async e => {
        
        let estado = getState();
        let insideTarget = e.composedPath()[0]; // esse é o target verdadeiro dentro da shadow root
        
        if (insideTarget.matches('[data-link]')) {
            e.preventDefault();
            if (insideTarget.href) {
                estado.href = (insideTarget.href).replace(urlCliente, '');
                let dadosDoRouter = await router(estado.href);
                estado.view.tipo = dadosDoRouter.tipo;
                estado.view.id = dadosDoRouter.params.nome ? dadosDoRouter.params.nome : null;
                estado.modoAtivo = 'ver';
                
                await setState(estado);
            }
        }
    });
            
    // captura clique na barra de navegação
    let navBar = document.getElementById('nav-bar');
    navBar.addEventListener('click', async e => {

        let estado = getState();
        e.preventDefault();

        // se o modo clicado já estiver ativo, desativa (muda para 'ver'). Senão, ativa.
        if (estado.modoAtivo === e.target.id) {
            estado.modoAtivo = 'ver';
        } else {
            switch (e.target.id) {
                case 'menu':
                    estado.modoAtivo = 'menu';
                    break;
                case 'inicio':
                    // abre view da página inicial da maloca
                    estado.modoAtivo = 'ver';
                    estado.href = '/';
                    break;
                case 'editar':
                    estado.modoAtivo = 'editar';
                    break;
                case 'clonar':
                    estado.modoAtivo = 'clonar';
                    break;
                case 'info':
                    estado.modoAtivo = 'info';
                    break;
                default:
                    // muda tema
                    let arrayEstilos = estadoPadrao.temas;
                    let indexEstilo = arrayEstilos.findIndex(estilo => estilo === estado.estilo);
                    
                    if (indexEstilo < arrayEstilos.length - 1) {
                        indexEstilo++;
                        estado.estilo = arrayEstilos[indexEstilo];
                    } else {
                        estado.estilo = 'padrao';
                    }
            }
        }

        await setState(estado);

    });

    // captura clique na barra de abas
    let tabBar = document.getElementById('tab-bar');
    tabBar.addEventListener('click', async e => {

        let estado = getState();
        e.preventDefault();

        let insideTarget = e.composedPath()[0]; // esse é o target verdadeiro dentro da shadow root. Útil para indicar, por exemplo, um clique no "X" (deletar) em modo edição

        let abaClicada = estado.view.paginaAtiva; // a variável abaClicada começa com o valor da aba que já está ativa. Importante caso o target não seja uma aba ou caso a criação de nova aba falhe
        if (e.target.id === 'nova-pagina') { // no modo edição um clique na aba "+" cria nova página
            const dadosNovaPagina = {
				titulo: 'nova-pagina',
				publica: true,
				html: ''
			}

            if (estado.view.tipo === "pessoa") {
                dadosNovaPagina.pessoa_id = estado.auth.id;
                let res = await serverFetch(`/pessoas/${estado.auth.id}/paginas`, 'POST', dadosNovaPagina);
                if (res.status === 201) { // status 201 = página criada com sucesso
                    let r = await res.json();
                    abaClicada = r.pagina_pessoal_id;
                    estado.view.paginas.push({
                        id: r.pagina_pessoal_id,
                        titulo: r.titulo,
                        publica: r.publica,
                        criacao: r.criacao
                    });
                } else {
                    alert('Aconteceu um erro ao criar a página. Por favor, tente novamente');
                }
            } else if (estado.view.tipo === "comunidade") {
                dadosNovaPagina.comunidade_id = estado.view.id;
                let res = await serverFetch(`/comunidades/${estado.view.id}/paginas`, 'POST', dadosNovaPagina);
                if (res.status === 201) { // status 201 = página criada com sucesso
                    let r = await res.json();
                    abaClicada = r.pagina_comunitaria_id;
                    estado.view.paginas.push({
                        id: r.pagina_comunitaria_id,
                        titulo: r.titulo,
                        publica: r.publica,
                        criacao: r.criacao
                    });
                } else {
                    alert('Aconteceu um erro ao criar a página. Por favor, tente novamente');
                }
            }
        } else { 
            
            if (e.target.pageId) { // clique em uma aba (exceto aba "+")
                if (insideTarget.getAttribute('id') === 'delete') { // clique no botão "deletar página"
                    // falta aviso perguntando se a pessoa tem certeza
                    // caso confirme
                    //  -> caso sucesso
                    //      -> fazer fetch delete e atualizar estado, mudando abaClicada para a primeira da lista
                    let res = await serverFetch(`/${estado.view.tipo}s/${estado.view.id}/${e.target.pageId}`, 'DELETE');
                    if (res.status === 204) { // status 204 = recurso não encontrado (deletou com sucesso)
                        // deleta página da lista de páginas no estado
                        let indicePagDeletada;
                        let paginaDeletada;
                        for (let i = 0; i < estado.view.paginas.length; i++) {
                            if (estado.view.paginas[i].id == e.target.pageId) { // tipos diferentes, comparador === não funciona
                                indicePagDeletada = i;
                            }
                        }
                        if (indicePagDeletada !== undefined) {
                            paginaDeletada = estado.view.paginas.splice(indicePagDeletada, 1)[0];
                        }

                        // muda aba ativa ('clicada') para primeira página disponível, se a atual tiver sido deletada
                        if (paginaDeletada.id === estado.view.paginaAtiva) {
                            abaClicada = estado.view.paginas[0].id;
                        }
                    } else {
                        alert('Aconteceu um erro ao deletar a página. Por favor, tente novamente');
                    }
                    //  -> caso fracasso
                    //      -> exibir aviso com mensagem de erro recebida
                    // caso cancele, prosseguir sem deletar
                
                } else if (insideTarget.getAttribute('id') === 'editTitle') { // clique no botão "editar título da página"
                    
                    // cria elemento editável sobreposto ao título da aba
                    let tituloEditavel = document.createElement('div');
                    tituloEditavel.innerText = e.target.texto;
                    tituloEditavel.contentEditable = true;
                    tituloEditavel.style.position = 'absolute';
                    tituloEditavel.style.zIndex = 500;
                    tituloEditavel.style.backgroundColor = "#FEFEFE";
                    tituloEditavel.style.overflow = 'auto';
                    tituloEditavel.style.fontSize = '0.75rem';
                    let posicao = e.target.posicaoTitulo;
                    let tamanho = e.target.tamanhoTitulo;
                    tituloEditavel.style.left = `${posicao[0]}px`;
                    tituloEditavel.style.top = `${posicao[1]}px`;
                    tituloEditavel.style.width = `${tamanho[0]}px`;
                    tituloEditavel.style.height = `${tamanho[1]}px`;
                    tituloEditavel.setAttribute('numeroDaPagina', e.target.pageId);
                    document.body.appendChild(tituloEditavel);

                    // cria overlay
                    let overlayTituloEditavel = document.createElement('div');
                    overlayTituloEditavel.style.position = 'fixed';
                    overlayTituloEditavel.style.display = 'block';
                    overlayTituloEditavel.style.width = '100%';
                    overlayTituloEditavel.style.height = '100%';
                    overlayTituloEditavel.style.top = '0px';
                    overlayTituloEditavel.style.left = '0px';
                    overlayTituloEditavel.style.backgroundColor = 'rgba(0,0,0,0.5)';
                    overlayTituloEditavel.style.zIndex = 400;
                    document.body.appendChild(overlayTituloEditavel);

                    tituloEditavel.focus();

                    tituloEditavel.addEventListener('blur', evento => { // evento 'blur' acontece quando o elemento perde o foco
                        e.target.texto = tituloEditavel.innerText;
                        let estadinho = getState();
                        estadinho.view.paginaAtiva = e.target.pageId;
                        estadinho.view.paginas.forEach(pagina => {
                            if (pagina.id == e.target.pageId) {
                                pagina.titulo = tituloEditavel.innerText;
                            }
                        });
                        overlayTituloEditavel.remove();
                        tituloEditavel.remove();
                        setState(estadinho);
                    });

                } else { // caso o clique tenha sido na aba em si
                    let paginasMatch = estado.view.paginas.find(pag => pag.id == e.target.pageId); // encontra aba clicada entre as páginas possíveis no estado atual
                    abaClicada = paginasMatch.id;
                }
            }
        }
        
        // atualiza estado
        estado.view.paginaAtiva = abaClicada;
        await setState(estado, 'noPush');

    }); 
});