package be.ucll.mobile.rngenius.generator.service;

import java.util.List;
import java.util.ArrayList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import be.ucll.mobile.rngenius.generator.model.Generator;
import be.ucll.mobile.rngenius.generator.repo.GeneratorRepository;
import be.ucll.mobile.rngenius.option.model.Option;
import be.ucll.mobile.rngenius.option.repo.OptionRepository;
import be.ucll.mobile.rngenius.participant.model.Participant;
import be.ucll.mobile.rngenius.participant.repo.ParticipantRepository;
import be.ucll.mobile.rngenius.selection.model.Selection;
import be.ucll.mobile.rngenius.selection.repo.SelectionRepository;
import be.ucll.mobile.rngenius.user.model.User;
import be.ucll.mobile.rngenius.user.service.UserService;
import be.ucll.mobile.rngenius.user.service.UserServiceException;
import jakarta.transaction.Transactional;

@Service
@Transactional
public class GeneratorService {

    @Autowired
    private GeneratorRepository generatorRepository;

    @Autowired
    private OptionRepository optionRepository;

    @Autowired
    private ParticipantRepository participantRepository;

    @Autowired
    private SelectionRepository selectionRepository;

    @Autowired
    private UserService userService;

    public GeneratorService() {}

    public Generator getGeneratorById(Long id, Long requesterId) throws GeneratorServiceException , GeneratorServiceAuthorizationException{
        Generator generator = generatorRepository.findGeneratorById(id);

        if (generator == null) {
            throw new GeneratorServiceException("generator", "No generator with this id");
        } 

        for (Participant participant : generator.getParticipants()) {
            if (participant.getUser().id.equals(requesterId)) {
                return generator;
            }
        } 

        throw new GeneratorServiceAuthorizationException("generator", "You are not authorized to view this generator");
    }

    public List<Generator> getMyGenerators(Long requesterId) {
        return generatorRepository.findGeneratorsByUserId(requesterId);
    }

    public void addGenerator(Generator generator, Long requesterId) throws GeneratorServiceException, UserServiceException {
        if (generator == null) {
            throw new GeneratorServiceException("generator", "Generator data is required");
        }

        generator.setUser(userService.getUserById(requesterId));

        generatorRepository.save(generator);

        Participant participant = new Participant();
        participant.setGenerator(generator);
        participant.setUser(generator.getUser());
        participantRepository.save(participant);

    }

    public void updateGenerator(Generator generator, Long requesterId) throws GeneratorServiceException, GeneratorServiceAuthorizationException, UserServiceException {
        if (generator == null) {
            throw new GeneratorServiceException("generator", "Generator data is required");
        }

        Generator existingGenerator = getGeneratorById(generator.id, requesterId);

        if (!existingGenerator.getUser().id.equals(requesterId)) {
            throw new GeneratorServiceAuthorizationException("generator", "You are not authorized to update this generator");
        }

        existingGenerator.setTitle(generator.getTitle());
        existingGenerator.setIconNumber(generator.getIconNumber());

        generatorRepository.save(existingGenerator);
    }

    public void deleteGeneratorById(Long id, Long requesterId) throws GeneratorServiceException, GeneratorServiceAuthorizationException {
        Generator generator = getGeneratorById(id, requesterId);

        if (!generator.getUser().id.equals(requesterId)) {
            throw new GeneratorServiceAuthorizationException("generator", "You are not authorized to delete this generator");
        }

        generatorRepository.delete(generator);
    }

    public void addGeneratorOption(Long generatorId, Option option, Long requesterId) throws GeneratorServiceException, GeneratorServiceAuthorizationException {
        if (option == null) {
            throw new GeneratorServiceException("option", "Option data is required");
        }

        Generator generator = getGeneratorById(generatorId, requesterId);

        option.setGenerator(generator);
        optionRepository.save(option);

        for (Participant participant : generator.getParticipants()) {
            Selection selection = new Selection();
            selection.setParticipant(participant);
            selection.setOption(option);
            selectionRepository.save(selection);
        }
    }

    public void deleteCategorizedGeneratorOption(Long optionId, String category, Long requesterId) throws GeneratorServiceException, GeneratorServiceAuthorizationException {
        Option option = getOptionById(optionId);

        if (!option.getGenerator().getUser().id.equals(requesterId)) {
            throw new GeneratorServiceAuthorizationException("option", "You are not authorized to delete this option");
        }

        option.removeCategory(category);

        if (option.getCategories().isEmpty()) {
            optionRepository.delete(option);
        } else {
            optionRepository.save(option);
        }
    }

    public Option generateOption(Long generatorId, Long requesterId) throws GeneratorServiceException, GeneratorServiceAuthorizationException {
        Generator generator = getGeneratorById(generatorId, requesterId);

        List<Option> options = generator.getOptions();
        List<Option> validOptions = new ArrayList<>();

        for (Option option : options) {
            boolean isExcluded = false;
            int timesFavorised = 0;

            List<Selection> selections = selectionRepository.findSelectionsByOptionId(option.id);
            for (Selection selection : selections) {
                if (selection.getExcluded()) {
                    isExcluded = true;
                    break;
                }
                if (selection.getFavorised()) {
                    timesFavorised++;
                }
            }

            if (!isExcluded) {
                validOptions.add(option);
                for (int i = 0; i < timesFavorised; i++) {
                    validOptions.add(option);
                }
            }
        }

        if (validOptions.isEmpty()) {
            throw new GeneratorServiceException("generator", "No valid options available");
        }

        int randomIndex = (int) (Math.random() * validOptions.size());

        return validOptions.get(randomIndex);
    }
    
    public void prioritiseOption(Long optionId, Long requesterId) throws GeneratorServiceException, GeneratorServiceAuthorizationException {
        Selection selection = getSelectionByParticipantIdAndOptionId(requesterId, optionId);
        selection.setExcluded(false);
        selection.setFavorised(true);
        selectionRepository.save(selection);
    }

    public void excludeOption(Long optionId, Long requesterId) throws GeneratorServiceException, GeneratorServiceAuthorizationException {
        Selection selection = getSelectionByParticipantIdAndOptionId(requesterId, optionId);
        selection.setFavorised(false);
        selection.setExcluded(true);
        selectionRepository.save(selection);
    }

    public void addGeneratorParticipant(Long generatorId, String email, Long requesterId) throws GeneratorServiceException, GeneratorServiceAuthorizationException, UserServiceException {
        Generator generator = getGeneratorById(generatorId, requesterId);

        if (!generator.getUser().id.equals(requesterId)) {
            throw new GeneratorServiceAuthorizationException("generator", "You are not authorized to add participants to this generator");
        }

        User user = userService.getUserByEmail(email);

        Participant participant = participantRepository.findParticipantByUserIdAndGeneratorId(user.id, generator.id);
        if (participant != null) {
            throw new GeneratorServiceException("participant", "Participant already joined this generator");
        } else {
            participant = new Participant();
            participant.setGenerator(generator);
            participant.setUser(user);
            participantRepository.save(participant);

            for (Option option : generator.getOptions()) {
                Selection selection = new Selection();
                selection.setParticipant(participant);
                selection.setOption(option);
                selectionRepository.save(selection);
            }
        }
    }

    public void deleteGeneratorParticipant(Long generatorId, Long participantId, Long requesterId) throws GeneratorServiceException, GeneratorServiceAuthorizationException {
        Generator generator = getGeneratorById(generatorId, requesterId);

        if (!generator.getUser().id.equals(requesterId)) {
            throw new GeneratorServiceAuthorizationException("generator", "You are not authorized to delete participants from this generator");
        }

        Participant participant = participantRepository.findParticipantByUserIdAndGeneratorId(participantId, generatorId);

        if (participant == null) {
            throw new GeneratorServiceException("participant", "Participant not found in this generator");
        }

        participantRepository.delete(participant);
    }

    public void leaveGenerator(Long generatorId, Long requesterId) throws GeneratorServiceException, GeneratorServiceAuthorizationException {
        Generator generator = getGeneratorById(generatorId, requesterId);

        if (generator.getUser().id.equals(requesterId)) {
            throw new GeneratorServiceAuthorizationException("generator", "You are not authorized to leave your own generator");
        }

        Participant participant = participantRepository.findParticipantByUserIdAndGeneratorId(requesterId, generatorId);

        participantRepository.delete(participant);
    }

    private Option getOptionById(Long optionId) throws GeneratorServiceException {
        Option option = optionRepository.findOptionById(optionId);

        if (option == null) {
            throw new GeneratorServiceException("option", "No option with this id");
        }

        return option;
    }

    private Selection getSelectionByParticipantIdAndOptionId(Long participantId, Long optionId) throws GeneratorServiceException {
        Selection selection = selectionRepository.findSelectionByParticipantIdAndOptionId(participantId, optionId);

        if (selection == null) {
            throw new GeneratorServiceException("selection", "No selection with this participant and option");
        }

        return selection;
    }
}
