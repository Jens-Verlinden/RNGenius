package be.ucll.mobile.rngenius.auth.model.response;

public class ErrorRes {
    public String field;
    public String message;

    public ErrorRes(String field, String message) {
        this.field = field;
        this.message = message;
    }
}

