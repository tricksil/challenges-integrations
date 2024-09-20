import { google } from 'googleapis';

class GoogleSheetsService {
  constructor(auth) {
    this.auth = auth;
    this.sheets = google.sheets({ version: 'v4', auth });
  }

  async getContactsFromSheet(spreadsheetId, range) {
    const response = await this.sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    if (!rows.length) {
      throw new Error('Nenhum dado encontrado.');
    }

    return rows.map(row => ({
      companyName: row[0],
      fullName: row[1],
      email: row[2],
      phone: row[3],
      website: row[4],
    }));
  }
}

export default GoogleSheetsService;