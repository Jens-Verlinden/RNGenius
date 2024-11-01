package be.ucll.mobile.rngenius.generator.model;

public class GeneratorException extends Exception {
            
    private String field;

    public GeneratorException(String field, String message) {
        super(message);
        this.field=field;
    }
    
    public String getField() {
        return this.field;
    }
}