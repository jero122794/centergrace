// apps/api/src/shared/config/swagger.ts
import swaggerJsdoc from 'swagger-jsdoc';
import { APP_NAME, APP_VERSION } from './constants';
import { env } from './env';

const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: `${APP_NAME} API`,
    version: APP_VERSION,
    description:
      'API de la plataforma de estudios bíblicos, seguimiento espiritual y gestión de ministerios.',
  },
  servers: [{ url: `http://localhost:${env.PORT}`, description: 'Local development' }],
  tags: [
    { name: 'Auth', description: 'Registro, sesión y OAuth2 Google' },
    { name: 'Users', description: 'Gestión de usuarios y RBAC' },
    { name: 'Ministries', description: 'Ministerios de la iglesia' },
    { name: 'Groups', description: 'Grupos y membresías' },
    { name: 'Courses', description: 'Cursos, módulos y lecciones' },
    { name: 'Lessons', description: 'Lecciones y progreso' },
    { name: 'Devotionals', description: 'Devocionales y participaciones' },
    { name: 'Submissions', description: 'Entregas de trabajos' },
    { name: 'Grades', description: 'Calificaciones' },
    { name: 'SpiritualNotes', description: 'Notas espirituales privadas' },
    { name: 'Worship', description: 'Ministerio de Alabanza' },
    { name: 'Notifications', description: 'Web Push' },
    { name: 'Developer', description: 'Panel técnico exclusivo' },
    { name: 'Health', description: 'Salud del sistema' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    responses: {
      ValidationError: {
        description: 'Solicitud inválida',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
            example: {
              statusCode: 400,
              error: 'Bad Request',
              message: 'Validation failed',
            },
          },
        },
      },
      Unauthorized: {
        description: 'No autenticado',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
            example: { statusCode: 401, error: 'Unauthorized', message: 'Authentication required' },
          },
        },
      },
      Forbidden: {
        description: 'Sin permisos',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
            example: { statusCode: 403, error: 'Forbidden', message: 'Insufficient permissions' },
          },
        },
      },
      NotFound: {
        description: 'No encontrado',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
            example: { statusCode: 404, error: 'Not Found', message: 'Resource not found' },
          },
        },
      },
      Unprocessable: {
        description: 'Entidad no procesable',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
            example: { statusCode: 422, error: 'Unprocessable Entity', message: 'Business rule failed' },
          },
        },
      },
      InternalError: {
        description: 'Error interno',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
            example: {
              statusCode: 500,
              error: 'Internal Server Error',
              message: 'An unexpected error occurred',
            },
          },
        },
      },
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          statusCode: { type: 'integer' },
          error: { type: 'string' },
          message: { type: 'string' },
          details: {},
        },
        required: ['statusCode', 'error', 'message'],
      },
      PublicUser: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'clxuserdev001' },
          name: { type: 'string', example: 'Desarrollador Shalom' },
          email: { type: 'string', example: 'dev@iglesia.com' },
          role: { type: 'string', enum: ['DEVELOPER', 'ADMIN', 'LEADER', 'STUDENT'] },
          isActive: { type: 'boolean' },
          mustChangePassword: { type: 'boolean' },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          data: {
            type: 'object',
            properties: {
              user: { $ref: '#/components/schemas/PublicUser' },
              accessToken: { type: 'string' },
            },
          },
        },
      },
    },
  },
};

/**
 * Builds the OpenAPI 3.0 document from JSDoc across route files.
 */
export const buildOpenApiDocument = (): object =>
  swaggerJsdoc({
    definition: swaggerDefinition,
    apis: ['src/modules/**/interface/routes/*.ts', 'src/app.ts'],
  });
