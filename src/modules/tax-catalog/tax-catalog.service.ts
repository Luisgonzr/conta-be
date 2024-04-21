import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ErrorMessages } from 'src/common/messages/error.catalog';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetParamsService } from 'src/shared/get-params-service/get-params.service';
import { MexicoInvoicingRulesService } from 'src/shared/mexico-invoicing-rules/mexico-invoicing-rules.service';

@Injectable()
export class TaxCatalogService {
  constructor(
    private prismaService: PrismaService,
    private getParamsService: GetParamsService,
    private mexicoInvoicingRulesService: MexicoInvoicingRulesService,
  ) {}
  createTaxes(body: any, currentCompany: string) {
    if (!this.mexicoInvoicingRulesService.isValidTaxType(body.taxType)) {
      throw new ConflictException('Error while processing request');
    }
    if (!this.mexicoInvoicingRulesService.isValidTaxFactor(body.taxFactor)) {
      throw new ConflictException('Error while processing request');
    }
    return this.prismaService.taxCatalog.create({
      data: {
        name: body.name,
        description: body.description,
        taxType: body.taxType,
        taxFactor: body.taxFactor,
        taxRate: body.taxRate,
        taxAWithheldByCustomer: body.taxAWithheldByCustomer || false,
        companyId: currentCompany,
      },
    });
  }

  async getTaxes(query: any, currentCompany: string) {
    const searchData = query.search
      ? {
          OR: [
            {
              name: {
                contains: query.search,
              },
            },
            {
              description: {
                contains: query.search,
              },
            },
            {
              taxType: {
                contains: query.search,
              },
            },
            {
              taxFactor: {
                contains: query.search,
              },
            },
          ],
        }
      : {};
    const totalRecords = await this.prismaService.taxCatalog.count({
      where: {
        ...searchData,
        AND: {
          isActive: true,
          companyId: currentCompany,
        },
      },
    });
    const { pages, skip, take, currentPage, order } =
      this.getParamsService.getStandardParams(query, totalRecords);
    if (totalRecords == 0) {
      return {
        total_rows: totalRecords,
        data: [],
        per_page: take,
        pages: pages,
        current_page: currentPage,
      };
    }
    const taxes = await this.prismaService.taxCatalog.findMany({
      where: {
        ...searchData,
        AND: {
          isActive: true,
          companyId: currentCompany,
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        taxType: true,
        taxFactor: true,
        taxRate: true,
        taxAWithheldByCustomer: true,
        createdAt: true,
        updatedAt: true,
      },
      skip,
      take,
      orderBy: {
        [order.orderBy]: order.orderType,
      },
    });
    if (!taxes) throw new ConflictException('Error while processing request');
    if (taxes.length == 0)
      throw new HttpException(
        ErrorMessages.TaxCatalog.NotFound,
        ErrorMessages.TaxCatalog.NotFound.httpCode,
      );
    return {
      total_rows: totalRecords,
      data: taxes,
      per_page: take,
      pages: pages,
      current_page: currentPage,
    };
  }

  async deleteTaxes(id: string, currentCompany: string) {
    return await this.prismaService.taxCatalog
      .delete({
        where: {
          id: id,
          companyId: currentCompany,
        },
      })
      .catch((error) => {
        if (error.code === 'P2025') {
          throw new NotFoundException('Tax not found');
        }
        throw new ConflictException('Error while processing request');
      });
  }
}
