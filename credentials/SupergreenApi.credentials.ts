import {
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class SupergreenApi implements ICredentialType {
  name = 'supergreenApi';
  displayName = 'Supergreen API';
  documentationUrl = 'https://supergreen.cc';
  properties: INodeProperties[] = [
    {
      displayName: 'Base URL',
      name: 'baseUrl',
      type: 'string',
      default: 'https://api.supergreen.cc',
      required: true,
      description: 'Supergreen API Base URL (defaults to https://api.supergreen.cc)',
    },
    {
      displayName: 'Account Secret Token',
      name: 'apiToken',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      required: true,
      description: 'Your Supergreen account secret token (found in the Supergreen dashboard)',
    },
    {
      displayName: 'Default Phone Number',
      name: 'defaultPhoneNumber',
      type: 'string',
      default: '',
      placeholder: 'e.g. 14155552671 or 972501234567',
      description: 'Default sender WhatsApp/Telegram phone number (country code + number without plus or dashes)',
    },
  ];
}
