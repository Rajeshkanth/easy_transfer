import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "http://localhost:8080/",
  realm: "easy_transfer_realm",
  clientId: "et-login",
});

export default keycloak;
