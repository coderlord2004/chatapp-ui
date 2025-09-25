import { AttachmentType } from "./Attachment";

type MessageRequestType = {
    message: string;
    file?: File;
    json?: object;
};

type MessageResponseType = {
    id: number;
    sender: string;
    message: string | null;
    sentOn?: string;
    attachments: AttachmentType[] | null;
    sending?: boolean;
    isFake?: boolean;
    isUpdated?: boolean;
};

type GlobalMessageResponse = {
    roomId: number;
    message: MessageResponseType;
};
type UpdateMessageParams = {
    messageId: number;
    newMessage: string;
    sending: boolean;
    isUpdated: boolean;
};
type SignalMessage = {
    type: 'offer' | 'answer' | 'candidate';
    caller: string;
    target: string;
    sdp?: RTCSessionDescriptionInit;
    candidate?: RTCIceCandidateInit;
};

export type {
    MessageRequestType,
    MessageResponseType,
    GlobalMessageResponse,
    UpdateMessageParams,
    SignalMessage
}