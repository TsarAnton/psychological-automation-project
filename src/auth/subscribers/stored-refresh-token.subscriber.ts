import { DataSource, EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from "typeorm";
import { StoredRefreshToken } from "../entities/user.entity";
import * as argon2 from 'argon2';

@EventSubscriber()
export class StoredRefreshTokenSubscriber implements EntitySubscriberInterface<StoredRefreshToken> {
    constructor(
        dataSource: DataSource,
    ) {
        dataSource.subscribers.push(this);
    }

    public listenTo(): typeof StoredRefreshToken {
        return StoredRefreshToken;
    }

    public async beforeInsert(event: InsertEvent<StoredRefreshToken>): Promise<void> {
        event.entity.refreshToken = await argon2.hash(event.entity.refreshToken);
    }

    public async beforeUpdate(event: UpdateEvent<StoredRefreshToken>): Promise<void> {
        if(event.entity?.refreshToken) {
            event.entity.refreshToken = await argon2.hash(event.entity.refreshToken);
        }
    }
}