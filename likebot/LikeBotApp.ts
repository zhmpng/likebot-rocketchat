import {
    IAppAccessors,
    ILogger, 
    IHttp, 
    IModify, 
    IPersistence, 
    IRead,
    IConfigurationExtend,
} from '@rocket.chat/apps-engine/definition/accessors';
import {
    UIKitViewSubmitInteractionContext,
} from '@rocket.chat/apps-engine/definition/uikit';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
//--------------------------------------------------------
import { initiatorMessage } from './lib/initiatorMessage';
import { LikeCommand, LikeLogCommand, LikeRemainingCommand } from './command/likeCommand';
import { getTokenLikeServer ,takeLikeServer } from './apiClient/rocketApiClient';
import { ILikeRequest, ILike } from './lib/definition';

export class LikeBotApp extends App {
    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
    }
    public async executeViewSubmitHandler(context: UIKitViewSubmitInteractionContext, read: IRead, http: IHttp, persistence: IPersistence, modify: IModify) {
       
        
        const data = context.getInteractionData();

        try{
            const { state }: {
                state: {
                    likeBlock: {
                        likeString: string,
                        whoLiked: string,
                        whyLiked: string,
                    }
                },
            } = data.view as any;

            const whoLikedData =  await read.getUserReader().getById(state.likeBlock.whoLiked);
            const like: ILikeRequest = {
                from_user: {id: data.user.id},
                to_user: {id: state.likeBlock.whoLiked},
                reason: state.likeBlock.whyLiked,
                clarification: state.likeBlock.likeString
            };


            if (!state) {
                return {
                    success: false,
                    errString: 'Error creating like',
                };
            }

            const authToken = await getTokenLikeServer(http);
            const newLike: { [key: string] : string; } = await takeLikeServer(http, authToken.access, like);
            let message: string = '';
            let chanel: IRoom | undefined = undefined;
            let newLikeObject: string[] = [];
            try {
                newLikeObject = Object.keys(newLike);

                chanel = await read.getRoomReader().getByName(`${newLikeObject[0].substr(1)}`);
                message = newLike[newLikeObject[0]];
                await initiatorMessage( {modify, chanel, message});
                
                return {
                    success: true,
                    user: data.user,
                    chanel,
                    newLike,
                    message,
                    newLikeObject
                };
            } catch (err) {
                return {
                    success: false,
                    errString: 'try catch create like message',
                    err,
                    chanel,
                    newLike,
                    message,
                    newLikeObject

                };
            }

        }
        catch(err)
        {
            return {
                success: false,
                errString: 'error in executeViewSubmitHandler',
                err
            };
        }
    }
    
    protected async extendConfiguration(
        configuration: IConfigurationExtend
    ): Promise<void> {
        await configuration.slashCommands.provideSlashCommand(
            new LikeCommand(this)
        );
        await configuration.slashCommands.provideSlashCommand(
            new LikeLogCommand(this)
        );
        await configuration.slashCommands.provideSlashCommand(
            new LikeRemainingCommand(this)
        );
    }
}
