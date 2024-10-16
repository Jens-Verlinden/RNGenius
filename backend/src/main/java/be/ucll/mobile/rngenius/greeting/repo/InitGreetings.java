package be.ucll.mobile.rngenius.greeting.repo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import be.ucll.mobile.rngenius.greeting.model.Greeting;
import jakarta.annotation.PostConstruct;

@Component
public class InitGreetings {

    @Autowired
    private GreetingRepository greetingRepository;

    @PostConstruct
    public void insertGreeting() {
        if (greetingRepository.count() == 0) {
            greetingRepository.save(new Greeting("Hello world!"));
        };
    }
}
