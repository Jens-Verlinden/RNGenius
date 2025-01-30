package be.mobile.rngenius.auth.model.request;

public class PasswdReq {
  public String oldPassword;
  public String newPassword;

  public PasswdReq(String oldPassword, String newPassword) {
    this.oldPassword = oldPassword;
    this.newPassword = newPassword;
  }
}
