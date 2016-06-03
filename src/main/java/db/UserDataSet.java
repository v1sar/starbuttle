package db;
import org.jetbrains.annotations.NotNull;

import javax.persistence.*;
import java.io.Serializable;

/**
 * author iu6team
 */
@SuppressWarnings("EqualsAndHashcode")
@Entity
@Table(name = "Users")
public class UserDataSet implements Serializable {
    @SuppressWarnings("unused")
    private static final long serialVersionUID = -8706689714326132798L;

    @SuppressWarnings("InstanceVariableNamingConvention")
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "login")
    private String login;

    @Column(name="password")
    private String password;

    @Column(name="email")
    private String email;

    @NotNull
    public String getLogin() {
        return login;
    }

    public void setLogin(@NotNull String login) {
        this.login = login;
    }

    @NotNull
    public String getPassword() {
        return password;
    }

    public void setPassword(@NotNull String password) {
        this.password = password;
    }

    public long getId() { return id; }

    public void setId(long id) { this.id = id; }

    @NotNull
    public String getEmail() { return email; }

    public void setEmail(@NotNull String email) { this.email = email; }

    @Override
    public boolean equals(Object object) {
        if (object == null) return false;
        if (this.getClass() != object.getClass()) return false;
        final UserDataSet userTemp = (UserDataSet) object;
        //noinspection OverlyComplexBooleanExpression
        return ((this.id == userTemp.id) && (this.login.equals(userTemp.login)) && (this.email.equals(userTemp.email))
                && (this.password.equals(userTemp.password)));
    }
}