package websocket;

import main.AccountService;
import mechanic.GameMechanic;
import org.eclipse.jetty.websocket.servlet.WebSocketServlet;
import org.eclipse.jetty.websocket.servlet.WebSocketServletFactory;
import javax.servlet.annotation.WebServlet;


/**
 * Created by qwerty on 24.05.16.
 */
@WebServlet(name = "GameWebSocketServlet", urlPatterns = {"/game"})
public class GameWebSocketServlet extends WebSocketServlet {
    private AccountService accountService;
    private final GameMechanic gameMechanic;

    public GameWebSocketServlet(AccountService accountService, GameMechanic gameMechanic) {
        this.accountService = accountService;
        this.gameMechanic = gameMechanic;
    }

    @Override
    public void configure(WebSocketServletFactory factory) {
        factory.setCreator(new GameWebSocketCreator(accountService, gameMechanic));
    }
}
