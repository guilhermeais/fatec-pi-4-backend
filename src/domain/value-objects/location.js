import { InvalidLocation } from '../../application/errors';

export class Location {
    constructor({
        longitude, latitude
    }) {
        this.longitude = longitude;
        this.latitude = latitude;
    }

    static create({longitude, latitude}) {
        if (!longitude) {
            throw new InvalidLocation('Longitude não informada.')
        }

        if (!latitude) {
            throw new InvalidLocation('Latitude não informada.')
        }


        return new Location({
            longitude, latitude
        });
    }
}