package be.mobile.rngenius.generator.controller;

import be.mobile.rngenius.auth.jwt.JwtUtil;
import be.mobile.rngenius.generator.model.Generator;
import be.mobile.rngenius.generator.model.GeneratorException;
import be.mobile.rngenius.generator.service.GeneratorService;
import be.mobile.rngenius.generator.service.GeneratorServiceAuthorizationException;
import be.mobile.rngenius.generator.service.GeneratorServiceException;
import be.mobile.rngenius.option.model.Option;
import be.mobile.rngenius.result.model.Result;
import be.mobile.rngenius.user.model.UserException;
import be.mobile.rngenius.user.service.UserServiceException;
import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = {"*"})
@RequestMapping("/generator")
public class GeneratorRestController {

  @Autowired private GeneratorService generatorService;

  @Autowired private JwtUtil jwtUtil;

  @GetMapping("/{id}")
  public Generator getGenerator(@PathVariable Long id, @RequestHeader("Authorization") String token)
      throws GeneratorServiceException, GeneratorServiceAuthorizationException {
    Long requesterId = jwtUtil.retrieveRequesterId(token);
    return generatorService.getGeneratorById(id, requesterId);
  }

  @GetMapping("/myGenerators")
  public List<Generator> getMyGenerators(@RequestHeader("Authorization") String token)
      throws GeneratorServiceException {
    Long requesterId = jwtUtil.retrieveRequesterId(token);
    return generatorService.getMyGenerators(requesterId);
  }

  @PostMapping("/add")
  public ResponseEntity<String> addGenerator(
      @RequestBody @Valid Generator generator, @RequestHeader("Authorization") String token)
      throws GeneratorServiceException, UserServiceException {
    Long requesterId = jwtUtil.retrieveRequesterId(token);
    generatorService.addGenerator(generator, requesterId);
    return ResponseEntity.ok().build();
  }

  @PutMapping("/update/{id}")
  public ResponseEntity<String> updateGenerator(
      @PathVariable Long id,
      @RequestBody @Valid Generator generator,
      @RequestHeader("Authorization") String token)
      throws GeneratorServiceException,
          GeneratorServiceAuthorizationException,
          UserServiceException {
    Long requesterId = jwtUtil.retrieveRequesterId(token);
    generatorService.updateGenerator(id, generator, requesterId);
    return ResponseEntity.ok().build();
  }

  @DeleteMapping("/delete/{id}")
  public ResponseEntity<String> deleteGenerator(
      @PathVariable Long id, @RequestHeader("Authorization") String token)
      throws GeneratorServiceException, GeneratorServiceAuthorizationException {
    Long requesterId = jwtUtil.retrieveRequesterId(token);
    generatorService.deleteGeneratorById(id, requesterId);
    return ResponseEntity.ok().build();
  }

  @PutMapping("/addOption/{generatorId}")
  public ResponseEntity<String> addOption(
      @PathVariable Long generatorId,
      @RequestBody @Valid Option option,
      @RequestHeader("Authorization") String token)
      throws GeneratorServiceException, GeneratorServiceAuthorizationException {
    Long requesterId = jwtUtil.retrieveRequesterId(token);
    generatorService.addGeneratorOption(generatorId, option, requesterId);
    return ResponseEntity.ok().build();
  }

  @PutMapping("/deleteOption/{optionId}")
  public ResponseEntity<String> deleteOption(
      @PathVariable Long optionId,
      @RequestParam String category,
      @RequestHeader("Authorization") String token)
      throws GeneratorServiceException, GeneratorServiceAuthorizationException {
    Long requesterId = jwtUtil.retrieveRequesterId(token);
    generatorService.deleteCategorizedGeneratorOption(optionId, category, requesterId);
    return ResponseEntity.ok().build();
  }

  @DeleteMapping("/purgeOption/{optionId}")
  public ResponseEntity<String> deleteOption(
      @PathVariable Long optionId, @RequestHeader("Authorization") String token)
      throws GeneratorServiceException, GeneratorServiceAuthorizationException {
    Long requesterId = jwtUtil.retrieveRequesterId(token);
    generatorService.purgeGeneratorOption(optionId, requesterId);
    return ResponseEntity.ok().build();
  }

  @GetMapping("/generate/{id}")
  public Option generate(@PathVariable Long id, @RequestHeader("Authorization") String token)
      throws GeneratorServiceException,
          GeneratorException,
          GeneratorServiceAuthorizationException,
          UserServiceException {
    Long requesterId = jwtUtil.retrieveRequesterId(token);
    return generatorService.generateOption(id, requesterId);
  }

  @PutMapping("/favorise/{optionId}")
  public ResponseEntity<String> prioritiseOption(
      @PathVariable Long optionId, @RequestHeader("Authorization") String token)
      throws GeneratorServiceException, GeneratorServiceAuthorizationException {
    Long requesterId = jwtUtil.retrieveRequesterId(token);
    generatorService.favoriseOption(optionId, requesterId);
    return ResponseEntity.ok().build();
  }

  @PutMapping("/exclude/{optionId}")
  public ResponseEntity<String> excludeOption(
      @PathVariable Long optionId, @RequestHeader("Authorization") String token)
      throws GeneratorServiceException, GeneratorServiceAuthorizationException {
    Long requesterId = jwtUtil.retrieveRequesterId(token);
    generatorService.excludeOption(optionId, requesterId);
    return ResponseEntity.ok().build();
  }

  @PutMapping("/addParticipant/{generatorId}")
  public ResponseEntity<String> addParticipant(
      @PathVariable Long generatorId,
      @RequestParam String email,
      @RequestHeader("Authorization") String token)
      throws GeneratorServiceException,
          GeneratorServiceAuthorizationException,
          UserServiceException {
    Long requesterId = jwtUtil.retrieveRequesterId(token);
    generatorService.addGeneratorParticipant(generatorId, email, requesterId);
    return ResponseEntity.ok().build();
  }

  @PutMapping("/removeParticipant/{generatorId}")
  public ResponseEntity<String> removeParticipant(
      @PathVariable Long generatorId,
      @RequestParam Long participantId,
      @RequestHeader("Authorization") String token)
      throws GeneratorServiceException,
          GeneratorServiceAuthorizationException,
          UserServiceException {
    Long requesterId = jwtUtil.retrieveRequesterId(token);
    generatorService.removeGeneratorParticipant(generatorId, participantId, requesterId);
    return ResponseEntity.ok().build();
  }

  @DeleteMapping("/leave/{generatorId}")
  public ResponseEntity<String> leaveGenerator(
      @PathVariable Long generatorId, @RequestHeader("Authorization") String token)
      throws GeneratorServiceException, GeneratorServiceAuthorizationException {
    Long requesterId = jwtUtil.retrieveRequesterId(token);
    generatorService.leaveGenerator(generatorId, requesterId);
    return ResponseEntity.ok().build();
  }

  @PutMapping("toggleNotifications/{generatorId}")
  public ResponseEntity<String> toggleNotifications(
      @PathVariable Long generatorId, @RequestHeader("Authorization") String token)
      throws GeneratorServiceException, GeneratorServiceAuthorizationException {
    Long requesterId = jwtUtil.retrieveRequesterId(token);
    generatorService.toggleNotifications(generatorId, requesterId);
    return ResponseEntity.ok().build();
  }

  @GetMapping("/myResults")
  public List<Result> getMyResults(@RequestHeader("Authorization") String token)
      throws GeneratorServiceException {
    Long requesterId = jwtUtil.retrieveRequesterId(token);
    return generatorService.getMyNotifiedResults(requesterId);
  }

  @PutMapping("/favoriseCategory/{generatorId}")
  public ResponseEntity<String> prioritiseCategory(
      @PathVariable Long generatorId,
      @RequestParam String category,
      @RequestHeader("Authorization") String token)
      throws GeneratorServiceException, GeneratorServiceAuthorizationException {
    Long requesterId = jwtUtil.retrieveRequesterId(token);
    generatorService.prioritiseCategory(generatorId, category, requesterId);
    return ResponseEntity.ok().build();
  }

  @PutMapping("/excludeCategory/{generatorId}")
  public ResponseEntity<String> excludeCategory(
      @PathVariable Long generatorId,
      @RequestParam String category,
      @RequestHeader("Authorization") String token)
      throws GeneratorServiceException, GeneratorServiceAuthorizationException {
    Long requesterId = jwtUtil.retrieveRequesterId(token);
    generatorService.excludeCategory(generatorId, category, requesterId);
    return ResponseEntity.ok().build();
  }

  @ResponseStatus(HttpStatus.BAD_REQUEST)
  @ExceptionHandler({MethodArgumentNotValidException.class})
  public Map<String, String> handleValidationExceptions(MethodArgumentNotValidException ex) {
    Map<String, String> errors = new HashMap<>();
    ex.getFieldErrors()
        .forEach(
            (error) -> {
              String fieldName = error.getField();
              String errorMessage = error.getDefaultMessage();
              errors.put("field", fieldName);
              errors.put("message", errorMessage);
            });
    return errors;
  }

  @ResponseStatus(HttpStatus.BAD_REQUEST)
  @ExceptionHandler({UserServiceException.class})
  public Map<String, String> handleServiceExceptions(UserServiceException ex) {
    Map<String, String> errors = new HashMap<>();
    errors.put("field", ex.getField());
    errors.put("message", ex.getMessage());
    return errors;
  }

  @ResponseStatus(HttpStatus.BAD_REQUEST)
  @ExceptionHandler({GeneratorServiceException.class})
  public Map<String, String> handleServiceExceptions(GeneratorServiceException ex) {
    Map<String, String> errors = new HashMap<>();
    errors.put("field", ex.getField());
    errors.put("message", ex.getMessage());
    return errors;
  }

  @ResponseStatus(HttpStatus.FORBIDDEN)
  @ExceptionHandler({GeneratorServiceAuthorizationException.class})
  public Map<String, String> handleServiceExceptions(GeneratorServiceAuthorizationException ex) {
    Map<String, String> errors = new HashMap<>();
    errors.put("field", ex.getField());
    errors.put("message", ex.getMessage());
    return errors;
  }

  @ResponseStatus(HttpStatus.BAD_REQUEST)
  @ExceptionHandler({GeneratorException.class})
  public Map<String, String> handleServiceExceptions(UserException ex) {
    Map<String, String> errors = new HashMap<>();
    errors.put("field", ex.getField());
    errors.put("message", ex.getMessage());
    return errors;
  }
}
