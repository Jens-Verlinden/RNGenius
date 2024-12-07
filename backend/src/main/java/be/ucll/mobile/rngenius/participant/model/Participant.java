package be.ucll.mobile.rngenius.participant.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import be.ucll.mobile.rngenius.generator.model.Generator;
import be.ucll.mobile.rngenius.selection.model.Selection;
import be.ucll.mobile.rngenius.user.model.User;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity(name = "participants")
public class Participant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    boolean notifications;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "generator_id")
    private Generator generator;
    
    @OneToMany(mappedBy = "participant", cascade = CascadeType.REMOVE)
    private List<Selection> selections;

    public Participant() {
        this.notifications = false;
    }

    public boolean getNotifications() {
        return notifications;
    }

    public User getUser() {
        return user;
    }

    @JsonIgnore
    public Generator getGenerator() {
        return generator;
    }

    public List<Selection> getSelections() {
        return selections;
    }

    public void setNotifications(boolean notifications) {
        this.notifications = notifications;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setGenerator(Generator generator) {
        this.generator = generator;
    }

    public void setSelections(List<Selection> selections) {
        this.selections = selections;
    }
}