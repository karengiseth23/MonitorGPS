import type { Handler } from '@netlify/functions';

const TRACCAR_URL =
  'https://demo4.traccar.org';

export const handler: Handler = async (
  event
) => {

  try {

    if (event.httpMethod !== 'GET') {

      return {
        statusCode: 405,
        headers: {
          'Content-Type':
            'application/json'
        },
        body: JSON.stringify({
          message:
            'Method Not Allowed'
        })
      };

    }

    const cookie =
      event.headers['cookie'] ??
      event.headers['Cookie'];

    const response =
      await fetch(
        `${TRACCAR_URL}/api/devices`,
        {
          method: 'GET',
          headers: cookie
            ? {
                Cookie: cookie
              }
            : undefined
        }
      );

    const responseBody =
      await response.text();

    return {
      statusCode:
        response.status,

      headers: {
        'Content-Type':
          response.headers.get(
            'content-type'
          ) ??
          'application/json'
      },

      body:
        responseBody
    };

  } catch (error) {

    console.error(
      'Traccar devices error:',
      error
    );

    return {
      statusCode: 500,

      headers: {
        'Content-Type':
          'application/json'
      },

      body: JSON.stringify({
        message:
          'No fue posible obtener los vehículos.'
      })
    };
  }
};