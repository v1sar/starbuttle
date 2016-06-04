package websocket;

import db.UserDataSet;
import main.AccountService;
import mechanic.GameMechanic;
import org.eclipse.jetty.server.Response;
import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketClose;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketConnect;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketMessage;
import org.eclipse.jetty.websocket.api.annotations.WebSocket;
import org.json.JSONObject;

import java.io.IOException;

/**
 * Created by qwerty on 24.05.16.
 */
@WebSocket
public class GameWebSocket {
    private final GameMechanic gameMechanic;
    private AccountService accountService;
    private final String sessionId;
    private String username;
    private Session currentSession;

    GameWebSocket(String sessionId, AccountService accountService, GameMechanic gameMechanic) {
        this.accountService = accountService;
        this.gameMechanic = gameMechanic;
        this.sessionId = sessionId;
    }

    @SuppressWarnings("unused")
    @OnWebSocketMessage
    public void onMessage(Session session, String text) {
        if (username == null) return;
        gameMechanic.onMessage(username, text);
    }

    @SuppressWarnings("unused")
    @OnWebSocketConnect
    public void onConnect(Session session) {
        currentSession = session;
        final UserDataSet user = accountService.giveProfileFromSessionId(sessionId);
        if (user == null) {
            session.close(Response.SC_FORBIDDEN, "Your access to this resource is denied");
            return;
        }
        username = user.getLogin();
        if (gameMechanic.isRegistered(username)) {
            session.close(Response.SC_FORBIDDEN, "You has already opened session connected to this resource");
            return;
        }
        gameMechanic.registerUser(username, this);
    }

    @SuppressWarnings("unused")
    @OnWebSocketClose
    public void onDisconnect(int statusCode, String reason) {
        System.out.println("User disconnected with code " + statusCode + " by reason: " + reason);
        if (username != null)
            gameMechanic.disconnectUser(username);
    }

    public void sendMessage(String message) {
        try {
            currentSession.getRemote().sendString(message);
        } catch (IOException e) {
            System.out.println("WebSocket error: " + e.getMessage());
        }
    }

    public void disconnect() {
        currentSession.close();
    }

}