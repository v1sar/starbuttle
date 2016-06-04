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
            data.put("command", "START");
            userToSocket.get(vacantLobby.getFirstUser().getUsername()).sendMessage(data.toString());
            userToSocket.get(vacantLobby.getSecondUser().getUsername()).sendMessage(data.toString());
            vacantLobby = null;
        }
    }

    public void onMessage(String username, String message) {
        final Lobby lobby = userToLobby.get(username);
        final JSONObject data = new JSONObject(message);
        if (data.has("signal")) {
            data.getString("signal");
            sendShot(lobby, username);
            return;
        }
        sendPosition(lobby, username, data);
//        System.out.print(username);
//        System.out.print(message);
    }

    public void sendPosition(Lobby lobby, String username,  JSONObject data) {
        final int HP = data.getInt("health");
        if (HP<0) {
            sendGameOver(lobby, username);
        }
        if (lobby.getFirstUser().getUsername() == username) {
            userToSocket.get(lobby.getSecondUser().getUsername()).sendMessage(data.toString());
        } else {
            userToSocket.get(lobby.getFirstUser().getUsername()).sendMessage(data.toString());
        }
    }

    public void sendShot(Lobby lobby, String username) {
        final JSONObject shot = new JSONObject();
        shot.put("command","ENEMY_SHOT");
        if (lobby.getFirstUser().getUsername() == username) {
            userToSocket.get(lobby.getSecondUser().getUsername()).sendMessage(shot.toString());
        } else {
            userToSocket.get(lobby.getFirstUser().getUsername()).sendMessage(shot.toString());

        }
    }

    public void sendGameOver(Lobby lobby, String username) {
        final JSONObject win = new JSONObject();
        final JSONObject lose = new JSONObject();
        win.put("command","WIN");
        lose.put("command","LOSE");
        if (lobby.getFirstUser().getUsername() == username) {
            userToSocket.get(lobby.getSecondUser().getUsername()).sendMessage(win.toString());
            userToSocket.get(lobby.getFirstUser().getUsername()).sendMessage(lose.toString());
        } else {
            userToSocket.get(lobby.getSecondUser().getUsername()).sendMessage(lose.toString());
            userToSocket.get(lobby.getFirstUser().getUsername()).sendMessage(win.toString());
        }
        unregisterUser(lobby.getSecondUser().getUsername());
        unregisterUser(lobby.getFirstUser().getUsername());
    }

    public void unregisterUser(String userName) {
        userToSocket.remove(userName);
        userToLobby.remove(userName);
        if (vacantLobby.getUserbyName(userName) != null)
            vacantLobby = null;
    }

    public boolean isRegistered(String username) {
        return userToSocket.containsKey(username);
    }

    public void disconnectUser(String userName) {
        Lobby lobby = userToLobby.get(userName);
        final JSONObject win = new JSONObject();
        win.put("command", "WIN");
        if (lobby.getFirstUser() != null) {
            if (lobby.getFirstUser().getUsername() == userName) {
                userToSocket.get(lobby.getSecondUser().getUsername()).sendMessage(win.toString());
            }
        }
        if (lobby.getSecondUser() != null) {
            if (lobby.getSecondUser().getUsername() == userName) {
                userToSocket.get(lobby.getFirstUser().getUsername()).sendMessage(win.toString());
            }
        }
        userToSocket.remove(userName);
        userToLobby.remove(userName);
        if (vacantLobby.getUserbyName(userName) != null)
            vacantLobby = null;
    }
}
