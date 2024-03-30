CREATE DATABASE varanda

/* ---------------- */
/* Agência (bichos) */

CREATE TABLE bichos(
    bicho_id            VARCHAR(32) PRIMARY KEY NOT NULL,
    nome                VARCHAR(64) NOT NULL,
    descricao           VARCHAR(500),
    avatar              VARCHAR(255) DEFAULT 'avatar.jpg',
    descricao_avatar    VARCHAR(500) DEFAULT 'imagem de perfil',
    fundo               VARCHAR(255) DEFAULT 'fundo.jpg',
    descricao_fundo     VARCHAR(500) DEFAULT 'imagem de fundo',
    criacao             TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pessoas(
    bicho_id        VARCHAR(32) PRIMARY KEY REFERENCES bichos(bicho_id) ON DELETE CASCADE,
    email           VARCHAR,
    hash            VARCHAR NOT NULL,
    salt            VARCHAR NOT NULL
);

CREATE TABLE preferencias(
    bicho_id        VARCHAR(32) PRIMARY KEY REFERENCES bichos(bicho_id) ON DELETE CASCADE,
    tema            INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE comunidades(
    bicho_id                    VARCHAR(32) PRIMARY KEY REFERENCES bichos(bicho_id) ON DELETE CASCADE,
    bicho_criador_id            VARCHAR(32) REFERENCES bichos(bicho_id) ON DELETE SET NULL,
    participacao_livre          BOOLEAN DEFAULT true,
    participacao_com_convite    BOOLEAN DEFAULT true,
);

CREATE TABLE convites(
    convite_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bicho_criador_id    VARCHAR(32) REFERENCES bichos(bicho_id) ON DELETE CASCADE,
    comunidade_id       VARCHAR(32) REFERENCES bichos(bicho_id) ON DELETE CASCADE,
    criacao             TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE recuperacoes(
    recuperacao_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bicho_id            VARCHAR(32) UNIQUE REFERENCES bichos(bicho_id) ON DELETE CASCADE,
    criacao             TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE relacoes(
    bicho_id        VARCHAR(32) REFERENCES bichos(bicho_id) ON DELETE CASCADE,
    comunidade_id   VARCHAR(32) REFERENCES bichos(bicho_id) ON DELETE CASCADE,
    participar      BOOLEAN DEFAULT true,
    editar          BOOLEAN DEFAULT false,
    moderar         BOOLEAN DEFAULT false,
    representar     BOOLEAN DEFAULT false,
    PRIMARY KEY(bicho_id, comunidade_id)
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

/* ---------------------------- */
/* Contexto (páginas) */

CREATE TABLE paginas(
    pagina_vid      TEXT PRIMARY KEY NOT NULL,
    varanda_id      VARCHAR(32) REFERENCES bichos(bicho_id) ON DELETE CASCADE,
    titulo          VARCHAR(32),
    html            TEXT,
    publica         BOOLEAN DEFAULT true,
    criacao         TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE blocos(
    bloco_id            VARCHAR(32) PRIMARY KEY NOT NULL,
    descricao           VARCHAR(500) NOT NULL,
    comunitario         BOOLEAN NOT NULL,
    variaveis           TEXT ARRAY,
    criacao             TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE edicoes(
    edicao_id       SERIAL PRIMARY KEY NOT NULL,
    pagina_id       INTEGER REFERENCES paginas(pagina_id) ON DELETE CASCADE,
    bicho_editor_id VARCHAR(32) REFERENCES bichos(bicho_id) ON DELETE SET NULL,
    titulo          VARCHAR(32),
    publica         BOOLEAN NOT NULL,
    html            TEXT,
    criacao         TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

/* ----------------- */
/* Valor (artefatos) */

CREATE TABLE artefatos(
    artefato_id             SERIAL PRIMARY KEY NOT NULL,
    varanda_id              VARCHAR(32) REFERENCES bichos(bicho_id) ON DELETE CASCADE,
    pagina_vid              TEXT REFERENCES paginas(pagina_vid) ON DELETE SET NULL,
    bicho_criador_id        VARCHAR(32) REFERENCES bichos(bicho_id) ON DELETE SET NULL,
    em_resposta_a_id        INTEGER REFERENCES artefatos(artefato_id) ON DELETE SET NULL,
    nome_arquivo            VARCHAR(255),
    extensao                VARCHAR(16),
    descricao               TEXT,
    titulo                  VARCHAR(500),
    texto                   TEXT,
    sensivel                BOOLEAN DEFAULT false,
    respondivel             BOOLEAN DEFAULT true,
    indexavel               BOOLEAN DEFAULT true,
    mutirao                 BOOLEAN DEFAULT false,
    denuncia                BOOLEAN DEFAULT false,
    criacao                 TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE edicoes_artefatos(
    edicao_artefato_id      SERIAL PRIMARY KEY NOT NULL,
    artefato_id             INTEGER REFERENCES artefatos(artefato_id) ON DELETE CASCADE,
    pagina_vid              TEXT REFERENCES paginas(pagina_vid) ON DELETE SET NULL,
    bicho_editor_id         VARCHAR(32) REFERENCES bichos(bicho_id) ON DELETE SET NULL,
    descricao               TEXT,
    titulo                  VARCHAR(500),
    texto                   TEXT,
    sensivel                BOOLEAN,
    respondivel             BOOLEAN,
    indexavel               BOOLEAN,
    mutirao                 BOOLEAN,
    denuncia                BOOLEAN,
    criacao                 TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tags(
    tag_id  TEXT PRIMARY KEY NOT NULL
)

CREATE TABLE tags_em_uso(
    tag_id          TEXT REFERENCES tags(tag_id) ON DELETE CASCADE,
    artefato_id     INTEGER REFERENCES artefatos(artefato_id) ON DELETE CASCADE,
    bicho_id        VARCHAR(32) REFERENCES bichos(bicho_id) ON DELETE SET NULL
)