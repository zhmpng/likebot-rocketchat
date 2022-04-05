import {
    IModify,
    IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import {
    IRoom,
} from "@rocket.chat/apps-engine/definition/rooms";
import {
    IUIKitViewSubmitIncomingInteraction,
} from '@rocket.chat/apps-engine/definition/uikit/UIKitIncomingInteractionTypes';

export async function initiatorMessage({
    modify,
    chanel,
    message
}: {
    modify: IModify;
    chanel: IRoom | undefined;
    message: string;
}) {
    const messageBuilder = await modify.
    getCreator().
    startMessage().
    setText(message);

    messageBuilder.setRoom(chanel as IRoom);
    await modify.getCreator().finish(messageBuilder);
}

export async function initiatorNotifierMessage({
    data,
    modify,
    message
}: {
    data,
    modify: IModify;
    message: string;
}) {
    const notifierBuilder = await modify
        .getCreator()
        .startMessage()
        .setRoom(data.room)
        .setText(message);

    await modify
        .getNotifier()
        .notifyUser(data.sender, notifierBuilder.getMessage());
}