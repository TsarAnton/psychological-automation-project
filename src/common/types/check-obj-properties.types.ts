export function isPropertiesDefined(object: Object): boolean {
    for(let prop in object) {
        if(prop !== undefined) {
            return true;
        }
    }
    return false;
}