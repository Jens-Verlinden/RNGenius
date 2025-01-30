package be.mobile.rngenius.option.model;

import be.mobile.rngenius.generator.model.Generator;
import be.mobile.rngenius.result.model.Result;
import be.mobile.rngenius.selection.model.Selection;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.CascadeType;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

@Entity(name = "options")
public class Option {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  public Long id;

  @NotBlank(message = "Name is required")
  private String name;

  @NotEmpty(message = "At least one category is required")
  @ElementCollection(targetClass = String.class, fetch = FetchType.EAGER)
  private List<String> categories;

  private String description;

  @ManyToOne
  @JoinColumn(name = "generator_id")
  private Generator generator;

  @OneToMany(mappedBy = "option", cascade = CascadeType.REMOVE)
  private List<Selection> selections;

  @OneToMany(mappedBy = "option", cascade = CascadeType.REMOVE)
  private List<Result> results;

  public Option(String name, List<String> categories, String description) {
    this.name = name;
    this.categories = categories;
    this.description = description;
  }

  public Option() {}

  public String getName() {
    return name;
  }

  public List<String> getCategories() {
    return categories;
  }

  public String getDescription() {
    return description;
  }

  @JsonIgnore
  public Generator getGenerator() {
    return generator;
  }

  @JsonIgnore
  public List<Selection> getSelections() {
    return selections;
  }

  @JsonIgnore
  List<Result> getResults() {
    return results;
  }

  public void setName(String name) {
    this.name = name;
  }

  public void setCategories(List<String> categories) {
    this.categories = categories;
  }

  public void addCategory(String category) {
    this.categories.add(category);
  }

  public void removeCategory(String category) {
    this.categories.remove(category);
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public void setGenerator(Generator generator) {
    this.generator = generator;
  }

  public void setSelections(List<Selection> selections) {
    this.selections = selections;
  }

  public void setResults(List<Result> results) {
    this.results = results;
  }
}
