/*
*   Export the two prototype functions like prepareResponse and verifyGoogle.
*   prepareResponse used into the router callback function to send the response with status, data and message
*   verifyGoogle help to capture the callback response from the google. Its used with passportjs.
*/
module.exports = {
    prepareResponse: function (status, data, message) {
        serviceResponse = {};
        // Response handling
        serviceResponse = {
            status: status,
            data: data || [],
            message: message
        };
        return serviceResponse;
    },
    verifyGoogle: function(req, accessToken, refreshToken, params, profile, done) {
        var user = {};
        var state = req.query.state;
        var parts = state.split('|');
        var sessionID = parts[0];
        var csrfToken = parts[1];
        user.sessionID      = sessionID;
        user.csrfToken      = csrfToken;
        user.providerName   = profile.provider;
        user.displayName    = profile.displayName;
        user.email          = profile.emails[0].value;
        user.photo          = profile.photos;
        user.accessToken    = accessToken;
        done(null, user);
    }
}
