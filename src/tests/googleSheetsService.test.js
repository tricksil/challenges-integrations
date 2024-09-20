import { expect } from 'chai';
import { google } from 'googleapis';
import sinon from 'sinon';
import GoogleSheetsService from '../services/googleSheetsService.js';

describe('GoogleSheetsService - Autenticação JWT', () => {
  let googleSheetsService;
  let authStub;
  let sheetsInstance;
  let sheetsGetStub;

  beforeEach(() => {
    // Stub para o JWT, incluindo os métodos authorize e getClient
    authStub = sinon.stub(google.auth, 'JWT').callsFake(() => {
      return {
        authorize: sinon
          .stub()
          .yields(null, { access_token: 'fake-access-token' }),
        getRequestHeaders: sinon
          .stub()
          .resolves({ Authorization: 'Bearer fake-access-token' }),
        request: sinon.stub().resolves(),
      };
    });

    // Mock da API do Google Sheets
    sheetsInstance = {
      spreadsheets: {
        values: {
          get: sinon.stub(), // Stub da função `get`
        },
      },
    };

    // Substituir `google.sheets` para retornar nossa instância mockada
    sinon.stub(google, 'sheets').returns(sheetsInstance);

    // Criar o serviço com o mock de autenticação
    const auth = new google.auth.JWT({
      email: 'fake-email@project-id.iam.gserviceaccount.com',
      key: '-----BEGIN PRIVATE KEY-----\nFAKE_PRIVATE_KEY\n-----END PRIVATE KEY-----\n',
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
    googleSheetsService = new GoogleSheetsService(auth);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('deve buscar contatos da planilha com sucesso', async () => {
    // Simular a resposta da API do Google Sheets, incluindo a propriedade "data"
    sheetsInstance.spreadsheets.values.get.resolves({
      data: {
        values: [
          [
            'Empresa A',
            'João Silva',
            'joao@empresa.com',
            '123456789',
            'www.empresaA.com',
          ],
          [
            'Empresa B',
            'Maria Souza',
            'maria@empresa.com',
            '987654321',
            'www.empresaB.com',
          ],
        ],
      },
    });

    const spreadsheetId = '1B-xhdbFkvZqi7B1tbRUuZlkNGnM4gevy8Zcdz7NbtEo';
    const range = 'Sheet1!A1:E10';

    // Chamar o método que acessa o Google Sheets
    const contacts = await googleSheetsService.getContactsFromSheet(
      spreadsheetId,
      range
    );

    // Verificar se a resposta contém os dados esperados
    expect(contacts).to.be.an('array');
    expect(contacts).to.have.length(2);
    expect(contacts[0]).to.deep.equal({
      companyName: 'Empresa A',
      fullName: 'João Silva',
      email: 'joao@empresa.com',
      phone: '123456789',
      website: 'www.empresaA.com',
    });

    // Verificar se o método de autenticação JWT foi chamado
    expect(authStub.calledOnce).to.be.true;

    // Verificar se o método get da API do Google Sheets foi chamado corretamente
    expect(
      sheetsInstance.spreadsheets.values.get.calledOnceWith({
        spreadsheetId: spreadsheetId,
        range: range,
      })
    ).to.be.true;
  });

  it('deve retornar um erro se a planilha estiver vazia', async () => {
    // Simular uma resposta vazia da API do Google Sheets, mas ainda incluindo "data"
    sheetsInstance.spreadsheets.values.get.resolves({ data: { values: [] } });

    const spreadsheetId = '1B-xhdbFkvZqi7B1tbRUuZlkNGnM4gevy8Zcdz7NbtEo';
    const range = 'Sheet1!A1:E10';

    try {
      await googleSheetsService.getContactsFromSheet(spreadsheetId, range);
    } catch (error) {
      expect(error.message).to.equal('Nenhum dado encontrado.');
    }
  });
});
