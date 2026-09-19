import type {
  Handler
} from '@netlify/functions';

const TRACCAR_URL =
  'https://demo4.traccar.org';

export const handler: Handler = async (
  event
) => {

  try {

    if (event.httpMethod !== 'POST') {

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

    const response =
      await fetch(
        `${TRACCAR_URL}/api/session`,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              event.headers[
                'content-type'
              ] ??
              'application/x-www-form-urlencoded'
          },

          body:
            event.body ?? ''
        }
      );

    const responseBody =
      await response.text();

    const headers: Record<
      string,
      string
    > = {
      'Content-Type':
        response.headers.get(
          'content-type'
        ) ??
        'application/json'
    };

    const setCookie =
      response.headers.get(
        'set-cookie'
      );

    if (setCookie) {

      headers[
        'Set-Cookie'
      ] = setCookie;

    }

    return {
      statusCode:
        response.status,

      headers,

      body:
        responseBody
    };

  } catch (error) {

    console.error(
      'Traccar session error:',
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
          'No fue posible comunicarse con Traccar.'
      })
    };
  }
};