import dotenv from 'dotenv';
import { google } from 'googleapis';
import GoogleSheetsService from './services/googleSheetsService.js';
import HubSpotService from './services/hubspotService.js';
dotenv.config();

const auth = new google.auth.JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL,
  key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

async function main() {
  try {
    const googleSheetsService = new GoogleSheetsService(auth);
    const hubSpotService = new HubSpotService(process.env.HUBSPOT_API_KEY);

    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    const range = process.env.GOOGLE_SHEETS_RANGE;

    // Obter dados da planilha
    const contacts = await googleSheetsService.getContactsFromSheet(spreadsheetId, range);
    console.log('contacts', contacts)
    // Criar contatos no HubSpot
    const results = await hubSpotService.createContacts(contacts);
    console.log('Contatos inseridos no HubSpot:', results.inputs);
  } catch (error) {
    console.error('Erro ao executar localmente:', error);
  }
}

main();