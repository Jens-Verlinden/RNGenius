package be.ucll.mobile.rngenius;

import jakarta.annotation.PostConstruct;
import java.util.TimeZone;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class RngeniusApplication {

  public static void main(String[] args) {
    SpringApplication.run(RngeniusApplication.class, args);
  }

  @PostConstruct
  public void init() {
    TimeZone.setDefault(TimeZone.getTimeZone("Europe/Paris"));
  }
}
