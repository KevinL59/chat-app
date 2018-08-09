var env = process.env.NODE_ENV || "development";

if (env === "development" || env === "test"){
    var config = require("./config.json");
    var envConfig = config[env];

    // Return array of all the keys of the object
    Object.keys(envConfig).forEach((key) => {
        process.env[key] = envConfig[key];
    });
}