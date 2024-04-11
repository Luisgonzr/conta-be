import { Injectable } from '@nestjs/common';
import { ErrorMessages } from 'src/common/messages/error.catalog';

@Injectable()
export class FacturapiErrorHandlerService {
  getErrorMessage(error: string): {
    internalCode: number;
    message: { en: string; es: string };
  } {
    switch (error) {
      case 'Validación de timbrado: El campo DomicilioFiscalReceptor del receptor, debe pertenecer al nombre asociado al RFC registrado en el campo Rfc del Receptor.':
        return ErrorMessages.facturapiErrorTaxAddressMismatch;
      default:
        return ErrorMessages.facturapiDefaultError;
    }
  }
}
