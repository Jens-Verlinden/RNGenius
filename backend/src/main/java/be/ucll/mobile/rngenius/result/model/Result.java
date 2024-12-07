package be.ucll.mobile.rngenius.result.model;

import java.time.LocalDateTime;
import be.ucll.mobile.rngenius.option.model.Option;
import be.ucll.mobile.rngenius.user.model.User;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity(name = "results")
public class Result {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    LocalDateTime dateTime = LocalDateTime.now();

    Long generatorId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "option_id")
    private Option option;

    public Result() {}

    public LocalDateTime getDateTime() {
        return dateTime;
    }

    public Long getGeneratorId() {
        return generatorId;
    }

    public User getUser() {
        return user;
    }

    public Option getOption() {
        return option;
    }

    public void setDateTime(LocalDateTime dateTime) {
        this.dateTime = dateTime;
    }

    public void setGeneratorId(Long generatorId) {
        this.generatorId = generatorId;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setOption(Option option) {
        this.option = option;
    }
}
