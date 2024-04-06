import { Injectable } from '@nestjs/common';

export interface CfdiTax {
  Base: string;
  Importe: string;
  Impuesto: string;
  TasaOCuota: string;
  TipoFactor: string;
}

@Injectable()
export class TaxesCalculatorService {
  getTaxesSummary(salesQuoteItem: any[]) {
    let subtotal = 0;
    let traslatedTaxes = 0;
    let witholdingTaxes = 0;
    let total = 0;
    let discount = 0;
    for (let i = 0; i < salesQuoteItem.length; i++) {
      const item = salesQuoteItem[i];
      const itemSubtotal = item.quantity * item.price - item.discount;
      const itemTaxes = this.getTaxes(
        itemSubtotal,
        item.quantity,
        item.productAndService.taxCatalogs,
      );
      subtotal += itemSubtotal;
      discount += item.discount;
      traslatedTaxes += itemTaxes.traslatedTaxes;
      witholdingTaxes += itemTaxes.witholdingTaxes;
    }
    total = subtotal + traslatedTaxes - witholdingTaxes;
    return {
      subtotal,
      traslatedTaxes,
      witholdingTaxes,
      total,
      discount,
    };
  }

  getTaxes(subtotal: number, quantity: number, taxCatalogs: any[]) {
    let traslatedTaxes = 0;
    let witholdingTaxes = 0;
    const taxesDetail = [];
    taxCatalogs.map((tax) => {
      //Check if translated or not
      if (tax.taxAWithheldByCustomer) {
        witholdingTaxes += this.getWitholdingTaxes(subtotal, quantity, tax);
      } else {
        traslatedTaxes += this.getTranslatedTaxes(subtotal, quantity, tax);
      }
    });
    return {
      traslatedTaxes,
      witholdingTaxes,
      taxesDetail,
    };
  }

  getTranslatedTaxes(subtotal: number, quantity: number, tax: any) {
    if (tax.taxFactor === 'Tasa') {
      return subtotal * tax.taxRate;
    } else if (tax.taxFactor === 'Cuota') {
      return tax.taxRate * quantity;
    } else if (tax.taxFactor === 'Exento') {
      return 0;
    }
  }

  getWitholdingTaxes(subtotal: number, quantity: number, tax: any) {
    if (tax.taxFactor === 'Tasa') {
      return subtotal * tax.taxRate;
    } else if (tax.taxFactor === 'Cuota') {
      return tax.taxRate * quantity;
    } else if (tax.taxFactor === 'Exento') {
      return 0;
    }
  }

  getTaxesDetailFromXmlJson(xmlJson: any) {
    const taxesDetail = xmlJson['cfdi:Comprobante']['cfdi:Impuestos']
      ? xmlJson['cfdi:Comprobante']['cfdi:Impuestos']
      : null;
    if (taxesDetail === null) return null;
    const headerData = taxesDetail['object'];
    const traslatedTaxes = taxesDetail['cfdi:Traslados']
      ? taxesDetail['cfdi:Traslados']['cfdi:Traslado']
      : null;
    const witholdingTaxes = taxesDetail['cfdi:Retenciones']
      ? taxesDetail['cfdi:Retenciones']['cfdi:Retencion']
      : null;

    return {
      headerData,
      taxes: this.iterateTaxes(traslatedTaxes),
      witholdingTaxes: this.iterateTaxes(witholdingTaxes, true),
    };
  }

  iterateTaxes(taxes: any, isWitholding = false) {
    const taxesArray = [];
    if (taxes) {
      if (Array.isArray(taxes)) {
        taxes.map((tax) => {
          taxesArray.push(this.parserForFacturapi(tax.object, isWitholding));
        });
      } else {
        taxesArray.push(this.parserForFacturapi(taxes.object, isWitholding));
      }
    }
    return taxesArray;
  }

  parserForFacturapi(tax: CfdiTax, isWitholding = false) {
    return {
      base: parseFloat(tax.Base),
      type: this.getTaxType(tax.Impuesto),
      rate: parseFloat(tax.TasaOCuota),
      factor: tax.TipoFactor,
      withholding: isWitholding,
    };
  }

  getTaxType(taxCode: string) {
    switch (taxCode) {
      case '001':
        return 'ISR';
      case '002':
        return 'IVA';
      case '003':
        return 'IEPS';
      default:
        return 'IVA';
    }
  }
}
