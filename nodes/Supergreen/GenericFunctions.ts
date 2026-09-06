import {
  IExecuteFunctions,
  IHookFunctions,
  IHttpRequestOptions,
  ILoadOptionsFunctions,
  IWebhookFunctions,
  NodeOperationError,
} from 'n8n-workflow';

export interface ISupergreenCredentials {
  baseUrl?: string;
  apiToken: string;
  defaultPhoneNumber?: string;
}

export function normalizeWhatsAppNumber(rawNumber: string): string {
  const trimmed = rawNumber.trim();
  if (!trimmed) return '';
  if (trimmed.endsWith('@c.us') || trimmed.endsWith('@g.us') || trimmed.endsWith('@lid')) {
    return trimmed;
  }
  const digitsOnly = trimmed.replace(/\D/g, '');
  // If looks like an individual phone number, append @c.us
  if (digitsOnly.length >= 10 && digitsOnly.length <= 15) {
    return `${digitsOnly}@c.us`;
  }
  return digitsOnly;
}

export function normalizePhoneNumber(rawNumber: string): string {
  return rawNumber.replace(/\D/g, '');
}

export async function supergreenApiRequest(
  this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions | IWebhookFunctions,
  endpoint: string,
  payload: Record<string, unknown>,
  itemIndex?: number,
): Promise<any> {
  const credentials = (await this.getCredentials('supergreenApi')) as unknown as ISupergreenCredentials;

  const baseUrl = (credentials?.baseUrl || 'https://api.supergreen.cc').replace(/\/$/, '');
  const token = credentials?.apiToken;

  if (!token) {
    throw new NodeOperationError(
      this.getNode(),
      'Supergreen API Token / Secret Token is required in credentials',
      { itemIndex },
    );
  }

  const payloadWithToken = {
    ...payload,
    token,
  };

  const options: IHttpRequestOptions = {
    method: 'POST',
    url: `${baseUrl}/`,
    body: {
      endpoint,
      payload: payloadWithToken,
    },
    headers: {
      'Content-Type': 'application/json',
    },
    json: true,
  };

  try {
    const response = await this.helpers.httpRequestWithAuthentication.call(
      this,
      'supergreenApi',
      options,
    );

    if (response && typeof response === 'object') {
      if (response.success === false && response.error) {
        throw new NodeOperationError(this.getNode(), `Supergreen API Error: ${response.error}`, {
          itemIndex,
        });
      }
      if (response.error && typeof response.error === 'string') {
        throw new NodeOperationError(this.getNode(), `Supergreen API Error: ${response.error}`, {
          itemIndex,
        });
      }
    }

    return response;
  } catch (error: any) {
    const message = error.response?.data?.error || error.message || 'Unknown Supergreen API Error';
    throw new NodeOperationError(this.getNode(), `Supergreen request failed: ${message}`, {
      itemIndex,
    });
  }
}
