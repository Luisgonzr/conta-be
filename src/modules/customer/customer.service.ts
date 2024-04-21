import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetParamsService } from 'src/shared/get-params-service/get-params.service';

@Injectable()
export class CustomerService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly getParamsService: GetParamsService,
  ) {}

  async getCustomer(id: string, currentCompany: string) {
    const customer = await this.prismaService.customer.findFirst({
      where: {
        id,
        companyId: currentCompany,
        isActive: true,
      },
      include: {
        taxProfile: true,
      },
    });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    } else {
      return customer;
    }
  }

  async createCustomer(body: any, currentCompany: string) {
    const customerToBeCreated = { ...body };
    delete customerToBeCreated.taxProfile;
    const taxProfile = body.taxProfile;
    // All tax profile fields filled or none
    let taxProfileToBeCreated = taxProfile;
    if (
      taxProfile.taxId == null ||
      taxProfile.taxName == null ||
      taxProfile.taxZipCode == null ||
      taxProfile.taxSystem == null
    ) {
      taxProfileToBeCreated = {};
    }
    const customer = await this.prismaService.customer.create({
      data: {
        ...customerToBeCreated,
        company: {
          connect: {
            id: currentCompany,
          },
        },
        taxProfile: {
          create: { ...taxProfileToBeCreated },
        },
      },
    });
    return customer;
  }

  async getCustomers(query: any, currentCompany: string) {
    const searchData = query.search
      ? {
          OR: [
            {
              email: {
                contains: query.search,
              },
            },
            {
              name: {
                contains: query.search,
              },
            },
            {
              taxProfile: {
                taxId: {
                  contains: query.search,
                },
              },
            },
            {
              taxProfile: {
                taxName: {
                  contains: query.search,
                },
              },
            },
          ],
        }
      : {};
    const totalRecords = await this.prismaService.customer.count({
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
    const customers = await this.prismaService.customer.findMany({
      where: {
        ...searchData,
        AND: {
          isActive: true,
          companyId: currentCompany,
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        companyName: true,
        createdAt: true,
        updatedAt: true,
        taxProfile: {
          select: {
            taxId: true,
            taxName: true,
            taxZipCode: true,
            taxSystem: true,
          },
        },
      },
      skip,
      take,
      orderBy: {
        [order.orderBy]: order.orderType,
      },
    });
    if (!customers)
      throw new ConflictException('Error while processing request');
    if (customers.length == 0)
      throw new NotFoundException('No customers found');
    const returnData = {
      total_rows: totalRecords,
      data: customers,
      per_page: take,
      pages: pages,
      current_page: currentPage,
    };
    return returnData;
  }

  async updateCustomer(id: string, body: any, currentCompany: string) {
    const customer = await this.getCustomer(id, currentCompany);
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    const customerToBeUpdated = { ...body };
    delete customerToBeUpdated.taxProfile;
    const taxProfile = body.taxProfile;
    let proceedToUpdateTaxProfile = true;
    if (
      taxProfile.taxId == null ||
      taxProfile.taxName == null ||
      taxProfile.taxZipCode == null ||
      taxProfile.taxSystem == null
    ) {
      proceedToUpdateTaxProfile = false;
    }
    let updateTaxProfile = null;
    if (proceedToUpdateTaxProfile) {
      updateTaxProfile = this.prismaService.customerTaxProfile.update({
        where: {
          id: customer.taxProfile.id,
        },
        data: {
          ...taxProfile,
        },
      });
    }
    const updateCustomer = this.prismaService.customer.update({
      where: {
        id: customer.id,
      },
      data: {
        ...customerToBeUpdated,
      },
    });
    if (updateTaxProfile == null) {
      return await this.prismaService.$transaction([updateCustomer]);
    } else {
      return await this.prismaService.$transaction([
        updateTaxProfile,
        updateCustomer,
      ]);
    }
  }

  async deleteCustomerHard(id: string, currentCompany: string) {
    const customer = await this.getCustomer(id, currentCompany);
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    const deleteTaxProfile = this.prismaService.customerTaxProfile.delete({
      where: {
        id: customer.taxProfile.id,
      },
    });
    const deleteCustomer = this.prismaService.customer.delete({
      where: {
        id,
      },
    });
    return await this.prismaService.$transaction([
      deleteTaxProfile,
      deleteCustomer,
    ]);
  }

  async getCustomersWithCursor(query: any, currentCompany: string) {
    const searchData = query.search
      ? {
          OR: [
            {
              email: {
                contains: query.search,
              },
            },
            {
              name: {
                contains: query.search,
              },
            },
            {
              taxProfile: {
                taxId: {
                  contains: query.search,
                },
              },
            },
            {
              taxProfile: {
                taxName: {
                  contains: query.search,
                },
              },
            },
          ],
        }
      : {};
    const { cursor, skip, take, order } =
      this.getParamsService.getStandardParamsCursor(query);
    let customers = null;
    if (cursor) {
      customers = await this.prismaService.customer.findMany({
        where: {
          ...searchData,
          AND: {
            isActive: true,
            companyId: currentCompany,
          },
        },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          companyName: true,
          createdAt: true,
          updatedAt: true,
          taxProfile: {
            select: {
              taxId: true,
              taxName: true,
              taxZipCode: true,
              taxSystem: true,
            },
          },
        },
        cursor,
        skip,
        take,
        orderBy: {
          [order.orderBy]: order.orderType,
        },
      });
    } else {
      customers = await this.prismaService.customer.findMany({
        where: {
          ...searchData,
          AND: {
            isActive: true,
            companyId: currentCompany,
          },
        },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          companyName: true,
          createdAt: true,
          updatedAt: true,
          taxProfile: {
            select: {
              taxId: true,
              taxName: true,
              taxZipCode: true,
              taxSystem: true,
            },
          },
        },
        skip,
        take,
        orderBy: {
          [order.orderBy]: order.orderType,
        },
      });
    }
    if (!customers)
      throw new ConflictException('Error while processing request');
    if (customers.length == 0)
      throw new NotFoundException('No customers found');
    return {
      data: customers,
      per_page: take,
      new_cursor: customers[customers.length - 1].id,
    };
  }
}
