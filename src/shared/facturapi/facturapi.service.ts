import { Injectable } from '@nestjs/common';
import Facturapi from 'facturapi';

@Injectable()
export class FacturapiService {
  private projectFacturapi: Facturapi;
  private facturapi: Facturapi;

  constructor() {
    this.projectFacturapi = new Facturapi(process.env.FACTURAPI_API_KEY);
  }

  async createOrganization(organizationName: string) {
    try {
      return await this.projectFacturapi.organizations.create({
        name: organizationName,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
