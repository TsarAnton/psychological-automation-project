import { DataSource, EntitySubscriberInterface, EventSubscriber, LoadEvent } from "typeorm";
import { Result } from "../entities/result.entity";

@EventSubscriber()
export class ResultSubscriber implements EntitySubscriberInterface<Result> {
    constructor(
        dataSource: DataSource,
    ) {
        dataSource.subscribers.push(this);
    }

    public listenTo(): typeof Result {
        return Result;
    }

    //remove student from result entity if result is anonymous
    public afterLoad(entity: Result, event?: LoadEvent<Result>): Promise<any> | void {
        if(entity.isAnonymous) {
            entity.student = null;
        }
    }
}