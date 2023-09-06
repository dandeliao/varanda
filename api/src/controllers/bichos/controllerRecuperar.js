const servicePessoas = require('../../services/bichos/servicePessoas');
const serviceRecuperacoes = require('../../services/bichos/serviceRecuperacoes');
const asyncHandler = require('express-async-handler');
const customError = require('http-errors');
const path = require('path');
const fs = require('fs');
const { transporter } = require('../../config/nodemailer');
require('dotenv').config();

exports.getRecuperar = asyncHandler(async (req, res, next) => {
	const pessoa = await servicePessoas.verPessoa(req.params.arroba);
	if (!pessoa) {
		res.status(200).json({message: 'Verifique seu email para um link de recuperação.'}); // na verdade, não encontrou a pessoa. Para não revelar a info, retorna OK
	}

	const existeRecuperacao = await serviceRecuperacoes.verRecuperacao(req.params.arroba);
	if (existeRecuperacao) {
		res.status(200).json({message: 'Verifique seu email para um link de recuperação.'});
	} else {

		const recuperacao = await serviceRecuperacoes.criarRecuperacao(req.params.arroba);

		// envia email
		const email = await servicePessoas.verEmail(req.params.arroba);

		const mailOptions = {
			from: process.env.EMAIL_ADDRESS,
			to: email,
			subject: 'Recuperação de senha',
			html: `
			<h2>Varanda</h2>
			<h3>Recuperação de senha</h3>
			<br>
			<p>Acesse o link a seguir para criar uma nova senha e recuperar seu acesso à Varanda:</p>
			<br>
			<form method="POST" action="${process.env.SERVER_URL}/bichos/pessoas/${req.params.arroba}/recuperacao" class="inline">
				<input type="hidden" name="recuperacao_id" value="${recuperacao.recuperacao_id}">
				<button type="submit" class="link-button">
					Criar nova senha
				</button>
			</form>
			<br>
			<br>
			<br>
			<br>
			<br>
			<p>---</p>
			<p>Este é um email automático.</p>
			<style>
				.inline {
				display: inline;
				}
			
				.link-button {
				background: none;
				border: none;
				color: blue;
				text-decoration: underline;
				cursor: pointer;
				font-size: 1em;
				font-family: serif;
				}
				.link-button:focus {
				outline: none;
				}
				.link-button:active {
				color:red;
				}
			</style>`
		};
		
		transporter.sendMail(mailOptions, function(error, info) {
			if (error) {
				throw customError(500, 'Erro ao enviar e-mail de recuperação.');
			} else {
				console.log('Email sent: ' + info.response);
				res.status(200).json({message: 'Verifique seu email para um link de recuperação.'});
			}
		}); 
		
		// res.status(200).json({message: 'Verifique seu email para um link de recuperação.'});
		// res.status(200).json({message: 'Verifique seu email para um link de recuperação.', email: email, codigo: recuperacao.recuperacao_id}); // temporário, para testes
	}
});

exports.postRecuperar = asyncHandler(async (req, res, next) => {

	// confere código de recuperacao
	if (!req.body.recuperacao_id) {
		throw customError(400, 'É necessário um código de recuperação');
	}
	const recuperacao = await serviceRecuperacoes.verRecuperacao(req.params.arroba);
	if (req.body.recuperacao_id !== recuperacao.recuperacao_id) {
		throw customError(400, 'O código de recuperação fornecido não foi encontrado.');
	}

	// cria e retorna página de recuperação que receberá nova senha e redirecionará para putRecuperar
	let pagina = `
	<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Varanda - Criar nova senha</title>
	</head>
	<body>

		<div id="bv-hero">
			<h1>Varanda</h1>
		</div>
		
		<div id="bv-forms">
			<form id="form-cadastro">
				<h3>Crie uma nova senha:</h3>
				<br>
				<label for="senha" hidden>senha</label>
				<input type="password" id="senha-cadastro" placeholder="nova senha" name="senha" required>
				<br>
				<br>
				<label for="senha2" hidden>confirme sua senha</label>
				<input type="password" id="senha2-cadastro" placeholder="repita a nova senha" name="senha2" required>
				<br>
				<br>
				<br>
				<button type="submit">Confirmar</button>
			</form>
		</div>
		
		<style>
			#bv-hero {
				text-align: center;
			}
		
			#bv-forms {
				margin-top: 2rem;
				display: flex;
				flex-direction: row;
				justify-content: space-around;
			}
		</style>

		
		<script>
			let formCadastro = document.getElementById('form-cadastro');
			formCadastro.addEventListener('submit', async e => {
				e.preventDefault();
				cadastrar(formCadastro);
			});
			async function cadastrar(form) {
			
				if (form.elements['senha'].value === form.elements['senha2'].value) {
					const dados = {
						recuperacao_id: '${req.body.recuperacao_id}',
						bicho_id: '${req.params.arroba}',
						senha: form.elements['senha'].value
					};
			
					fetch('${process.env.SERVER_URL}/bichos/pessoas/${req.params.arroba}/recuperar', {
						method: 'PUT',
						headers: {
							'Content-Type': 'application/json'
						},
						withCredentials: true,
						credentials: 'include',
						body: JSON.stringify(dados)
					}).then(res => {
						if (res.status === 200) {
							form.reset();
							alert('Senha alterada com sucesso! Agora é só fazer o login :)');
						} else {
							alert('Desculpe, aconteceu um erro ao alterar a senha. Tente novamente');
						}
					});
				} else {
					alert('As senhas digitadas são diferentes');
				}
				form.reset();
			}
		</script>

	</body>
	</html>
	`;
	res.setHeader('Content-type','text/html');
	res.send(pagina);

});

exports.putRecuperar = asyncHandler(async (req, res, next) => {

	console.log('entrou em putRecuperar');
	if (!req.body.recuperacao_id || !req.body.senha) {
		throw customError(400, 'Falta senha e/ou código de recuperação.');
	}

	const recuperado = await serviceRecuperacoes.verRecuperacao(req.params.arroba);
	if (!recuperado) {
		throw customError(404, 'Código de recuperação não encontrado');
	}	
	if (recuperado.recuperacao_id !== req.body.recuperacao_id) {
		throw customError(404, 'Código de recuperação não encontrado');
	}

	const editado = await servicePessoas.editarSegredos(req.params.arroba, {senha: req.body.senha});
	console.log(editado);

	const deletado = await serviceRecuperacoes.deletarRecuperacao(req.body.recuperacao_id);
	console.log(deletado);

	res.status(200).json({message: 'Senha alterada com sucesso!'});
});