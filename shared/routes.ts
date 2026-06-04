import { z } from 'zod';
import { insertApplicationSchema, applications } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
    errors: z.array(z.object({ // Added for more detailed error reporting
      path: z.array(z.string()),
      message: z.string()
    })).optional(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
};

export const api = {
  applications: {
    create: {
      method: 'POST' as const,
      path: '/api/applications' as const,
      input: insertApplicationSchema, // This now uses the rebranded favoriteSlog schema
      responses: {
        201: z.custom<typeof applications.$inferSelect>(),
        400: errorSchemas.validation,
        500: errorSchemas.internal,
      },
    },
    status: {
      method: 'GET' as const,
      path: '/api/status/:address' as const, // Added :address parameter for clarity
      responses: {
        200: z.object({
          status: z.string()
        }),
        404: errorSchemas.notFound,
        500: errorSchemas.internal,
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      } else {
        url += `${url.includes('?') ? '&' : '?'}${key}=${value}`;
      }
    });
  }
  return url;
}

export type CreateApplicationInput = z.infer<typeof api.applications.create.input>;
export type ApplicationResponse = z.infer<typeof api.applications.create.responses[201]>;

