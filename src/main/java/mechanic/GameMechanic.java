package mechanic;

import org.json.JSONObject;
import websocket.GameWebSocket;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Created by qwerty on 24.05.16.
 */
public class GameMechanic {

    private final Map<String, Lobby> userToLobby = new ConcurrentHashMap<>();
    private final Map<String, GameWebSocket> userToSocket = new ConcurrentHashMap<>();
    Lobby vacantLobby;

    public void registerUser(String userName, GameWebSocket gameWebSocket) {
        userToSocket.put(userName, gameWebSocket);
        if (vacantLobby == null) {
            vacantLobby = new Lobby(new GameUser(userName));
        } else {
            vacantLobby.setSecondUser(new GameUser(userName));
            userToLobby.put(vacantLobby.getFirstUser().getUsername(), vacantLobby);
            userToLobby.put(vacantLobby.getSecondUser().getUsername(), vacantLobby);
            JSONObject data = new JSONObject();
            data.put("start",true);
            userToSocket.get(vacantLobby.getFirstUser().getUsername()).sendMessage(data.toString());
            userToSocket.get(vacantLobby.getSecondUser().getUsername()).sendMessage(data.toString());
            vacantLobby = null;
        }
    }

    public void onMessage(String username, String message) {
        final Lobby lobby = userToLobby.get(username);
        final JSONObject data = new JSONObject(message);
        sendPosition(lobby, username, data);
//        System.out.print(username);
//        System.out.print(message);
    }

    public void sendPosition(Lobby lobby, String username,  JSONObject data) {
        if (lobby.getFirstUser().getUsername() == username) {
            userToSocket.get(lobby.getSecondUser().getUsername()).sendMessage(data.toString());
        } else {
            userToSocket.get(lobby.getFirstUser().getUsername()).sendMessage(data.toString());
        }
    }

}
