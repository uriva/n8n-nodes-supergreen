import { INodeProperties } from 'n8n-workflow';

export const pollOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['poll'],
      },
    },
    options: [
      {
        name: 'Send Poll',
        value: 'sendPoll',
        description: 'Create and send an interactive poll to a chat or group',
        action: 'Send a poll',
      },
    ],
    default: 'sendPoll',
  },
];

export const pollFields: INodeProperties[] = [
  {
    displayName: 'Sender Phone Number',
    name: 'fromNumber',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['poll'],
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
        resource: ['poll'],
      },
    },
    default: '',
    placeholder: 'e.g. 14155552671 or 120363024567@g.us',
    description: 'WhatsApp number or Group Chat ID',
  },
  {
    displayName: 'Poll Question',
    name: 'name',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['poll'],
      },
    },
    default: '',
    description: 'The question or title of the poll',
  },
  {
    displayName: 'Poll Options',
    name: 'options',
    type: 'string',
    typeOptions: {
      rows: 3,
    },
    required: true,
    displayOptions: {
      show: {
        resource: ['poll'],
      },
    },
    default: '',
    placeholder: 'Option 1, Option 2, Option 3 (or one per line)',
    description: 'Choices for the poll, separated by commas or newlines',
  },
];
