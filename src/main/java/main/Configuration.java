package main;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

/**
 * Created by qwerty on 26.05.16.
 */
public class Configuration {
    int port;
    String dbHost;
    int dbPort;
    String dbUsername;
    String dbPassword;
    String dbName;

    @SuppressWarnings("OverlyBroadThrowsClause")
    public Configuration(String filename) throws IOException, NumberFormatException {
        final Properties properties = new Properties();
        try (final FileInputStream fis = new FileInputStream(filename)) {
            properties.load(fis);
        }
        port = Integer.valueOf(properties.getProperty("port"));
        dbHost = properties.getProperty("db_host");
        dbPort = Integer.valueOf(properties.getProperty("db_port"));
        dbUsername = properties.getProperty("db_username");
        dbPassword = properties.getProperty("db_password");
        dbName = properties.getProperty("db_name");
    }

    public int getPort() {
        return port;
    }

    public String getDbHost() {
        return dbHost;
    }

    public int getDbPort() {
        return dbPort;
    }

    public String getDbUsername() {
        return dbUsername;
    }

    public String getDbPassword() {
        return dbPassword;
    }

    public String getDbName() {
        return dbName;
    }
}
