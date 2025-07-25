const swaggerJsdoc = require('swagger-jsdoc')
const host = process.env.HOST;
const port = process.env.PORT;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Customer Data API - Higo Technical Test',
      version: '1.0.0',
      description: 'API untuk menganalisa data customer dari upload CSV termasuk distribusi gender dan data tabel dengan pagination',
    },
    servers: [
      {
        url: `${host}:${port}/api`,
        description: 'Main server',
      },
    ],
    paths: {
      '/customers/upload': {
        post: {
          summary: 'Upload CSV customer to DB',
          description: 'Uploads CSV file containing customer data to be stored into DB',
          tags: ['Customers'],
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: {
                    csvFile: {
                      type: 'string',
                      format: 'binary',
                      description: 'CSV file to upload',
                    },
                  },
                  required: ['csvFile'],
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'CSV processing finished and data uploaded successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/UploadSuccessResponse',
                  },
                },
              },
            },
            '400': {
              description: 'No file uploaded or invalid request',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ErrorMessageResponse',
                  },
                },
              },
            },
            '500': {
              description: 'Internal server error during file processing or database saving',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ErrorMessageResponse',
                  },
                },
              },
            },
          },
        },
      },
      '/customers/gender-distribution': {
        get: {
          summary: 'Get customer gender distribution',
          description: 'Retrieves count of male and female customers',
          tags: ['Customers'],
          responses: {
            '200': {
              description: 'Data successfully fetched.',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/GenderDistributionResponse',
                  },
                },
              },
            },
            '500': {
              description: 'Internal server error.',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ErrorMessageResponseWithEmptyArray',
                  },
                },
              },
            },
          },
        },
      },
      '/customers': {
        get: {
          summary: 'Get all customers with optional pagination',
          description: 'Retrieves list of customer records. Can be paginated or return all data',
          tags: ['Customers'],
          parameters: [
            {
              in: 'query',
              name: 'paginate',
              schema: {
                type: 'boolean',
                default: true,
              },
              description: "Set to 'true' to enable pagination, 'false' to get all data",
            },
            {
              in: 'query',
              name: 'page',
              schema: {
                type: 'integer',
                minimum: 1,
                default: 1,
              },
              description: 'Page number to retrieve when pagination is enabled',
            },
            {
              in: 'query',
              name: 'limit',
              schema: {
                type: 'integer',
                minimum: 1,
                default: 100,
              },
              description: 'page number of items per page when pagination is enabled',
            },
            {
              in: 'query',
              name: 'name',
              schema: {
                type: 'string',
              },
              description: 'Search for customer name with case insensitive.',
            },
            {
              in: 'query',
              name: 'gender',
              schema: {
                type: 'string',
                enum: ['All', 'Male', 'Female'],
                default: 'All',
              },
              description: 'Filter customers by gender. Use "All" to show all genders',
            },
          ],
          responses: {
            '200': {
              description: 'Data successfully fetched.',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/CustomerListResponse',
                  },
                },
              },
            },
            '500': {
              description: 'Internal server error.',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/CustomerListErrorResponse',
                  },
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        Customer: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '60c72b1f9b1d8e001c8c4c7a' },
            number: { type: 'number', example: 1 },
            nameOfLocation: { type: 'string', example: 'The Rustic Tavern' },
            date: { type: 'string', format: 'date-time', example: '2023-12-07T00:00:00.000Z' },
            loginHour: { type: 'string', example: '16:07' },
            name: { type: 'string', example: 'Francesca Spendlove' },
            age: { type: 'number', example: 1978 },
            gender: { type: 'string', example: 'Female' },
            email: { type: 'string', example: 'fspendlove0@eventbrite.com' },
            phoneNumber: { type: 'string', example: '829-817-4593' },
            brandDevice: { type: 'string', example: 'Samsung' },
            digitalInterest: { type: 'string', example: 'Social Media' },
            locationType: { type: 'string', example: 'urban' },
            createdAt: { type: 'string', format: 'date-time', example: '2023-12-07T16:07:00.000Z' },
          },
        },
        PaginationInfo: {
          type: 'object',
          properties: {
            total: { type: 'number', example: 1000000 },
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 10 },
            totalPages: { type: 'number', example: 100000 },
          },
        },
        UploadSuccessResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'CSV processing finished. Uploaded 1000000 records' },
            totalProcessedRecords: { type: 'number', example: 1000000 },
          },
        },
        ErrorMessageResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'No file uploaded.' },
            status: { type: 'number', example: 400 },
            data: { type: 'array', items: {}, example: [] },
          },
        },
        GenderDistributionItem: {
          type: 'object',
          properties: {
            count: { type: 'number', example: 522522 },
            gender: { type: 'string', example: 'Female' },
          },
        },
        GenderDistributionResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Data successfully fetched' },
            status: { type: 'number', example: 200 },
            data: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/GenderDistributionItem',
              },
            },
          },
        },
        ErrorMessageResponseWithEmptyArray: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Internal server error' },
            status: { type: 'number', example: 500 },
            data: { type: 'array', items: {}, example: [] },
          },
        },
        CustomerListResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Data successfully fetched' },
            status: { type: 'number', example: 200 },
            data: {
              type: 'object',
              properties: {
                records: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Customer',
                  },
                },
                pagination: {
                  $ref: '#/components/schemas/PaginationInfo',
                  nullable: true,
                },
              },
            },
          },
        },
        CustomerListErrorResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Internal server error' },
            status: { type: 'number', example: 500 },
            data: {
              type: 'object',
              properties: {
                records: { type: 'array', items: {}, example: [] },
                pagination: { nullable: true, example: null },
              },
            },
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;