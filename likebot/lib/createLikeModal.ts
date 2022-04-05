import { IHttp, IModify, IPersistence } from '@rocket.chat/apps-engine/definition/accessors';
import { RocketChatAssociationModel, RocketChatAssociationRecord } from '@rocket.chat/apps-engine/definition/metadata';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { IUIKitModalViewParam } from '@rocket.chat/apps-engine/definition/uikit/UIKitInteractionResponder';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { IOptionObject, ITextObject } from '@rocket.chat/apps-engine/definition/uikit';
import { IRocketUserList, IRocketUser, IRocketEmail, Role, Status } from '../lib/definition';
import { getRocketUserList, getTokenLikeServer, getReasonLikeServer } from '../apiClient/rocketApiClient';

import { uuid } from './uuid';
export interface IDataSender {
    room: IRoom;
    sender: IUser;
}

export async function createLikeModal({  id = '',persistence, data, modify, http }: {
    id?: string,
    persistence: IPersistence,
    data: IDataSender,
    modify: IModify,
    http: IHttp,
}): Promise<IUIKitModalViewParam> {

    const viewId = id || uuid();
    const association = new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, viewId);
    await persistence.createWithAssociation(data, association);

    const block = modify.getCreator().getBlockBuilder();
    block.addInputBlock({
        blockId: 'likeBlock',
        element: block.newPlainTextInputElement({ initialValue: '', actionId: 'likeString' }),
        label: block.newPlainTextObject('Благодарю тебя за:'),
    })
    .addDividerBlock();

    const userList = getRocketUserList(http);
    var myInstance:IOptionObject[] = [];
    (await userList).users
        .filter(user => user.roles.includes(Role.User))
        .filter(user => !user.roles.includes(Role.Bot))
        .filter(user => !user.roles.includes(Role.App))
        .forEach(user => {
            myInstance.push(
                {
                    text: block.newPlainTextObject(user.name),
                    value: user._id
                }
            )
        }
    );

    const authToken = await getTokenLikeServer(http);
    const reasons = await getReasonLikeServer(http, authToken.access);
    var myReasons:IOptionObject[] = [];
    Object.keys(reasons).forEach(key=> {
        myReasons.push(
            {
                text: block.newPlainTextObject(reasons[key]),
                value: key
            }
        )
    });
    
    block.addActionsBlock({
        blockId: 'likeBlock',
        elements: [
            block.newStaticSelectElement({
                placeholder: block.newPlainTextObject('Выбери за что лайк (ﾉ´ з `)ノ'),
                actionId: 'whyLiked',
                initialValue: '',
                options: myReasons,
            })
        ],
    });

    block.addActionsBlock({
        blockId: 'likeBlock',
        elements: [
            block.newStaticSelectElement({
                placeholder: block.newPlainTextObject('Кому поставить лайк?'),
                actionId: 'whoLiked',
                initialValue: '',
                options: myInstance,
            })
        ],
    });

    return {
        id: viewId,
        title: block.newPlainTextObject('Сейчас мы кого то лайкнем'),
        submit: block.newButtonElement({
            text: block.newPlainTextObject('Лайкнуть'),
        }),
        close: block.newButtonElement({
            text: block.newPlainTextObject('Забить'),
        }),
        blocks: block.getBlocks(),
    };
}