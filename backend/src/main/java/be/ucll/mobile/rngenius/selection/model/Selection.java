package be.ucll.mobile.rngenius.selection.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import be.ucll.mobile.rngenius.option.model.Option;
import be.ucll.mobile.rngenius.participant.model.Participant;
import be.ucll.mobile.rngenius.result.model.Result;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity(name = "selections")
public class Selection {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    boolean favorised;

    boolean excluded;

    @ManyToOne
    @JoinColumn(name = "participant_id")
    private Participant participant;
    
    @ManyToOne
    @JoinColumn(name = "option_id")
    private Option option;

    @OneToMany(mappedBy = "selection", cascade = CascadeType.REMOVE)
    private List<Result> results;

    public Selection() {}

    public boolean getFavorised() {
        return favorised;
    }

    public boolean getExcluded() {
        return excluded;
    }

    @JsonIgnore
    public Participant getParticipant() {
        return participant;
    }

    public Option getOption() {
        return option;
    }

    @JsonIgnore
    public List<Result> getResults() {
        return results;
    }

    public void setFavorised(boolean favorised) {
        this.favorised = favorised;
    }

    public void setExcluded(boolean excluded) {
        this.excluded = excluded;
    }

    public void setParticipant(Participant participant) {
        this.participant = participant;
    }

    public void setOption(Option option) {
        this.option = option;
    }

    public void setResults(List<Result> results) {
        this.results = results;
    }
}