import type { Handler } from '@netlify/functions';

const TRACCAR_URL = 'https://demo4.traccar.org';

export const handler: Handler = async (event) => {
  try {
    const method = event.httpMethod;

    /*
     * ============================================================
     * POST /api/session
     * Login
     * ============================================================
     */
    if (method === 'POST') {
      const response = await fetch(
        `${TRACCAR_URL}/api/session`,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              event.headers['content-type'] ??
              'application/x-www-form-urlencoded'
          },
          body: event.body ?? ''
        }
      );

      const responseBody = await response.text();

      const headers: Record<string, string> = {
        'Content-Type':
          response.headers.get('content-type') ??
          'application/json'
      };

      const setCookie =
        response.headers.get('set-cookie');

      if (setCookie) {
        headers['Set-Cookie'] = setCookie;
      }

      return {
        statusCode: response.status,
        headers,
        body: responseBody
      };
    }

    /*
     * ============================================================
     * GET /api/session
     * Comprobar sesión actual
     * ============================================================
     */
    if (method === 'GET') {
      const cookie =
        event.headers['cookie'] ??
        event.headers['Cookie'];

      const response = await fetch(
        `${TRACCAR_URL}/api/session`,
        {
          method: 'GET',
          headers: cookie
            ? {
                Cookie: cookie
              }
            : undefined
        }
      );

      const responseBody = await response.text();

      return {
        statusCode: response.status,
        headers: {
          'Content-Type':
            response.headers.get('content-type') ??
            'application/json'
        },
        body: responseBody
      };
    }

    /*
     * ============================================================
     * DELETE /api/session
     * Logout
     * ============================================================
     */
    if (method === 'DELETE') {
      const cookie =
        event.headers['cookie'] ??
        event.headers['Cookie'];

      const response = await fetch(
        `${TRACCAR_URL}/api/session`,
        {
          method: 'DELETE',
          headers: cookie
            ? {
                Cookie: cookie
              }
            : undefined
        }
      );

      const responseBody = await response.text();

      const headers: Record<string, string> = {
        'Content-Type':
          response.headers.get('content-type') ??
          'application/json'
      };

      const setCookie =
        response.headers.get('set-cookie');

      if (setCookie) {
        headers['Set-Cookie'] = setCookie;
      }

      return {
        statusCode: response.status,
        headers,
        body: responseBody
      };
    }

    /*
     * ============================================================
     * Método no permitido
     * ============================================================
     */
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Method Not Allowed'
      })
    };
  } catch (error) {
    console.error(
      'Traccar session error:',
      error
    );

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message:
          'No fue posible comunicarse con Traccar.'
      })
    };
  }
};