package be.mobile.rngenius.user.model;

public class UserException extends Exception {

  private String field;

  public UserException(String field, String message) {
    super(message);
    this.field = field;
  }

  public String getField() {
    return this.field;
  }
}
