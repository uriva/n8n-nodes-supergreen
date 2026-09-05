import {
  IDataObject,
  IHookFunctions,
  INodeType,
  INodeTypeDescription,
  IWebhookFunctions,
  IWebhookResponseData,
} from 'n8n-workflow';

import {
  ISupergreenCredentials,
  normalizePhoneNumber,
  supergreenApiRequest,
} from './GenericFunctions';

export class SupergreenTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Supergreen Trigger',
    name: 'supergreenTrigger',
    icon: 'file:supergreen.svg',
    group: ['trigger'],
    version: 1,
    description: 'Listen to incoming WhatsApp and Telegram messages, reactions, and events from Supergreen',
    defaults: {
      name: 'Supergreen Trigger',
    },
    inputs: [],
    outputs: ['main'],
    credentials: [
      {
        name: 'supergreenApi',
        required: true,
      },
    ],
    webhooks: [
      {
        name: 'default',
        httpMethod: 'POST',
        responseMode: 'onReceived',
        path: 'webhook',
      },
    ],
    properties: [
      {
        displayName: 'Network',
        name: 'network',
        type: 'options',
        options: [
          { name: 'WhatsApp', value: 'whatsapp' },
          { name: 'Telegram', value: 'telegram' },
          { name: 'Both (WhatsApp & Telegram)', value: 'both' },
        ],
        default: 'whatsapp',
        description: 'Which messaging platform to listen to',
      },
      {
        displayName: 'Phone Number',
        name: 'phoneNumber',
        type: 'string',
        default: '',
        placeholder: 'Leave blank to use default from credentials',
        description: 'Phone number of the connected account to receive events for',
      },
      {
        displayName: 'Events',
        name: 'events',
        type: 'multiOptions',
        options: [
          { name: 'Message Received', value: 'message', description: 'New incoming or outgoing message' },
          { name: 'Message Edited', value: 'edit', description: 'Existing message edited' },
          { name: 'Message Deleted', value: 'delete', description: 'Message deleted for everyone' },
          { name: 'Reaction Added', value: 'reaction', description: 'Emoji reaction to a message' },
          { name: 'Poll Vote', value: 'vote', description: 'Vote cast on a poll' },
          { name: 'Participant Joined Group', value: 'participant_joined', description: 'New member joined group' },
          { name: 'Account Connected', value: 'connected', description: 'Account session successfully established' },
          { name: 'Account Disconnected', value: 'disconnected', description: 'Account lost connection' },
          { name: 'Account Banned', value: 'banned', description: 'Account banned by platform' },
        ],
        default: ['message'],
        description: 'Select which events should trigger this workflow',
      },
      {
        displayName: 'Only Incoming Messages',
        name: 'onlyIncoming',
        type: 'boolean',
        default: true,
        description: 'Whether to ignore messages sent by the bot/account itself (fromMe = true)',
      },
    ],
  };

  webhookMethods = {
    default: {
      async checkExists(this: IHookFunctions): Promise<boolean> {
        return false;
      },
      async create(this: IHookFunctions): Promise<boolean> {
        const webhookUrl = this.getNodeWebhookUrl('default');
        if (!webhookUrl) return false;

        const network = this.getNodeParameter('network', 'whatsapp') as string;
        const rawPhone = this.getNodeParameter('phoneNumber', '') as string;
        const credentials = (await this.getCredentials('supergreenApi')) as unknown as ISupergreenCredentials;
        const phoneNumber = normalizePhoneNumber(rawPhone || credentials.defaultPhoneNumber || '');

        if (!phoneNumber) {
          return true;
        }

        try {
          if (network === 'whatsapp' || network === 'both') {
            await supergreenApiRequest.call(this, 'addWebhook', { phoneNumber, url: webhookUrl });
          }
          if (network === 'telegram' || network === 'both') {
            await supergreenApiRequest.call(this, 'addTelegramWebhook', { phoneNumber, url: webhookUrl });
          }
        } catch {
          // Log and proceed; manual webhook setting remains an option in Supergreen dashboard
        }
        return true;
      },
      async delete(this: IHookFunctions): Promise<boolean> {
        const webhookUrl = this.getNodeWebhookUrl('default');
        if (!webhookUrl) return false;

        const network = this.getNodeParameter('network', 'whatsapp') as string;
        const rawPhone = this.getNodeParameter('phoneNumber', '') as string;
        const credentials = (await this.getCredentials('supergreenApi')) as unknown as ISupergreenCredentials;
        const phoneNumber = normalizePhoneNumber(rawPhone || credentials.defaultPhoneNumber || '');

        if (!phoneNumber) {
          return true;
        }

        try {
          if (network === 'whatsapp' || network === 'both') {
            await supergreenApiRequest.call(this, 'removeWebhook', { phoneNumber, url: webhookUrl });
          }
          if (network === 'telegram' || network === 'both') {
            await supergreenApiRequest.call(this, 'removeTelegramWebhook', { phoneNumber, url: webhookUrl });
          }
        } catch {
          // Ignore cleanup errors on deactivation
        }
        return true;
      },
    },
  };

  async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
    const body = this.getBodyData() as IDataObject;
    const selectedEvents = this.getNodeParameter('events', []) as string[];
    const onlyIncoming = this.getNodeParameter('onlyIncoming', true) as boolean;
    const network = this.getNodeParameter('network', 'whatsapp') as string;

    const eventName = (body.event as string) || 'message';
    const bodyNetwork = (body.network as string) || 'whatsapp';

    // Network filter
    if (network !== 'both' && bodyNetwork !== network) {
      return {};
    }

    // Event filter
    if (selectedEvents.length > 0 && !selectedEvents.includes(eventName)) {
      return {};
    }

    // Ignore self messages if onlyIncoming is checked
    if (onlyIncoming && body.fromMe === true) {
      return {};
    }

    return {
      workflowData: [this.helpers.returnJsonArray([body])],
    };
  }
}
