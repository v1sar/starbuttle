package rest;

import db.UserDataSet;
import main.AccountService;
import org.json.JSONObject;

import javax.inject.Inject;
import javax.inject.Singleton;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.Collection;
import sun.misc.BASE64Decoder;
import javax.imageio.ImageIO;
import java.util.Base64;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
/**
 * @author iu6team
 */
@Singleton
@Path("/user")
public class Users {
    private static final String DEFAULT_AVATAR = "default-avatar.png";
    @SuppressWarnings("unused")
    @Inject
    private main.Context context;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllUsers() {
        final AccountService accountService = context.get(AccountService.class);
        final Collection<UserDataSet> allUsers = accountService.getAllUsers();
        return Response.status(Response.Status.OK).entity(allUsers.toArray(new UserDataSet[allUsers.size()])).build();
    }

    @GET
    @Path("{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUserById(@PathParam("id") long id, @Context HttpServletRequest request) {
        final AccountService accountService = context.get(AccountService.class);
        final String sessionId = request.getSession().getId();
        if (accountService.checkAuth(sessionId)) {
            final UserDataSet userTemp = accountService.getUser(id);
            if (userTemp == null) {
                return Response.status(Response.Status.FORBIDDEN).build();
            } else {
                return Response.status(Response.Status.OK).entity(toJson(userTemp)).build();
            }
        } else {
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }
    }

    public static BufferedImage decodeToImage(String imageString) {
        BufferedImage image = null;
        byte[] imageByte;
        try {
            BASE64Decoder decoder = new BASE64Decoder();
            imageByte = decoder.decodeBuffer(imageString);
            ByteArrayInputStream bis = new ByteArrayInputStream(imageByte);
            image = ImageIO.read(bis);
            bis.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return image;
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createUser(UserDataSet user) {
        final AccountService accountService = context.get(AccountService.class);
        if (accountService.getUserByLogin(user.getLogin()) == null) {
            String uAvatar = user.getAvatar();
            if (uAvatar == null) {
                user.setAvatar("/images/" + DEFAULT_AVATAR);
            }
            else {
                BufferedImage newImg;
                String[] temp = uAvatar.split(",");
                newImg = decodeToImage(temp[1]);
                String dest = "/uploads/" + user.getLogin().toString() + ".jpg";
                try {
                    ImageIO.write(newImg, "jpeg", new File("public_html" + dest));
                    user.setAvatar(dest);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

            accountService.addUser(user);
            return Response.status(Response.Status.OK).entity(accountService.getIdAndAvatar(user.getId(), user.getAvatar())).build();
        }

        return Response.status(Response.Status.FORBIDDEN).build();
    }


    @PUT
    @Path("{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response editUser(@PathParam("id") long id, UserDataSet user, @Context HttpServletRequest request) {
        final AccountService accountService = context.get(AccountService.class);
        final String sessionId = request.getSession().getId();
        final UserDataSet userTemp = accountService.getUserByLogin(accountService.giveProfileFromSessionId(sessionId).getLogin());
        if ((user != null) && (userTemp.getId() == accountService.getUser(id).getId())) {
            accountService.editUser(id, user, sessionId);
            return Response.status(Response.Status.OK).entity(getIdByJson(id)).build();
        } else {
            return Response.status(Response.Status.FORBIDDEN).entity(toJsonError("wrong user change")).build();
        }
    }

    @DELETE
    @Path("{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteUser(@PathParam("id") long id, @Context HttpServletRequest request) {
        final AccountService accountService = context.get(AccountService.class);
        final String sessionId = request.getSession().getId();
        final UserDataSet user = accountService.getUserByLogin(accountService.giveProfileFromSessionId(sessionId).getLogin());
        if ((accountService.checkAuth(sessionId)) && (user.getId() == accountService.getUser(id).getId())) {
            accountService.deleteUser(id);
            accountService.deleteSession(sessionId);
            return Response.status(Response.Status.OK).build();
        } else {
            return Response.status(Response.Status.FORBIDDEN).entity(toJsonError("wrong user delete")).build();
        }
    }

    public String getIdByJson(long id) {
        final JSONObject jsonObject = new JSONObject();
        jsonObject.put("id", id);
        return jsonObject.toString();
    }

    public String toJson(UserDataSet user) {
        final JSONObject jsonObject = new JSONObject();
        jsonObject.put("id", user.getId());
        jsonObject.put("login", user.getLogin());
        jsonObject.put("email", user.getEmail());
        jsonObject.put("avatar", user.getAvatar());
        return jsonObject.toString();
    }

    public String toJsonError(String error) {
        final JSONObject jsonObject = new JSONObject();
        jsonObject.put("error:", error);
        return jsonObject.toString();
    }
}
