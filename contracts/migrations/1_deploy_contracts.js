const UserFileStorage = artifacts.require("UserFileStorage");

module.exports = function (deployer) {
    deployer.deploy(UserFileStorage);
};
