package net.wesjd.biotech;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.inject.AbstractModule;
import com.google.inject.Guice;
import com.google.inject.Injector;
import net.wesjd.biotech.endpoints.EndpointLogin;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jline.reader.LineReader;
import org.jline.reader.LineReaderBuilder;
import org.jline.terminal.TerminalBuilder;

import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.Writer;

import static java.lang.System.currentTimeMillis;
import static spark.Spark.*;

public class TemplateEngine {

    private long initializationTime = currentTimeMillis();
    private Logger logger = LogManager.getLogger();
    private Gson gson = new GsonBuilder()
            .setPrettyPrinting()
            .create();
    private Injector injector = Guice.createInjector(
            new AbstractModule() {
                @Override
                protected void configure() {
                    bind(TemplateEngine.class).toInstance(TemplateEngine.this);
                }
            }
    );
    private Configuration configuration;

    private TemplateEngine() {
        try {
            logger.info("Loading...");

            //config
            File configFile = new File("config.json");
            if(!configFile.exists()) {
                logger.info("Config doesn't exist... creating default.");
                if(!configFile.createNewFile()) throw new Exception("Couldn't create config file!");
                try(Writer writer = new FileWriter(configFile)) {
                    gson.toJson(configuration = new Configuration(), writer);
                }
            } else configuration = gson.fromJson(new FileReader(configFile), Configuration.class);

            //spark
            staticFileLocation("/frontend");
            port(configuration.getPort());

            new EndpointLogin();

            logger.info("Server started on port " + configuration.getPort() + " in " + (currentTimeMillis() - initializationTime) + "ms.");

            LineReader reader = LineReaderBuilder.builder()
                    .terminal(TerminalBuilder.terminal())
                    .build();
            lock: while(true) {
                String input = reader.readLine(configuration.getConsolePrompt() + " ");
                switch(input.toLowerCase()) {
                    case "stop":
                    case "exit":
                        stop();
                        logger.info("Goodbye...");
                        break lock;
                    default:
                        logger.warn("Invalid command.");
                        break;
                }
            }
        } catch (Exception ex) {
            logger.error("Boot error!");
            ex.printStackTrace();
        }
    }

    public Injector getInjector() {
        return injector;
    }

    public Gson getGson() {
        return gson;
    }

    public Configuration getConfiguration() {
        return configuration;
    }

    public static void main(String[] args) {
        new TemplateEngine();
    }

}
