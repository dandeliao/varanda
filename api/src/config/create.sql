CREATE DATABASE varanda

CREATE TABLE pessoas(
    pessoa_id       VARCHAR(16) PRIMARY KEY NOT NULL,
    nome            VARCHAR(32) NOT NULL,
    descricao       VARCHAR(500),
    avatar          VARCHAR(255) DEFAULT 'avatar.jpg',
    fundo           VARCHAR(255) DEFAULT 'fundo.jpg',
    data_ingresso   TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE autenticacao(
    pessoa_id       VARCHAR(16) PRIMARY KEY REFERENCES pessoas(pessoa_id),
    email           VARCHAR UNIQUE NOT NULL,
    hash            VARCHAR NOT NULL,
    salt            VARCHAR NOT NULL
);

CREATE TABLE paginas_pessoais(
    pagina_pessoal_id   BIGSERIAL PRIMARY KEY NOT NULL,
    pessoa_id           VARCHAR(16) REFERENCES pessoas(pessoa_id) ON DELETE CASCADE,
    ordem               SERIAL NOT NULL,
    titulo              VARCHAR(32),
    publica             BOOLEAN DEFAULT false,
    criacao             TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE albuns_pessoais (
    album_pessoal_id    VARCHAR(32) PRIMARY KEY NOT NULL,
    pessoa_id           VARCHAR(16) NOT NULL REFERENCES pessoas(pessoa_id) ON DELETE CASCADE,
    capa_id             INT
);

CREATE TABLE imagens_pessoais (
    imagem_pessoal_id   BIGSERIAL PRIMARY KEY NOT NULL,
    album_pessoal_id    VARCHAR(32) REFERENCES albuns_pessoais(album_pessoal_id) ON DELETE CASCADE,
    pessoa_id           VARCHAR(16) REFERENCES pessoas(pessoa_id) ON DELETE CASCADE,
    nome_arquivo        VARCHAR(255) NOT NULL,
    titulo              VARCHAR(150),
    descricao           VARCHAR(500),
    sensivel            BOOLEAN DEFAULT false,
    aviso_de_conteudo   VARCHAR(150),
    data_criacao        TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE blogs_pessoais (
    blog_pessoal_id     VARCHAR(32) PRIMARY KEY NOT NULL,
    pessoa_id           VARCHAR(16) NOT NULL REFERENCES pessoas(pessoa_id) ON DELETE CASCADE
);

CREATE TABLE textos_pessoais (
    texto_pessoal_id    BIGSERIAL PRIMARY KEY NOT NULL,
    blog_pessoal_id     VARCHAR(32) REFERENCES blogs_pessoais(blog_pessoal_id) ON DELETE CASCADE,
    pessoa_id           VARCHAR(16) REFERENCES pessoas(pessoa_id) ON DELETE CASCADE,
    titulo              VARCHAR(150),
    sensivel            BOOLEAN DEFAULT false,
    aviso_de_conteudo   VARCHAR(150),
    data_criacao        TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sessoes (
    sid VARCHAR COLLATE "default",
    sess json NOT NULL,
    expire timestamp(6) NOT NULL,
    CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
);
CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON sessoes ("expire");

CREATE TABLE comunidades(
    comunidade_id   VARCHAR(16) PRIMARY KEY NOT NULL,
    nome            VARCHAR(32) NOT NULL,
    descricao       VARCHAR(500),
    avatar          VARCHAR(255) DEFAULT 'avatar_comum.jpg',
    fundo           VARCHAR(255) DEFAULT 'fundo_comum.jpg',
    aberta          BOOLEAN DEFAULT true,
    criacao         TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pessoas_comunidades(
    pessoa_id       VARCHAR(16) REFERENCES pessoas(pessoa_id) ON DELETE CASCADE,
    comunidade_id   VARCHAR(16) REFERENCES comunidades(comunidade_id) ON DELETE CASCADE,
    participar      BOOLEAN DEFAULT true,
    editar          BOOLEAN DEFAULT false,
    moderar         BOOLEAN DEFAULT false,
    cuidar          BOOLEAN DEFAULT false
);

CREATE TABLE paginas_comunitarias(
    pagina_comunitaria_id   SERIAL PRIMARY KEY NOT NULL,
    comunidade_id           VARCHAR(16) REFERENCES comunidades(comunidade_id) ON DELETE CASCADE,
    ordem                   SERIAL NOT NULL,
    titulo                  VARCHAR(32),
    publica                 BOOLEAN DEFAULT false,
    criacao                 TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE albuns_comunitarios (
    album_comunitario_id    VARCHAR(32) PRIMARY KEY NOT NULL,
    comunidade_id           VARCHAR(16) NOT NULL REFERENCES comunidades(comunidade_id) ON DELETE CASCADE,
    capa_id                 INT
);

CREATE TABLE imagens_comunitarias (
    imagem_comunitaria_id   BIGSERIAL PRIMARY KEY NOT NULL,
    album_comunitario_id    VARCHAR(32) REFERENCES albuns_comunitarios(album_comunitario_id) ON DELETE CASCADE,
    comunidade_id           VARCHAR(16) REFERENCES comunidades(comunidade_id) ON DELETE CASCADE,
    pessoa_id               VARCHAR(16) REFERENCES pessoas(pessoa_id) ON DELETE SET NULL,
    nome_arquivo            VARCHAR(255) NOT NULL,
    titulo                  VARCHAR(150),
    descricao               VARCHAR(500),
    sensivel                BOOLEAN DEFAULT false,
    aviso_de_conteudo       VARCHAR(150),
    data_criacao            TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE blogs_comunitarios (
    blog_comunitario_id     VARCHAR(32) PRIMARY KEY NOT NULL,
    comunidade_id           VARCHAR(16) NOT NULL REFERENCES comunidades(comunidade_id) ON DELETE CASCADE
);

CREATE TABLE textos_comunitarios (
    texto_comunitario_id    BIGSERIAL PRIMARY KEY NOT NULL,
    blog_comunitario_id     VARCHAR(32) REFERENCES blogs_comunitarios(blog_comunitario_id) ON DELETE CASCADE,
    comunidade_id           VARCHAR(16) REFERENCES comunidades(comunidade_id) ON DELETE CASCADE,
    pessoa_id               VARCHAR(16) REFERENCES pessoas(pessoa_id) ON DELETE SET NULL,
    titulo                  VARCHAR(150),
    sensivel                BOOLEAN DEFAULT false,
    aviso_de_conteudo       VARCHAR(150),
    data_criacao            TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE foruns (
    forum_id                VARCHAR(32) PRIMARY KEY NOT NULL,
    comunidade_id           VARCHAR(16) NOT NULL REFERENCES comunidades(comunidade_id) ON DELETE CASCADE
);

CREATE TABLE topicos (
    topico_id               BIGSERIAL PRIMARY KEY NOT NULL,
    forum_id                VARCHAR(32) REFERENCES foruns(forum_id) ON DELETE CASCADE,
    pessoa_id               VARCHAR(16) REFERENCES pessoas(pessoa_id) ON DELETE SET NULL,
    titulo                  VARCHAR(150) NOT NULL,
    texto                   TEXT,
    fixado                  BOOLEAN DEFAULT false,
    sensivel                BOOLEAN DEFAULT false,
    aviso_de_conteudo       VARCHAR(150),
    data_criacao            TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE blocos(
    bloco_id            VARCHAR(32) PRIMARY KEY NOT NULL,
    descricao           VARCHAR(500) NOT NULL,
    pessoal             BOOLEAN DEFAULT false,
    comunitario         BOOLEAN DEFAULT true,
    armazena_arquivos   BOOLEAN DEFAULT false,
    armazena_dados      BOOLEAN DEFAULT false,
    criacao             TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE blocos_paginas_pessoais(
    bloco_pagina_pessoal_id     SERIAL PRIMARY KEY,
    bloco_id                    VARCHAR(32) REFERENCES blocos(bloco_id) ON DELETE SET NULL,
    pagina_pessoal_id           SERIAL REFERENCES paginas_pessoais(pagina_pessoal_id) ON DELETE CASCADE
);

CREATE TABLE blocos_paginas_comunitarias(
    bloco_pagina_comunitaria_id     SERIAL PRIMARY KEY,
    bloco_id                        VARCHAR(32) REFERENCES blocos(bloco_id) ON DELETE SET NULL,
    pagina_comunitaria_id           SERIAL REFERENCES paginas_comunitarias(pagina_comunitaria_id) ON DELETE CASCADE
);

CREATE TABLE comentarios(
    comentario_id       BIGSERIAL PRIMARY KEY,
    pessoa_id           VARCHAR(16) REFERENCES pessoas(pessoa_id) ON DELETE SET NULL,
    comunidade_id       VARCHAR(16) REFERENCES comunidades(comunidade_id) ON DELETE CASCADE,
    texto               TEXT NOT NULL,
    sensivel            BOOLEAN DEFAULT false,
    aviso_de_conteudo   VARCHAR(150),
    data_criacao        TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comentarios_imagens_comunitarias(
    comentario_id           BIGINT NOT NULL REFERENCES comentarios(comentario_id) ON DELETE CASCADE,
    imagem_comunitaria_id   BIGINT NOT NULL REFERENCES imagens_comunitarias(imagem_comunitaria_id) ON DELETE CASCADE,
    PRIMARY KEY (comentario_id, imagem_comunitaria_id)
);

CREATE TABLE comentarios_textos_comunitarios(
    comentario_id           BIGINT NOT NULL REFERENCES comentarios(comentario_id) ON DELETE CASCADE,
    texto_comunitario_id    BIGINT NOT NULL REFERENCES textos_comunitarios(texto_comunitario_id) ON DELETE CASCADE,
    PRIMARY KEY (comentario_id, texto_comunitario_id)
);

CREATE TABLE comentarios_topicos(
    comentario_id           BIGINT NOT NULL REFERENCES comentarios(comentario_id) ON DELETE CASCADE,
    topico_id               BIGINT NOT NULL REFERENCES topicos(topico_id) ON DELETE CASCADE,
    PRIMARY KEY (comentario_id, topico_id)
);