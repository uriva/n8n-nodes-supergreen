import { INodeProperties } from 'n8n-workflow';

export const groupOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['group'],
      },
    },
    options: [
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'Get all WhatsApp groups the account belongs to',
        action: 'Get all groups',
      },
      {
        name: 'Get Details',
        value: 'getDetails',
        description: 'Get details (subject, description, owner) of a specific group',
        action: 'Get group details',
      },
      {
        name: 'Get Members',
        value: 'getMembers',
        description: 'List all participants in a group',
        action: 'Get group members',
      },
      {
        name: 'Get Invite Link',
        value: 'getInviteLink',
        description: 'Get the invite link for a group (must be group admin)',
        action: 'Get group invite link',
      },
      {
        name: 'Join Group',
        value: 'join',
        description: 'Join a WhatsApp group using an invite link or code',
        action: 'Join a group',
      },
      {
        name: 'Add Participant',
        value: 'addParticipant',
        description: 'Add a user to a group (must be group admin)',
        action: 'Add a participant',
      },
      {
        name: 'Remove Participant',
        value: 'removeParticipant',
        description: 'Remove a user from a group (must be group admin)',
        action: 'Remove a participant',
      },
    ],
    default: 'getAll',
  },
];

export const groupFields: INodeProperties[] = [
  {
    displayName: 'Sender Phone Number',
    name: 'fromNumber',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['group'],
      },
    },
    default: '',
    placeholder: 'Leave blank to use default from credentials',
    description: 'Your connected WhatsApp number (digits only, e.g. 14155552671)',
  },
  {
    displayName: 'Group ID',
    name: 'groupId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['group'],
        operation: ['getDetails', 'getMembers', 'getInviteLink', 'addParticipant', 'removeParticipant'],
      },
    },
    default: '',
    placeholder: 'e.g. 120363024567@g.us',
    description: 'The WhatsApp group ID',
  },
  {
    displayName: 'Invite Link or Code',
    name: 'inviteCode',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['group'],
        operation: ['join'],
      },
    },
    default: '',
    placeholder: 'https://chat.whatsapp.com/AbCdEfGhIjKlMnOp or code',
    description: 'Full invite link or code to join the group',
  },
  {
    displayName: 'Participant Phone Number',
    name: 'participantPhone',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['group'],
        operation: ['addParticipant', 'removeParticipant'],
      },
    },
    default: '',
    placeholder: 'e.g. 14155552671',
    description: 'Phone number of the participant to add or remove',
  },
];
