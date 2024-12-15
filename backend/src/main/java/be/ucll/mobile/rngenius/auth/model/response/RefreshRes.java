package be.ucll.mobile.rngenius.auth.model.response;

public class RefreshRes {
  public String message;
  public String accessToken;
  public long id;
  public String email;

  public RefreshRes(String message, String accessToken, long id, String email) {
    this.message = message;
    this.accessToken = accessToken;
    this.id = id;
    this.email = email;
  }
}
