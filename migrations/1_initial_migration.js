const ClinicaDental = artifacts.require("ClinicaDental");

module.exports = function (deployer) {
  deployer.deploy(ClinicaDental);
};
