import { Injectable } from '@nestjs/common';

@Injectable()
export class MexicoInvoicingRulesService {
  constructor() {}

  isValidTaxType(taxType: string) {
    return taxType === 'IVA' || taxType === 'ISR' || taxType === 'IEPS';
  }

  isValidTaxFactor(taxFactor: string) {
    return (
      taxFactor === 'Tasa' || taxFactor === 'Cuota' || taxFactor === 'Exento'
    );
  }
}
