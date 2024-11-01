package be.ucll.mobile.rngenius.greeting.controller;

import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import be.ucll.mobile.rngenius.greeting.model.Greeting;
import be.ucll.mobile.rngenius.greeting.service.GreetingService;
import be.ucll.mobile.rngenius.greeting.service.GreetingServiceException;

@RestController
@CrossOrigin(origins = {"*"})
@RequestMapping("/")
public class GreetingRestController {

    @Autowired
    private GreetingService greetingService;

    @GetMapping("/hello")
    public Greeting getGreeting() throws GreetingServiceException {
        return greetingService.getGreeting();
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler({ GreetingServiceException.class})
    public Map<String, String> handleServiceExceptions(GreetingServiceException ex) {
        Map<String, String> errors = new HashMap<>();
        errors.put("field", ex.getField());
        errors.put("message", ex.getMessage());
        return errors;
    }
}