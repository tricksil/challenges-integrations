import apiClient from "../utils/api-client.js";

class HubSpotService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = process.env.HUBSPOT_BASE_URL || `https://api.hubapi.com/crm/v3/objects/contacts`;
    this.invalidDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
  }

  isCorporateEmail(email) {
    if (!email || !email.includes('@')) {
      return false;
    }
    const domain = email.split('@')[1];
    return !this.invalidDomains.includes(domain.toLowerCase());
  }

  createContact(contact) {
    if (!this.isCorporateEmail(contact.email)) {
      console.log(`Contato ${contact.fullName} com e-mail ${contact.email} não é corporativo. Ignorando.`);
      return { error: 'Invalid corporate email' };
    }

    const data = {
      properties: {
        company: contact.companyName,
        firstname: contact.fullName.split(' ')[0],
        lastname: contact.fullName.split(' ').slice(1).join(' '),
        email: contact.email,
        phone: contact.phone,
        website: contact.website,
      },
    };


    return data;
  }

  async createContacts(contacts) {
    let results = [];
    for (const contact of contacts) {
      const result = this.createContact(contact);
      if (!result.error) {
        results.push(result);
      }
    }
    const batchForCreateData = {
      inputs: results,
    };
    console.log(batchForCreateData)
    const response = await apiClient.post(`${this.baseUrl}/batch/create`, batchForCreateData, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  }
}

export default HubSpotService;