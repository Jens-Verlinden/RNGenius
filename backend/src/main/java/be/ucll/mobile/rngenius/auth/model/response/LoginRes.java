package be.ucll.mobile.rngenius.auth.model.response;

public class LoginRes {
    public String message;
    public String accessToken;
    public String refreshToken;
    public long id;
    public String email;
    public String firstName;
    public String lastName;

    public LoginRes(String message, String accessToken, String refreshToken, long id, String email, String firstName, String lastName) {
        this.message = message;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
    }
}
