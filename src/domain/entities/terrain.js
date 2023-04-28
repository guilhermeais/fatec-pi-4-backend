import { Location } from "../value-objects/location";
import { BaseEntity } from "./base-entity";

export class Terrain extends BaseEntity {
    constructor({
        name, locations = [], userId, ...params
    }) {
        super(params);

        this.name = name;
        this.locations = locations.map(location => new Location(location));
        this.userId = userId;
    }
}