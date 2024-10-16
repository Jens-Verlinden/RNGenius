package be.ucll.mobile.rngenius.greeting.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import be.ucll.mobile.rngenius.greeting.model.Greeting;
import be.ucll.mobile.rngenius.greeting.repo.GreetingRepository;

@Service
public class GreetingService {
    @Autowired
    private GreetingRepository greetingRepository;

    public GreetingService() {}

    public Greeting getGreeting () {
        Greeting greeting = greetingRepository.findGreetingById(1);

        if (greeting == null) {
            throw new GreetingServiceException("greeting", "No greeting found!");
        }

        return greeting;
    }

}
