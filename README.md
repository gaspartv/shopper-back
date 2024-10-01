# Gerenciamento de Leitura de Consumo de Água e Gás

Este projeto é uma API RESTful construída em Node.js com TypeScript utilizando o framework NestJS. A aplicação realiza a leitura individualizada de consumo de água e gás a partir de imagens de medidores, integrando-se com a API Google Gemini para extração de valores das imagens.

## Tecnologias Utilizadas

- **Framework**: NestJS
- **ORM**: Prisma
- **Banco de Dados**: PostgreSQL
- **LLM**: Google Gemini
- **Testes**: Jest
- **Containerização**: Docker & Docker Compose

## Funcionalidades

- **Upload de Imagem**: Endpoint para enviar a imagem do medidor, consultar o valor via API da Google Gemini e armazenar as leituras.
- **Confirmação de Leitura**: Endpoint para confirmar ou corrigir manualmente o valor lido pela IA.
- **Listagem de Leituras**: Endpoint para listar todas as leituras realizadas por um cliente, com filtro opcional por tipo de medidor (água ou gás).
- **Validação de Dados**: Validação rigorosa dos dados recebidos e garantia de não duplicação de leituras no mesmo mês para o mesmo tipo de medidor.

## Estrutura do Projeto

A arquitetura segue o padrão do NestJS com o princípio de Clean Architecture, separando responsabilidades entre as camadas:

- **Controller**: Gerencia as requisições HTTP e as respostas.
- **Service/Entity**: Contém a lógica de negócio.
- **Repository**: Responsável pelo acesso aos dados (banco de dados via Prisma).
- **Modules**: Organizam o código por domínios.

## Endpoints

- **POST** /upload

  - Recebe uma imagem em base64 e retorna o valor lido.
  - Valida se já existe uma leitura no mês corrente.
  - Exemplo de requisição:

  ```bash
  {
  "image": "base64",
  "customer_code": "customer1",
  "measure_datetime": "2024-09-30T12:00:00Z",
  "measure_type": "WATER"
  }
  ```

- **PATCH** /confirm

  - Confirma ou corrige o valor lido previamente pela IA.
  - Exemplo de requisição:

  ```bash
  {
  "measure_uuid": "123e4567-e89b-12d3-a456-426614174000",
  "confirmed_value": 10
  }
  ```

- **GET** /<customer_code>/list
  - Lista todas as leituras de um cliente, com filtro opcional por tipo de medidor.
  - Exemplo de URL com query param: GET /customer1/list?measure_type=WATER

## Pré-requisitos

- Node.js versão 18 ou superior.
- Docker e Docker Compose instalados.
- Chave de API para o Google Gemini.

## Configuração do Ambiente

Antes de rodar a aplicação, é necessário configurar o arquivo .env com as variáveis de ambiente. Utilize o arquivo .env.example como modelo:

```bash
GEMINI_API_KEY="SUA-CHAVE-AQUI"
PORT=3333
DATABASE_URL="postgresql://docker:docker@shopper_postgres:5432/shopper-db?schema=public"
BASE_URL="http://localhost:3333"
```

### Estrutura do Arquivo .env

- **GEMINI_API_KEY**: Chave da API do Google Gemini.
- **PORT**: Porta onde a aplicação irá rodar.
- **DATABASE_URL**: URL de conexão com o banco de dados PostgreSQL.
- **BASE_URL**: URL base da aplicação.

## Executando o Projeto

A aplicação foi totalmente containerizada utilizando Docker. Siga os passos abaixo para rodar o projeto:

### Clonar o repositório:

```bash
git clone git@github.com:gaspartv/shopper-back.git
cd shopper-back
```

### Configurar o arquivo .env:

Certifique-se de configurar as variáveis de ambiente, conforme explicado anteriormente.

### Rodar a aplicação via Docker:

A aplicação será executada e todos os serviços (API e banco de dados) serão inicializados via Docker Compose:

```bash
docker-compose up --build
```

### Acessar a aplicação:

Após iniciar a aplicação, você poderá acessá-la em:

- API: http://localhost:3333
- Documentação Swagger: http://localhost:3333/docs

## Executando Testes

Os testes unitários foram implementados utilizando Jest. Para rodar os testes, execute o comando:

```bash
npm run test
```

## Importante

**Validação de ENV**: A aplicação valida automaticamente a existência e consistência das variáveis de ambiente. Certifique-se de que o arquivo .env está devidamente configurado para evitar problemas na execução.

## Docker Compose

O arquivo docker-compose.yml está configurado para subir os seguintes serviços:

- **API**: Aplicação Node.js rodando na porta 3333.
- **PostgreSQL**: Banco de dados configurado para rodar na porta 5432.

Exemplo de comando:

```bash
docker-compose up --build
```

Esse comando irá subir a aplicação, executar os testes e deixar tudo pronto para a avaliação.
