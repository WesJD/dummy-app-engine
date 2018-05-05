package net.wesjd.biotech.endpoints;

import static spark.Spark.*;

public class EndpointLogout {

    public EndpointLogout() {
        post("logout", (request, result) -> {
            return "not implemented";
        });
    }

}
