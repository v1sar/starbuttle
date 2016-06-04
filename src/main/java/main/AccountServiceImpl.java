package main;

import db.UserDataSet;
import db.UserDataSetDAO;
import org.hibernate.HibernateException;
import org.jetbrains.annotations.NotNull;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.cfg.Configuration;
import org.hibernate.service.ServiceRegistry;
import org.json.JSONObject;

/**
 * @author iu6team
 */
public class AccountServiceImpl implements AccountService {
    private final Map<String, UserDataSet> sessions = new ConcurrentHashMap<>();
    private final SessionFactory sessionFactory;

    public AccountServiceImpl(String name, String host, int port, String username, String password) {
        final Configuration configuration = new Configuration();
        configuration.addAnnotatedClass(UserDataSet.class);
        configuration.setProperty("hibernate.dialect", "org.hibernate.dialect.MySQLDialect");
        configuration.setProperty("hibernate.connection.driver_class", "com.mysql.jdbc.Driver");
        configuration.setProperty("hibernate.connection.url", "jdbc:mysql://"+host+':'+port+'/'+name);
        configuration.setProperty("hibernate.connection.username", username);
        configuration.setProperty("hibernate.connection.password", password);
        configuration.setProperty("hibernate.show_sql", "true");
        configuration.setProperty("hibernate.hbm2ddl.auto", "create");
        sessionFactory = createSessionFactory(configuration);
    }

    @Override
    public List<UserDataSet> getAllUsers() {
        try (Session session = sessionFactory.openSession()) {
            final UserDataSetDAO dao = new UserDataSetDAO(session);
            return dao.getAllUsers();
        }
    }

    @Override
    public boolean addUser(UserDataSet userProfile) {
        try (Session session = sessionFactory.openSession()) {
            final UserDataSetDAO dao = new UserDataSetDAO(session);
            if (dao.getUserByLogin(userProfile.getLogin()) != null || dao.getUserByEmail(userProfile.getEmail()) != null) {
                return false;
            } else {
                dao.addUser(userProfile);
                return true;
            }
        }
    }

    @Override
    public UserDataSet getUser(long id) {
        try (Session session = sessionFactory.openSession()) {
            final UserDataSetDAO dao = new UserDataSetDAO(session);
            return dao.getUser(id);
        }
    }
    @Override
    public UserDataSet getUserByLogin(String login) {
        try (Session session = sessionFactory.openSession()) {
            final UserDataSetDAO dao = new UserDataSetDAO(session);
            return dao.getUserByLogin(login);
        }
    }

    @Override
    public void editUser(long id, UserDataSet user, String sessionId){
        try (Session session = sessionFactory.openSession()) {
            final UserDataSetDAO dao = new UserDataSetDAO(session);
            dao.editUser(user, id);
            sessions.replace(sessionId, user);
        }
    }

    @Override
    public void deleteSession(String sessionId){
        if(checkAuth(sessionId)) {
            sessions.remove(sessionId);
        }
    }

    @Override
    public boolean isExists(@NotNull UserDataSet user) {
        try (Session session = sessionFactory.openSession()) {
            final UserDataSetDAO dao = new UserDataSetDAO(session);
            return (dao.getUserByLogin(user.getLogin()) != null);
        }
    }

    @Override
    public void addSession(String sessionId, UserDataSet user) {
        sessions.put(sessionId, user);
    }
    @Override
    public boolean checkAuth(String sessionId) {
        return sessions.containsKey(sessionId);
    }
    @Override
    public UserDataSet giveProfileFromSessionId(String sessionId){
        return sessions.get(sessionId);
    }

    @Override
    public void deleteUser(long id) {
        try (Session session = sessionFactory.openSession()) {
            final UserDataSetDAO dao = new UserDataSetDAO(session);
            dao.deleteUser(id);
        }
    }

    @Override
    public String getIdAndAvatar(long id, String avatar) {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("id", id);
        jsonObject.put("avatar", avatar);
        return jsonObject.toString();
    }

    public Map<String, UserDataSet> getSessions() { return sessions; }

    private static SessionFactory createSessionFactory(Configuration configuration) {
        final StandardServiceRegistryBuilder builder = new StandardServiceRegistryBuilder();
        builder.applySettings(configuration.getProperties());
        try {
            final ServiceRegistry serviceRegistry = builder.build();
            return configuration.buildSessionFactory(serviceRegistry);
        } catch(HibernateException e) {
            System.err.println("Can't connect to MySQL " + e);
            System.exit(1);
            throw e;
        }
    }
}
