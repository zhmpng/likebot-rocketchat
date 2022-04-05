import {
    ISlashCommand,
    SlashCommandContext,
} from "@rocket.chat/apps-engine/definition/slashcommands";
import {
    IHttp,
    IModify,
    IRead,
    IPersistence,
} from "@rocket.chat/apps-engine/definition/accessors";
import { App } from "@rocket.chat/apps-engine/definition/App";
import { createLikeModal } from '../lib/createLikeModal';
import { getTokenLikeServer ,getLogLikeServer, getRemainingLikeServer } from '../apiClient/rocketApiClient';
import { initiatorNotifierMessage } from '../lib/initiatorMessage';

export class LikeCommand implements ISlashCommand {

    public command = "like";
    public i18nDescription = "Создать лайк пользователю.";
    public i18nParamsExample = "";
    public providesPreview = false;

    constructor(private readonly app: App) {}

    public async executor(
        context: SlashCommandContext,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persistence: IPersistence
    ): Promise<void> {
        const sender = context.getSender();
        const room = context.getRoom();

        const data = {
            room: room,
            sender: sender,
        };

        const triggerId = context.getTriggerId();

        if (triggerId) {
            const modal = await createLikeModal({ persistence: persistence, data, modify, http });

            await modify.getUiController().openModalView(modal, { triggerId }, context.getSender());
        }
    }
}

export class LikeLogCommand implements ISlashCommand {

    public command = "like_log";
    public i18nDescription = "Отобразить лог.";
    public i18nParamsExample = "";
    public providesPreview = false;

    constructor(private readonly app: App) {}

    public async executor(
        context: SlashCommandContext,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persistence: IPersistence
    ): Promise<void> {
        const sender = context.getSender();
        const room = context.getRoom();

        const data = {
            room: room,
            sender: sender,
        };

        const authToken = await getTokenLikeServer(http);
        const logLike: { [key: string] : string; } = await getLogLikeServer(http, authToken.access, data.sender.id);
        const logLikeObject = Object.keys(logLike);
        const message = logLike[logLikeObject[0]];

        await initiatorNotifierMessage({data, modify, message});
    }
}

export class LikeRemainingCommand implements ISlashCommand {

    public command = "like_remaining";
    public i18nDescription = "Отобразить лог.";
    public i18nParamsExample = "";
    public providesPreview = false;

    constructor(private readonly app: App) {}

    public async executor(
        context: SlashCommandContext,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persistence: IPersistence
    ): Promise<void> {
        const sender = context.getSender();
        const room = context.getRoom();

        const data = {
            room: room,
            sender: sender,
        };

        const authToken = await getTokenLikeServer(http);
        const remainingLike: { [key: string] : string; } = await getRemainingLikeServer(http, authToken.access, data.sender.id);
        const remainingLikeObject = Object.keys(remainingLike);
        const message = remainingLike[remainingLikeObject[0]];

        await initiatorNotifierMessage({data, modify, message});
    }
}