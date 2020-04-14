const request = require('request');

var geocodeAddress = (address, callback) => {
    var encodedAddress = encodeURIComponent(address);

    request({
        url: `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=pk.eyJ1IjoiZmFrZXIwNjI1IiwiYSI6ImNrN2hqa29lNjA2bzIzZ3BydGM1bXZyMnUifQ.96Z4FhTkVFCd6Xid797qmg`,
        json: true
    }, (error,response,body) => {
        if(error) {
            callback('Unable to connect to mapbox API ')
        } else if(body.features.length === 0) {
           callback('Unable to find location ');
        } else {
            callback(undefined, {
                address: body.features[0].place_name,
                latitude: body.features[0].center[1],
                longitude: body.features[0].center[0]
            });
        }
    });
};

module.exports.geocodeAddress = geocodeAddress;