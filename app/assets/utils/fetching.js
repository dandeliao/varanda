import { estadoPadrao } from "./state.js";

export async function serverFetch (caminho, metodo, dados, contentType) {

	const urlApi = estadoPadrao.urlServidor;

	let requestObject = {
		method: metodo,
		withCredentials: true,
		credentials: 'include',
	}

	if (dados) {
		if (dados instanceof FormData) {
			requestObject.body = dados;
		} else {
			requestObject.headers = { 'Content-Type': 'application/json' };
			requestObject.body = JSON.stringify(dados)
		}
	}

	if (contentType) {
		requestObject.headers = { 'Content-Type': contentType };
	}

	return await fetch(`${urlApi}${caminho}`, requestObject);

}

export async function putPagina(estado, texto) {

	let paginaAtual = estado.view.paginas.find(pag => pag.id == estado.view.paginaAtiva);
	let dadosAtualizadosPagina = {
		titulo:             paginaAtual.titulo,
		publica:            paginaAtual.publica,
		html:               texto
	}

	if (estado.view.tipo === 'pessoa') {
		return await serverFetch(`/pessoas/${estado.auth.id}/${paginaAtual.id}`, 'PUT', dadosAtualizadosPagina);
	} else if (estado.view.tipo === 'comunidade') {
		return await serverFetch(`/comunidades/${estado.view.id}/${paginaAtual.id}`, 'PUT', dadosAtualizadosPagina);
	} else {
		return;
	}
	
}

export async function cadastrar(form) {

	const urlApi = estadoPadrao.urlServidor;

	if (form.elements['senha'].value === form.elements['senha2'].value) {
		const dados = {
			pessoa_id: form.elements['nome'].value,
			nome: form.elements['nome'].value,
			email: form.elements['email'].value,
			senha: form.elements['senha'].value
		}

		fetch(`${urlApi}/autenticacao/registro`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			withCredentials: true,
			credentials: 'include',
			body: JSON.stringify(dados)
		}).then(res => {
			if (res.status === 201) { // status 201 = criado
				form.reset();
				alert('Registrade com sucesso! Agora é só fazer o login :)');
			} else {
				alert('Desculpe, aconteceu um erro ao fazer seu registro. Tente novamente');
			}
		});
	} else {
		alert('As senhas digitadas são diferentes');
	}
	form.reset();
}

export async function entrar(form) {

	const urlApi = estadoPadrao.urlServidor;

	const dados = {
		pessoa_id: form.elements['nome'].value,
		senha: form.elements['senha'].value
	}

	let res = await fetch(`${urlApi}/autenticacao/login`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		withCredentials: true,
		credentials: 'include',
		body: JSON.stringify(dados)
	});

	if (res.ok) { // pessoa foi autenticada com sucesso
		return true;
	} else { // erro no login
		return false;
	}
}