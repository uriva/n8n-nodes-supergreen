import { INodeProperties } from 'n8n-workflow';

export const messageOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['message'],
      },
    },
    options: [
      {
        name: 'Send Message',
        value: 'send',
        description: 'Send a WhatsApp text message to an individual or group',
        action: 'Send a message',
      },
      {
        name: 'Edit Message',
        value: 'edit',
        description: 'Edit a previously sent message',
        action: 'Edit a message',
      },
      {
        name: 'Delete Message',
        value: 'delete',
        description: 'Delete a sent message for everyone',
        action: 'Delete a message',
      },
      {
        name: 'Send Typing Indicator',
        value: 'sendTyping',
        description: 'Display typing indicator in a chat',
        action: 'Send typing indicator',
      },
    ],
    default: 'send',
  },
];

export const messageFields: INodeProperties[] = [
  // Common fromNumber
  {
    displayName: 'Sender Phone Number',
    name: 'fromNumber',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['message'],
      },
    },
    default: '',
    placeholder: 'Leave blank to use default from credentials',
    description: 'Your connected WhatsApp number (digits only, e.g. 14155552671)',
  },

  // Recipient toNumber
  {
    displayName: 'Recipient Number / Chat ID',
    name: 'toNumber',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['message'],
        operation: ['send', 'edit', 'delete', 'sendTyping'],
      },
    },
    default: '',
    placeholder: 'e.g. 14155552671 or 120363024567@g.us',
    description: 'WhatsApp number or Group Chat ID. Number will automatically receive @c.us if not specified.',
  },

  // send: message text
  {
    displayName: 'Message',
    name: 'message',
    type: 'string',
    typeOptions: {
      rows: 4,
    },
    required: true,
    displayOptions: {
      show: {
        resource: ['message'],
        operation: ['send'],
      },
    },
    default: '',
    description: 'The text message content to send',
  },

  // send: additional fields
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['message'],
        operation: ['send'],
      },
    },
    options: [
      {
        displayName: 'Link Preview',
        name: 'linkPreview',
        type: 'boolean',
        default: false,
        description: 'Whether to generate rich link preview for URLs in the message',
      },
      {
        displayName: 'Quoted Message ID',
        name: 'quotedMessageId',
        type: 'string',
        default: '',
        description: 'ID of an earlier message to reply to / quote',
      },
    ],
  },

  // edit: messageId and newText
  {
    displayName: 'Message ID',
    name: 'messageId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['message'],
        operation: ['edit', 'delete'],
      },
    },
    default: '',
    description: 'The ID of the message to edit or delete',
  },
  {
    displayName: 'New Text',
    name: 'newText',
    type: 'string',
    typeOptions: {
      rows: 3,
    },
    required: true,
    displayOptions: {
      show: {
        resource: ['message'],
        operation: ['edit'],
      },
    },
    default: '',
    description: 'The updated message text',
  },

  // typing: duration
  {
    displayName: 'Duration (ms)',
    name: 'duration',
    type: 'number',
    displayOptions: {
      show: {
        resource: ['message'],
        operation: ['sendTyping'],
      },
    },
    default: 3000,
    description: 'How long the typing indicator should remain active in milliseconds',
  },
];
