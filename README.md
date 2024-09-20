Aqui está um exemplo de arquivo `README.md` para descrever como executar seu projeto tanto localmente quanto em um ambiente Serverless. Este guia cobre como configurar e executar o projeto nos dois cenários.

## **README.md**

# HubSpot & Google Sheets Integration

Este projeto integra o Google Sheets com o HubSpot CRM, permitindo a criação de contatos no HubSpot a partir dos dados armazenados no Google Sheets. A integração é construída usando Node.js e pode ser executada tanto localmente quanto em um ambiente Serverless (AWS Lambda).

---

## **Pré-requisitos**

- Node.js (v20 ou superior)
- NPM ou Yarn
- Conta na AWS para deploy do Serverless (opcional)
- Conta no Google Cloud para Google Sheets API
- HubSpot API Key

---

## **Instalação**

1. Clone o repositório:
   ```bash
   git clone https://github.com/tricksil/challenges-integrations.git
   cd challenges-integrations
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

---

## **Configuração**

### 1. Configurar Google Sheets API

- Crie um projeto no [Google Cloud Console](https://console.cloud.google.com/).
- Habilite a **Google Sheets API**.
- Crie uma **Conta de Serviço** e baixe o arquivo de credenciais `credentials.json`.
- Compartilhe a planilha do Google Sheets com a conta de serviço.
- Coloque o arquivo `credentials.json` na pasta `credentials/`.

### 2. Configurar HubSpot API Key

- Crie uma API Key no [HubSpot](https://app.hubspot.com/).
- Adicione a chave de API ao arquivo `.env`:

```bash
HUBSPOT_API_KEY=your-hubspot-api-key
HUBSPOT_BASE_URL=https://api.hubapi.com/crm/v3/objects/contacts
```

### 3. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```bash
GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL=your-service-account@project-id.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_SPREADSHEET_ID=your-google-sheets-id
HUBSPOT_API_KEY=your-hubspot-api-key
HUBSPOT_BASE_URL=https://api.hubapi.com/crm/v3/objects/contacts
```

---

## **Executando Localmente**

### 1. Rodando o Projeto Localmente

Execute o projeto localmente para testar a integração:

```bash
npm start
```

Este comando executa a função principal e cria contatos no HubSpot a partir dos dados no Google Sheets.

### 2. Rodando Testes

Para rodar os testes unitários, use:

```bash
npm test
```

---

## **Executando com Serverless (AWS Lambda)**

### 1. Instale o Serverless Framework

Se ainda não tiver instalado o Serverless Framework, faça isso com o seguinte comando:

```bash
npm install -g serverless
```

### 2. Configurar Credenciais da AWS

Configure suas credenciais da AWS usando o AWS CLI:

```bash
aws configure
```

### 3. Deploy do Projeto

Faça o deploy do projeto para a AWS Lambda usando o Serverless Framework:

```bash
serverless deploy
```

### 4. Executar a Função Serverless Localmente

Você pode executar a função do Serverless localmente para testar:

```bash
serverless invoke local --function createContacts
```

### 5. Remover o Deploy

Para remover o serviço da AWS Lambda, use o seguinte comando:

```bash
serverless remove
```

---

## **Estrutura do Projeto**

```bash
.
├── src
│   ├── services
│   │   ├── googleSheetsService.js
│   │   └── hubspotService.js
│   ├── utils
│   │   └── api-client.js
│   └── app.js
├── credentials
│   └── credentials.json  # Credenciais do Google Cloud
├── tests
│   └── hubspotService.test.js
├── .env
├── serverless.yml
├── package.json
└── README.md
```

---

## **Tecnologias Usadas**

- **Node.js**: Ambiente de execução JavaScript.
- **Google Sheets API**: Para leitura de dados da planilha.
- **HubSpot CRM API**: Para criação de contatos.
- **Serverless Framework**: Para deploy no AWS Lambda.

---

## **Licença**

Este projeto é licenciado sob a [MIT License](LICENSE).

---

Isso deve cobrir as instruções de configuração e execução, tanto localmente quanto em um ambiente Serverless.