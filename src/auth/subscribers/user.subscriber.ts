import { DataSource, EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from "typeorm";
import { User } from "../entities/user.entity";
import * as argon2 from 'argon2';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
    constructor(
        dataSource: DataSource,
    ) {
        dataSource.subscribers.push(this);
    }

    public listenTo(): typeof User {
        return User;
    }

    public async beforeInsert(event: InsertEvent<User>): Promise<void> {
        event.entity.password = await argon2.hash(event.entity.password);
    }

    public async beforeUpdate(event: UpdateEvent<User>): Promise<void> {
        if(event.entity?.password) {
            event.entity.password = await argon2.hash(event.entity.password);
        }
    }
}