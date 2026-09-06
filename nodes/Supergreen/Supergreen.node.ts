import {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeConnectionTypes,
  NodeOperationError,
} from 'n8n-workflow';

import {
  ISupergreenCredentials,
  normalizePhoneNumber,
  normalizeWhatsAppNumber,
  supergreenApiRequest,
} from './GenericFunctions';

import { messageFields, messageOperations } from './descriptions/MessageDescription';
import { mediaFields, mediaOperations } from './descriptions/MediaDescription';
import { pollFields, pollOperations } from './descriptions/PollDescription';
import { reactionFields, reactionOperations } from './descriptions/ReactionDescription';
import { groupFields, groupOperations } from './descriptions/GroupDescription';
import { telegramFields, telegramOperations } from './descriptions/TelegramDescription';

async function fetchUrlAsBase64(helpers: IExecuteFunctions['helpers'], url: string): Promise<string> {
  const fileResponse = await helpers.httpRequest({
    method: 'GET',
    url,
    encoding: 'arraybuffer',
  });
  return Buffer.from(fileResponse).toString('base64');
}

async function getEffectiveSender(
  thisNode: IExecuteFunctions,
  paramName: string,
  itemIndex: number,
): Promise<string> {
  const raw = thisNode.getNodeParameter(paramName, itemIndex, '') as string;
  if (raw) return normalizePhoneNumber(raw);
  const creds = (await thisNode.getCredentials('supergreenApi')) as unknown as ISupergreenCredentials;
  const num = creds.defaultPhoneNumber || '';
  if (!num) {
    throw new NodeOperationError(
      thisNode.getNode(),
      'Sender phone number is required. Provide it in the node or set a default in Supergreen credentials.',
      { itemIndex },
    );
  }
  return normalizePhoneNumber(num);
}

export class Supergreen implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Supergreen',
    name: 'supergreen',
    icon: { light: 'file:supergreen.svg', dark: 'file:supergreen.dark.svg' },
    group: ['transform'],
    version: 1,
    usableAsTool: true,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Automate WhatsApp and Telegram with Supergreen API',
    defaults: {
      name: 'Supergreen',
    },
    inputs: [NodeConnectionTypes.Main],
    outputs: [NodeConnectionTypes.Main],
    credentials: [
      {
        name: 'supergreenApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Group',
            value: 'group',
            description: 'Manage WhatsApp groups, members, and invite links',
          },
          {
            name: 'Media',
            value: 'media',
            description: 'Send images, videos, documents, or audio files over WhatsApp',
          },
          {
            name: 'Message',
            value: 'message',
            description: 'Send, edit, or delete WhatsApp text messages',
          },
          {
            name: 'Poll',
            value: 'poll',
            description: 'Send interactive polls to WhatsApp chats or groups',
          },
          {
            name: 'Reaction',
            value: 'reaction',
            description: 'React to WhatsApp messages with emojis',
          },
          {
            name: 'Telegram',
            value: 'telegram',
            description: 'Send messages and manage groups on Telegram',
          },
        ],
        default: 'message',
      },
      ...messageOperations,
      ...messageFields,
      ...mediaOperations,
      ...mediaFields,
      ...pollOperations,
      ...pollFields,
      ...reactionOperations,
      ...reactionFields,
      ...groupOperations,
      ...groupFields,
      ...telegramOperations,
      ...telegramFields,
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      try {
        const resource = this.getNodeParameter('resource', i) as string;
        const operation = this.getNodeParameter('operation', i) as string;

        let responseData: any;

        if (resource === 'message') {
          const fromNumber = await getEffectiveSender(this, 'fromNumber', i);
          const rawTo = this.getNodeParameter('toNumber', i) as string;
          const toNumber = normalizeWhatsAppNumber(rawTo);

          if (operation === 'send') {
            const message = this.getNodeParameter('message', i) as string;
            const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;

            responseData = await supergreenApiRequest.call(
              this,
              'sendMessage',
              {
                fromNumber,
                toNumber,
                message,
                linkPreview: Boolean(additionalFields.linkPreview ?? false),
                quotedMessageId: additionalFields.quotedMessageId
                  ? String(additionalFields.quotedMessageId)
                  : undefined,
              },
              i,
            );
          } else if (operation === 'edit') {
            const messageId = this.getNodeParameter('messageId', i) as string;
            const newText = this.getNodeParameter('newText', i) as string;

            responseData = await supergreenApiRequest.call(
              this,
              'editMessage',
              {
                fromNumber,
                toNumber,
                messageId,
                newText,
              },
              i,
            );
          } else if (operation === 'delete') {
            const messageId = this.getNodeParameter('messageId', i) as string;

            responseData = await supergreenApiRequest.call(
              this,
              'deleteMessage',
              {
                fromNumber,
                toNumber,
                messageId,
              },
              i,
            );
          } else if (operation === 'sendTyping') {
            const duration = this.getNodeParameter('duration', i, 3000) as number;

            responseData = await supergreenApiRequest.call(
              this,
              'sendTypingIndication',
              {
                fromNumber,
                toNumber,
                duration,
              },
              i,
            );
          }
        } else if (resource === 'media') {
          const fromNumber = await getEffectiveSender(this, 'fromNumber', i);
          const rawTo = this.getNodeParameter('toNumber', i) as string;
          const toNumber = normalizeWhatsAppNumber(rawTo);
          const type = this.getNodeParameter('type', i) as string;
          const mediaSource = this.getNodeParameter('mediaSource', i) as string;
          const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;

          let base64 = '';
          let mimeType = additionalFields.mimeType ? String(additionalFields.mimeType) : undefined;
          let filename = additionalFields.filename ? String(additionalFields.filename) : undefined;

          if (mediaSource === 'binary') {
            const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
            const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
            const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
            base64 = buffer.toString('base64');
            if (!mimeType) mimeType = binaryData.mimeType;
            if (!filename) filename = binaryData.fileName;
          } else if (mediaSource === 'url') {
            const mediaUrl = this.getNodeParameter('mediaUrl', i) as string;
            base64 = await fetchUrlAsBase64(this.helpers, mediaUrl);
            if (!filename) {
              try {
                const urlObj = new URL(mediaUrl);
                const pathParts = urlObj.pathname.split('/');
                filename = pathParts[pathParts.length - 1] || undefined;
              } catch {
                // Ignore URL parsing failure
              }
            }
          } else if (mediaSource === 'base64') {
            base64 = this.getNodeParameter('base64Data', i) as string;
          }

          responseData = await supergreenApiRequest.call(
            this,
            'sendMedia',
            {
              fromNumber,
              toNumber,
              type,
              base64,
              mimeType,
              filename,
              caption: additionalFields.caption ? String(additionalFields.caption) : undefined,
            },
            i,
          );
        } else if (resource === 'poll') {
          const fromNumber = await getEffectiveSender(this, 'fromNumber', i);
          const rawTo = this.getNodeParameter('toNumber', i) as string;
          const toNumber = normalizeWhatsAppNumber(rawTo);
          const name = this.getNodeParameter('name', i) as string;
          const rawOptions = String(this.getNodeParameter('options', i) || '');

          const choices = rawOptions
            .split(/[\n,]/)
            .map((opt) => opt.trim())
            .filter((opt) => opt.length > 0);

          if (choices.length < 2) {
            throw new NodeOperationError(
              this.getNode(),
              'A poll must have at least 2 options (separated by commas or newlines)',
              { itemIndex: i },
            );
          }

          responseData = await supergreenApiRequest.call(
            this,
            'sendPoll',
            {
              fromNumber,
              toNumber,
              name,
              choices,
            },
            i,
          );
        } else if (resource === 'reaction') {
          const fromNumber = await getEffectiveSender(this, 'fromNumber', i);
          const rawTo = this.getNodeParameter('toNumber', i) as string;
          const toNumber = normalizeWhatsAppNumber(rawTo);
          const messageId = this.getNodeParameter('messageId', i) as string;
          const reaction = this.getNodeParameter('reaction', i) as string;

          responseData = await supergreenApiRequest.call(
            this,
            'sendReaction',
            {
              fromNumber,
              toNumber,
              messageId,
              reaction,
            },
            i,
          );
        } else if (resource === 'group') {
          const fromNumber = await getEffectiveSender(this, 'fromNumber', i);

          if (operation === 'getAll') {
            responseData = await supergreenApiRequest.call(
              this,
              'getGroups',
              { fromNumber },
              i,
            );
          } else if (operation === 'getDetails') {
            const groupId = this.getNodeParameter('groupId', i) as string;
            responseData = await supergreenApiRequest.call(
              this,
              'getWhatsappGroupDetails',
              { fromNumber, groupId },
              i,
            );
          } else if (operation === 'getMembers') {
            const groupId = this.getNodeParameter('groupId', i) as string;
            responseData = await supergreenApiRequest.call(
              this,
              'getGroupMembers',
              { fromNumber, groupId },
              i,
            );
          } else if (operation === 'getInviteLink') {
            const groupId = this.getNodeParameter('groupId', i) as string;
            responseData = await supergreenApiRequest.call(
              this,
              'getGroupInviteLink',
              { fromNumber, groupId },
              i,
            );
          } else if (operation === 'join') {
            const rawInvite = this.getNodeParameter('inviteCode', i) as string;
            const inviteCode = rawInvite.replace(/https?:\/\/chat\.whatsapp\.com\//, '').trim();
            responseData = await supergreenApiRequest.call(
              this,
              'joinGroupByInviteLink',
              { fromNumber, inviteCode },
              i,
            );
          } else if (operation === 'addParticipant') {
            const groupId = this.getNodeParameter('groupId', i) as string;
            const participantPhone = normalizePhoneNumber(this.getNodeParameter('participantPhone', i) as string);
            responseData = await supergreenApiRequest.call(
              this,
              'addUserToWhatsAppGroup',
              { fromNumber, groupId, phone: participantPhone },
              i,
            );
          } else if (operation === 'removeParticipant') {
            const groupId = this.getNodeParameter('groupId', i) as string;
            const participantPhone = normalizePhoneNumber(this.getNodeParameter('participantPhone', i) as string);
            responseData = await supergreenApiRequest.call(
              this,
              'removeUserFromWhatsAppGroup',
              { fromNumber, groupId, phone: participantPhone },
              i,
            );
          }
        } else if (resource === 'telegram') {
          const phoneNumber = await getEffectiveSender(this, 'phoneNumber', i);

          if (operation === 'sendMessage') {
            const chatId = this.getNodeParameter('chatId', i) as string;
            const text = this.getNodeParameter('text', i) as string;

            responseData = await supergreenApiRequest.call(
              this,
              'sendTelegramMessage',
              {
                phoneNumber,
                chatId,
                text,
              },
              i,
            );
          } else if (operation === 'getAllGroups') {
            responseData = await supergreenApiRequest.call(
              this,
              'getTelegramGroups',
              { phoneNumber },
              i,
            );
          } else if (operation === 'joinGroup') {
            const groupUsername = (this.getNodeParameter('groupUsername', i) as string).replace(/^@/, '').trim();
            responseData = await supergreenApiRequest.call(
              this,
              'joinTelegramGroup',
              {
                phoneNumber,
                groupUsername,
              },
              i,
            );
          }
        }

        const executionData = this.helpers.constructExecutionMetaData(
          this.helpers.returnJsonArray(responseData as IDataObject[]),
          { itemData: { item: i } },
        );
        returnData.push(...executionData);
      } catch (error: any) {
        if (this.continueOnFail()) {
          returnData.push({
            json: { error: error.message },
            pairedItem: { item: i },
          });
          continue;
        }
        throw new NodeOperationError(this.getNode(), error.message || 'Operation failed', {
          itemIndex: i,
        });
      }
    }

    return [returnData];
  }
}
