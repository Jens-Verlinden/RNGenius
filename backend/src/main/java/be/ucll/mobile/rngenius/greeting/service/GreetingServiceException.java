package be.ucll.mobile.rngenius.greeting.service;

public class GreetingServiceException extends RuntimeException {

  private String field;

  public GreetingServiceException(String field, String message) {
    super(message);
    this.field = field;
  }

  public String getField() {
    return this.field;
  }
}
