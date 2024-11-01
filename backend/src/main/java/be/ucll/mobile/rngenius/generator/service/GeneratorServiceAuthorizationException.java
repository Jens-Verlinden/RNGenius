package be.ucll.mobile.rngenius.generator.service;

public class GeneratorServiceAuthorizationException extends Exception {

    private String field;

    public GeneratorServiceAuthorizationException(String field, String message) {
        super(message);
        this.field=field;
    }
    
    public String getField() {
        return this.field;
    }
}
