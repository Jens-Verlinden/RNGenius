package be.ucll.mobile.rngenius.generator.service;

public class GeneratorServiceException extends Exception {

    private String field;

    public GeneratorServiceException(String field, String message) {
        super(message);
        this.field=field;
    }
    
    public String getField() {
        return this.field;
    }
}
