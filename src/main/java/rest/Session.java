package rest;

import db.UserDataSet;
import main.AccountService;
import org.json.JSONObject;

import javax.inject.Inject;
import javax.inject.Singleton;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;


/**
 * @author iu6team
 */

@Singleton
@Path("/session")
public class Session {
    @SuppressWarnings("unused")
    @Inject
    private main.Context context;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response checkAuth(@Context HttpServletRequest request) {
        final AccountService accountService = context.get(AccountService.class);
        final String sessionId = request.getSession().getId();
        if (accountService.checkAuth(sessionId)) {
            final UserDataSet userTemp = accountService.giveProfileFromSessionId(sessionId);
            if (accountService.isExists(userTemp)) {
                final long temp = accountService.getUserByLogin(userTemp.getLogin()).getId();
                return Response.status(Response.Status.OK).entity(getIdByJson(temp)).build();
            }
        }
        return Response.status(Response.Status.UNAUTHORIZED).build();
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response loginUser(UserDataSet user, @Context HttpHeaders headers, @Context HttpServletRequest request) {
        final AccountService accountService = context.get(AccountService.class);
        if (accountService.isExists(user)) {
            if (user.getPassword().equals(accountService.getUserByLogin(user.getLogin()).getPassword())) {
                final String sessionId = request.getSession().getId();
                accountService.addSession(sessionId, user);
                return Response.status(Response.Status.OK).entity(getIdByJson(accountService.getUserByLogin(user.getLogin()).getId())).build();
            }
        }
        return Response.status(Response.Status.BAD_REQUEST).build();
    }

    @DELETE
    @Produces(MediaType.APPLICATION_JSON)
    public Response logOut(@Context HttpServletRequest request){
        final AccountService accountService = context.get(AccountService.class);
        final String sessionId = request.getSession().getId();
        accountService.deleteSession(sessionId);
        return Response.status(Response.Status.OK).build();
    }

    public String getIdByJson(long id) {
        final JSONObject jsonObject = new JSONObject();
        jsonObject.put("id", id);
        return jsonObject.toString();
    }
}
