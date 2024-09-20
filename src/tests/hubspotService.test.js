import { expect } from 'chai';
import sinon from 'sinon';
import HubSpotService from '../services/hubspotService.js';
import apiClient from '../utils/api-client.js';

describe('HubSpotService', () => {
  let hubSpotService;
  let apiClientStub;

  beforeEach(() => {
    // Configurar o HubSpotService com uma chave de API fictícia
    hubSpotService = new HubSpotService('dummy_api_key');

    // Stub para a função de requisição HTTP (apiClient.post)
    apiClientStub = sinon.stub(apiClient, 'post');
  });

  afterEach(() => {
    // Restaurar os stubs e mocks após cada teste
    sinon.restore();
  });

  describe('isCorporateEmail', () => {
    it('deve retornar true para e-mails corporativos', () => {
      const result = hubSpotService.isCorporateEmail('joao@empresa.com');
      expect(result).to.be.true;
    });

    it('deve retornar false para e-mails não corporativos', () => {
      const result = hubSpotService.isCorporateEmail('joao@gmail.com');
      expect(result).to.be.false;
    });
  });

  describe('createContact', () => {
    it('deve criar contato corretamente com e-mail corporativo', () => {
      const contact = {
        companyName: 'Empresa A',
        fullName: 'João Silva',
        email: 'joao@empresa.com',
        phone: '123456789',
        website: 'www.empresaA.com',
      };

      const result = hubSpotService.createContact(contact);
      expect(result).to.deep.equal({
        properties: {
          company: 'Empresa A',
          firstname: 'João',
          lastname: 'Silva',
          email: 'joao@empresa.com',
          phone: '123456789',
          website: 'www.empresaA.com',
        },
      });
    });

    it('deve ignorar contatos com e-mail não corporativo', () => {
      const contact = {
        companyName: 'Empresa A',
        fullName: 'João Silva',
        email: 'joao@gmail.com',
        phone: '123456789',
        website: 'www.empresaA.com',
      };

      const result = hubSpotService.createContact(contact);
      expect(result).to.deep.equal({ error: 'Invalid corporate email' });
    });
  });

  describe('createContacts', () => {
    it('deve criar múltiplos contatos com sucesso', async () => {
      const contacts = [
        {
          companyName: 'Empresa A',
          fullName: 'João Silva',
          email: 'joao@empresa.com',
          phone: '123456789',
          website: 'www.empresaA.com',
        },
        {
          companyName: 'Empresa B',
          fullName: 'Maria Souza',
          email: 'maria@empresa.com',
          phone: '987654321',
          website: 'www.empresaB.com',
        },
      ];

      // Simular a resposta da API do HubSpot
      apiClientStub.resolves({ data: { results: ['contact1', 'contact2'] } });

      const result = await hubSpotService.createContacts(contacts);
      console.log(result);
      // Verificar se o método post foi chamado corretamente
      expect(apiClientStub.calledOnce).to.be.true;
      expect(
        apiClientStub.calledWith(
          `${hubSpotService.baseUrl}/batch/create`,
          {
            inputs: [
              {
                properties: {
                  company: 'Empresa A',
                  firstname: 'João',
                  lastname: 'Silva',
                  email: 'joao@empresa.com',
                  phone: '123456789',
                  website: 'www.empresaA.com',
                },
              },
              {
                properties: {
                  company: 'Empresa B',
                  firstname: 'Maria',
                  lastname: 'Souza',
                  email: 'maria@empresa.com',
                  phone: '987654321',
                  website: 'www.empresaB.com',
                },
              },
            ],
          },
          {
            headers: {
              Authorization: `Bearer dummy_api_key`,
              'Content-Type': 'application/json',
            },
          }
        )
      ).to.be.true;

      // Verificar se a resposta contém os resultados esperados
      expect(result).to.deep.equal({ results: ['contact1', 'contact2'] });
    });

    it('deve ignorar contatos com e-mails não corporativos', async () => {
      const contacts = [
        {
          companyName: 'Empresa A',
          fullName: 'João Silva',
          email: 'joao@gmail.com', // E-mail não corporativo
          phone: '123456789',
          website: 'www.empresaA.com',
        },
        {
          companyName: 'Empresa B',
          fullName: 'Maria Souza',
          email: 'maria@empresa.com',
          phone: '987654321',
          website: 'www.empresaB.com',
        },
      ];

      // Simular a resposta da API do HubSpot
      apiClientStub.resolves({ data: { results: ['contact1'] } });

      const result = await hubSpotService.createContacts(contacts);

      // Verificar se o método post foi chamado corretamente (somente para o contato corporativo)
      expect(
        apiClientStub.calledOnceWith(
          `${hubSpotService.baseUrl}/batch/create`,
          {
            inputs: [
              {
                properties: {
                  company: 'Empresa B',
                  firstname: 'Maria',
                  lastname: 'Souza',
                  email: 'maria@empresa.com',
                  phone: '987654321',
                  website: 'www.empresaB.com',
                },
              },
            ],
          },
          {
            headers: {
              Authorization: `Bearer dummy_api_key`,
              'Content-Type': 'application/json',
            },
          }
        )
      ).to.be.true;

      // Verificar se a resposta contém o resultado esperado
      expect(result).to.deep.equal({ results: ['contact1'] });
    });
  });
});
