import 'dotenv/config';
import { google } from 'googleapis';
import GoogleSheetsService from '../src/services/googleSheetsService.js';
import HubSpotService from '../src/services/hubspotService.js';

const auth = new google.auth.JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL,
  key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

export const createContacts = async (event) => {
  try {
    const sheetsService = new GoogleSheetsService(auth);
    const hubspotService = new HubSpotService(process.env.HUBSPOT_API_KEY);

    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    const range = process.env.GOOGLE_SHEETS_RANGE;

    const contacts = await sheetsService.getContactsFromSheet(spreadsheetId, range);

    const results = await hubspotService.createContacts(contacts);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Contatos inseridos no HubSpot com sucesso!',
        results,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
