package be.ucll.mobile.rngenius.result.model;

import java.time.LocalDateTime;
import be.ucll.mobile.rngenius.selection.model.Selection;
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

    @ManyToOne
    @JoinColumn(name = "selection_id")
    private Selection selection;

    public Result() {}

    public LocalDateTime getDateTime() {
        return dateTime;
    }

    public Selection getSelection() {
        return selection;
    }

    public void setDateTime(LocalDateTime dateTime) {
        this.dateTime = dateTime;
    }

    public void setSelection(Selection selection) {
        this.selection = selection;
    }
}
