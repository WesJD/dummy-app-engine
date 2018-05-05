package net.wesjd.biotech.endpoints;

import static spark.Spark.*;

public class EndpointLogin {

    public EndpointLogin() {
        path("/login", () -> {
            get("", (request, response) -> {
                response.redirect("https://google.com");
                return "Redirecting...";
            });
            get("/complete", (request, response) -> {
                return "Hey there!";
            });
        });
    }

}
