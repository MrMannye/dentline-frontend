const ClinicaDental = artifacts.require("MyContract");

module.exports = function (deployer) {
	deployer.deploy(ClinicaDental);
};
