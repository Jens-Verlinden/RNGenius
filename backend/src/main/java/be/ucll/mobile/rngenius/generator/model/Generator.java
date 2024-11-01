package be.ucll.mobile.rngenius.generator.model;

import java.util.List;
import be.ucll.mobile.rngenius.option.model.Option;
import be.ucll.mobile.rngenius.participant.model.Participant;
import be.ucll.mobile.rngenius.user.model.User;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

@Entity(name = "generators")
public class Generator {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public long id;

    @NotBlank(message = "Title is required")
    private String title;

    @Positive(message = "Icon number must be a positive number")
    private int iconNumber;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "generator", cascade = CascadeType.REMOVE)
    private List<Option> options;

    @OneToMany(mappedBy = "generator", cascade = CascadeType.REMOVE)
    private List<Participant> participants;

    public Generator(String title, int iconNumber) {
        this.title = title;
        this.iconNumber = iconNumber;
    }

    public Generator() {}

    public String getTitle() {
        return title;
    }

    public int getIconNumber() {
        return iconNumber;
    }

    public User getUser() {
        return user;
    }

    public List<Option> getOptions() {
        return options;
    }

    public List<Participant> getParticipants() {
        return participants;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setIconNumber(int iconNumber) {
        this.iconNumber = iconNumber;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setOptions(List<Option> options) {
        this.options = options;
    }

    public void setParticipants(List<Participant> participants) {
        this.participants = participants;
    }
}