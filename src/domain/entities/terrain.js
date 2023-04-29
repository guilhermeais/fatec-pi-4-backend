import { Location } from "../value-objects/location";
import { BaseEntity } from "./base-entity";

export class Terrain extends BaseEntity {
    constructor({
        name, locations = [], ownerId, ...params
    }) {
        super(params);

        this.name = name;
        this.locations = locations.map(location => new Location(location));
        this.ownerId = ownerId;
    }

    static create({
        name, locations = [], ownerId, ...params
    }) {
        return new Terrain({
            name, locations, ownerId, ...params
        });
    }
}