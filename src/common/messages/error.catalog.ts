export const ErrorMessages = {
  TaxCatalog: {
    NotFound: {
      internalCode: 1,
      httpCode: 404,
      message: {
        en: 'message here',
        es: 'mensaje aquí',
      },
    },
  },
  facturapiErrorTaxAddressMismatch: {
    internalCode: 89,
    message: {
      en: 'The tax address of the recipient must match the tax address registered with the SAT.',
      es: 'El domicilio fiscal del receptor debe coincidir con el domicilio fiscal registrado ante el SAT.',
    },
  },
  facturapiDefaultError: {
    internalCode: 88,
    message: {
      en: 'An error occurred while processing the request, please try again later',
      es: 'Ocurrió un error al procesar la solicitud, por favor intente más tarde',
    },
  },
};
