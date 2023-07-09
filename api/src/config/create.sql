CREATE DATABASE varanda

/* Agência (bichos) */

CREATE TABLE bichos(
    bicho_id            VARCHAR(16) PRIMARY KEY NOT NULL,
    nome                VARCHAR(32) NOT NULL,
    descricao           VARCHAR(500),
    avatar              VARCHAR(255) DEFAULT 'avatar.jpg',
    descricao_avatar    VARCHAR(500) DEFAULT 'imagem de perfil',
    fundo               VARCHAR(255) DEFAULT 'fundo.jpg',
    descricao_fundo     VARCHAR(500) DEFAULT 'imagem de fundo',
    criacao             TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pessoas(
    email           VARCHAR UNIQUE NOT NULL,
    hash            VARCHAR NOT NULL,
    salt            VARCHAR NOT NULL
) INHERITS (bichos);

CREATE TABLE comunidades(
    bicho_criador_id            VARCHAR(16) REFERENCES bichos(bicho_id) ON DELETE SET NULL,
    participacao_livre          BOOLEAN DEFAULT false,
    participacao_com_convite    BOOLEAN DEFAULT true,
    periodo_geracao_convite     INT DEFAULT 0
) INHERITS (bichos);

CREATE TABLE convites(
    convite_id      SERIAL PRIMARY KEY DEFAULT gen_random_uuid(),
    bicho_id        VARCHAR(16) REFERENCES bichos(bicho_id) ON DELETE CASCADE,
    comunidade_id   VARCHAR(16) REFERENCES comunidades(bicho_id) ON DELETE CASCADE,
    criacao         TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE relacoes(
    bicho_id        VARCHAR(16) REFERENCES bichos(bicho_id) ON DELETE CASCADE,
    comunidade_id   VARCHAR(16) REFERENCES comunidades(bicho_id) ON DELETE CASCADE,
    participar      BOOLEAN DEFAULT true,
    editar          BOOLEAN DEFAULT false,
    moderar         BOOLEAN DEFAULT false,
    representar     BOOLEAN DEFAULT false
);

CREATE TABLE bichos_padrao(
    bicho_padrao_id     SERIAL PRIMARY KEY NOT NULL,
    descricao           VARCHAR(500) DEFAULT 'Olá! Bem-vinde à minha varanda.',
    avatar              VARCHAR(255),
    descricao_avatar    VARCHAR(500),
    fundo               VARCHAR(255),
    descricao_fundo     VARCHAR(500)
);

CREATE TABLE sessoes (
    sid VARCHAR COLLATE "default",
    sess json NOT NULL,
    expire timestamp(6) NOT NULL,
    CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
);
CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON sessoes ("expire");

/* Contexto (varandas, páginas) */

CREATE TABLE varandas(
    varanda_id      SERIAL PRIMARY KEY NOT NULL,
    bicho_id        VARCHAR(16) REFERENCES bichos(bicho_id) ON DELETE CASCADE,
    comunitaria     BOOLEAN NOT NULL,
);

CREATE TABLE paginas(
    pagina_id       SERIAL PRIMARY KEY NOT NULL,
    varanda_id      VARCHAR(16) REFERENCES varandas(varanda_id) ON DELETE CASCADE,
    ordem           SERIAL NOT NULL,
    titulo          VARCHAR(32),
    publica         BOOLEAN DEFAULT false,
    criacao         TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE blocos(
    bloco_id            VARCHAR(32) PRIMARY KEY NOT NULL,
    descricao           VARCHAR(500) NOT NULL,
    comunitario         BOOLEAN NOT NULL,
    criacao             TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE blocos_paginas(
    bloco_pagina_id     SERIAL PRIMARY KEY NOT NULL,
    bloco_id            VARCHAR(32) REFERENCES blocos(bloco_id) ON DELETE SET NULL,
    pagina_id           SERIAL REFERENCES paginas(pagina_id) ON DELETE CASCADE
);

CREATE TABLE edicoes(
    edicao_id       SERIAL PRIMARY KEY NOT NULL,
    pagina_id       SERIAL REFERENCES paginas(pagina_id) ON DELETE CASCADE,
    bicho_id        VARCHAR(16) REFERENCES bichos(bicho_id) ON DELETE SET NULL,
    texto           TEXT,
    criacao         TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

/* Valor (artefatos) */

CREATE TABLE artefatos(
    artefato_id             SERIAL PRIMARY KEY NOT NULL,
    varanda_contexto_id     SERIAL REFERENCES varandas(varanda_id) ON DELETE CASCADE,
    bicho_criador_id        VARCHAR(16) REFERENCES bichos(bicho_id) ON DELETE SET NULL,
    em_resposta_a_id        SERIAL REFERENCES artefatos(artefato_id) ON DELETE CASCADE,
    sensivel                BOOLEAN DEFAULT false,
    aviso_de_conteudo       VARCHAR(150),
    publico                 BOOLEAN DEFAULT false,
    indexavel               BOOLEAN DEFAULT false,
    data_criacao            TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE arquivos(
    nome_arquivo            VARCHAR(255) NOT NULL,
    descricao               VARCHAR(500)
) INHERITS (artefatos);

CREATE TABLE textos(
    titulo  VARCHAR(150),
    texto   TEXT
) INHERITS (artefatos);

CREATE TABLE tags(
    tag_id  TEXT PRIMARY KEY NOT NULL
)

CREATE TABLE tags_artefatos(
    tag_id          TEXT REFERENCES tags(tag_id) ON DELETE CASCADE,
    artefato_id     SERIAL REFERENCES artefatos(artefato_id) ON DELETE CASCADE
)