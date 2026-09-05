import { INodeProperties } from 'n8n-workflow';

export const reactionOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['reaction'],
      },
    },
    options: [
      {
        name: 'Send Reaction',
        value: 'sendReaction',
        description: 'React to a WhatsApp message with an emoji',
        action: 'Send a reaction',
      },
    ],
    default: 'sendReaction',
  },
];

export const reactionFields: INodeProperties[] = [
  {
    displayName: 'Sender Phone Number',
    name: 'fromNumber',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['reaction'],
      },
    },
    default: '',
    placeholder: 'Leave blank to use default from credentials',
    description: 'Your connected WhatsApp number (digits only, e.g. 14155552671)',
  },
  {
    displayName: 'Recipient Number / Chat ID',
    name: 'toNumber',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['reaction'],
      },
    },
    default: '',
    placeholder: 'e.g. 14155552671 or 120363024567@g.us',
    description: 'WhatsApp number or Group Chat ID where the target message is',
  },
  {
    displayName: 'Message ID',
    name: 'messageId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['reaction'],
      },
    },
    default: '',
    description: 'The ID of the message to react to',
  },
  {
    displayName: 'Emoji Reaction',
    name: 'reaction',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['reaction'],
      },
    },
    default: '👍',
    placeholder: '👍, ❤️, 🔥, etc.',
    description: 'Emoji to react with (send empty string to remove reaction)',
  },
];
