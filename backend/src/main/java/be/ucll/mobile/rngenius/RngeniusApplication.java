package be.ucll.mobile.rngenius;

import java.util.TimeZone;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import jakarta.annotation.PostConstruct;

@SpringBootApplication
public class RngeniusApplication {

	public static void main(String[] args) {
		SpringApplication.run(RngeniusApplication.class, args);
	}

	@PostConstruct
    public void init(){
      TimeZone.setDefault(TimeZone.getTimeZone("Europe/Paris"));
  }
}