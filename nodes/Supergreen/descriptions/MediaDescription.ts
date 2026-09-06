import { INodeProperties } from 'n8n-workflow';

export const mediaOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['media'],
      },
    },
    options: [
      {
        name: 'Send Media',
        value: 'sendMedia',
        description: 'Send an image, video, document, or audio file',
        action: 'Send media',
      },
    ],
    default: 'sendMedia',
  },
];

export const mediaFields: INodeProperties[] = [
  {
    displayName: 'Sender Phone Number',
    name: 'fromNumber',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['media'],
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
        resource: ['media'],
      },
    },
    default: '',
    placeholder: 'e.g. 14155552671 or 120363024567@g.us',
    description: 'WhatsApp number or Group Chat ID',
  },
  {
    displayName: 'Media Type',
    name: 'type',
    type: 'options',
    options: [
      { name: 'Image', value: 'image' },
      { name: 'Document / PDF', value: 'document' },
      { name: 'Video', value: 'video' },
      { name: 'Audio', value: 'audio' },
    ],
    default: 'image',
    required: true,
    displayOptions: {
      show: {
        resource: ['media'],
      },
    },
  },
  {
    displayName: 'Media Source',
    name: 'mediaSource',
    type: 'options',
    options: [
      {
        name: 'Input Binary Field (Previous Node)',
        value: 'binary',
        description: 'Use a file passed from a previous node (e.g. HTTP Request, Read File)',
      },
      {
        name: 'Download From URL',
        value: 'url',
        description: 'Download media from a public URL and send it',
      },
      {
        name: 'Base64 String',
        value: 'base64',
        description: 'Pass base64 encoded media string',
      },
    ],
    default: 'binary',
    displayOptions: {
      show: {
        resource: ['media'],
      },
    },
  },
  {
    displayName: 'Input Data Field Name',
    name: 'binaryPropertyName',
    type: 'string',
    default: 'data',
    required: true,
    displayOptions: {
      show: {
        resource: ['media'],
        mediaSource: ['binary'],
      },
    },
    description: 'Name of the binary property containing the file to send',
  },
  {
    displayName: 'File URL',
    name: 'mediaUrl',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['media'],
        mediaSource: ['url'],
      },
    },
    placeholder: 'https://example.com/invoice.pdf',
    description: 'URL of the media file to fetch and send',
  },
  {
    displayName: 'Base64 Data',
    name: 'base64Data',
    type: 'string',
    typeOptions: {
      rows: 4,
    },
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['media'],
        mediaSource: ['base64'],
      },
    },
    description: 'Base64 encoded string of the media (with or without data URI prefix)',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['media'],
      },
    },
    options: [
      {
        displayName: 'Caption',
        name: 'caption',
        type: 'string',
        default: '',
        description: 'Caption to accompany the media',
      },
      {
        displayName: 'Filename',
        name: 'filename',
        type: 'string',
        default: '',
        description: 'Override filename for documents/attachments',
      },
      {
        displayName: 'MIME Type',
        name: 'mimeType',
        type: 'string',
        default: '',
        description: 'Override MIME type (e.g. application/pdf, image/jpeg)',
      },
    ],
  },
];
