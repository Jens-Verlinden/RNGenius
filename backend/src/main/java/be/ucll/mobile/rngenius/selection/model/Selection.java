package be.ucll.mobile.rngenius.selection.model;

import be.ucll.mobile.rngenius.option.model.Option;
import be.ucll.mobile.rngenius.participant.model.Participant;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity(name = "selections")
public class Selection {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @ManyToOne
    @JoinColumn(name = "participant_id")
    private Participant participant;

    @ManyToOne
    @JoinColumn(name = "option_id")
    private Option option;

    boolean favorised;

    boolean excluded;

    public Selection() {}

    public Participant getParticipant() {
        return participant;
    }

    public Option getOption() {
        return option;
    }

    public boolean getFavorised() {
        return favorised;
    }

    public boolean getExcluded() {
        return excluded;
    }

    public void setParticipant(Participant participant) {
        this.participant = participant;
    }

    public void setOption(Option option) {
        this.option = option;
    }

    public void setFavorised(boolean favorised) {
        this.favorised = favorised;
    }

    public void setExcluded(boolean excluded) {
        this.excluded = excluded;
    }
}