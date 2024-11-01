package be.ucll.mobile.rngenius.user.service;

public class UserServiceException extends Exception {

    private String field;

    public UserServiceException(String field, String message) {
        super(message);
        this.field=field;
    }
    
    public String getField() {
        return this.field;
    }
}
