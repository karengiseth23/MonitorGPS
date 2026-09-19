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

    const deviceId =
      event.queryStringParameters?.[
        'deviceId'
      ];

    if (!deviceId) {

      return {
        statusCode: 400,
        headers: {
          'Content-Type':
            'application/json'
        },
        body: JSON.stringify({
          message:
            'El parámetro deviceId es obligatorio.'
        })
      };
    }

    const cookie =
      event.headers['cookie'] ??
      event.headers['Cookie'];

    const response =
      await fetch(
        `${TRACCAR_URL}/api/positions?deviceId=${encodeURIComponent(deviceId)}`,
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
      'Traccar positions error:',
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
          'No fue posible obtener la posición del vehículo.'
      })
    };
  }
};