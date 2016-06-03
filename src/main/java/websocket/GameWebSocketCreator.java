package websocket;

import main.AccountService;
import mechanic.GameMechanic;
import org.eclipse.jetty.websocket.servlet.ServletUpgradeRequest;
import org.eclipse.jetty.websocket.servlet.ServletUpgradeResponse;
import org.eclipse.jetty.websocket.servlet.WebSocketCreator;
import org.jetbrains.annotations.Nullable;
import javax.servlet.http.HttpSession;

/**
 * Created by qwerty on 24.05.16.
 */
public class GameWebSocketCreator implements WebSocketCreator {
    private AccountService accountService;
    private final GameMechanic gameMechanic;

    GameWebSocketCreator(AccountService accountService, GameMechanic gameMechanic) {
        this.accountService = accountService;
        this.gameMechanic = gameMechanic;
    }

    @Nullable
    @Override
    public GameWebSocket createWebSocket(ServletUpgradeRequest servletUpgradeRequest,
                                         ServletUpgradeResponse servletUpgradeResponse) {
        final HttpSession session = servletUpgradeRequest.getSession();

        if (session == null) {
            return null;
        }
        final String sessionId = session.getId();

        return new GameWebSocket(sessionId, accountService, gameMechanic);
    }
}
