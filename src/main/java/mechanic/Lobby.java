package mechanic;

import org.jetbrains.annotations.Nullable;

/**
 * Created by qwerty on 24.05.16.
 */
public class Lobby {
    private final GameUser firstUser;
    private GameUser secondUser;


    public Lobby(GameUser firstUser){
        this.firstUser = firstUser;

    }

    public GameUser getFirstUser() {
        return firstUser;
    }

    public void setSecondUser(GameUser secondUser) {
        this.secondUser = secondUser;
    }

    public GameUser getSecondUser() {
        return secondUser;
    }

    @Nullable
    public GameUser getUserbyName(String username) {
        if (username.equals(firstUser.getUsername()))
            return firstUser;
        else if (username.equals(secondUser.getUsername()))
            return secondUser;
        else
            return null;
    }

}
