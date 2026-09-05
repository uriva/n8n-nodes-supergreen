import { INodeProperties } from 'n8n-workflow';

export const telegramOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['telegram'],
      },
    },
    options: [
      {
        name: 'Send Message',
        value: 'sendMessage',
        description: 'Send a message via connected Telegram account',
        action: 'Send a telegram message',
      },
      {
        name: 'Get Many Groups',
        value: 'getAllGroups',
        description: 'List Telegram groups and channels',
        action: 'Get all telegram groups',
      },
      {
        name: 'Join Group',
        value: 'joinGroup',
        description: 'Join a Telegram group or channel by username',
        action: 'Join a telegram group',
      },
    ],
    default: 'sendMessage',
  },
];

export const telegramFields: INodeProperties[] = [
  {
    displayName: 'Sender Phone Number',
    name: 'phoneNumber',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['telegram'],
      },
    },
    default: '',
    placeholder: 'Leave blank to use default from credentials',
    description: 'Your connected Telegram phone number (digits only, e.g. 14155552671)',
  },
  {
    displayName: 'Chat ID / Username',
    name: 'chatId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['telegram'],
        operation: ['sendMessage'],
      },
    },
    default: '',
    placeholder: 'e.g. @username or -100123456789',
    description: 'Telegram chat ID or @username to send the message to',
  },
  {
    displayName: 'Message Text',
    name: 'text',
    type: 'string',
    typeOptions: {
      rows: 4,
    },
    required: true,
    displayOptions: {
      show: {
        resource: ['telegram'],
        operation: ['sendMessage'],
      },
    },
    default: '',
    description: 'The text message to send on Telegram',
  },
  {
    displayName: 'Group / Channel Username',
    name: 'groupUsername',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['telegram'],
        operation: ['joinGroup'],
      },
    },
    default: '',
    placeholder: 'e.g. channel_username (without @)',
    description: 'Username of the Telegram public group or channel to join',
  },
];
