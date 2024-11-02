package be.ucll.mobile.rngenius.greeting.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "greetings")
public class Greeting {
    @GeneratedValue(strategy=GenerationType.AUTO, generator = "greeting_generator")
    @SequenceGenerator(name = "greeting_generator", sequenceName = "greetings_seq", allocationSize = 1)
    @Id
    public long id;

    @NotBlank(message = "Greeting may not be empty!")
    private String message;

    public Greeting(String message) {
        this.message = message;
    }

    public Greeting() {}

    public String getMessage () {
        return message;
    }
}