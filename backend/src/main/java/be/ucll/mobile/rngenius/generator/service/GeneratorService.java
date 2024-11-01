package be.ucll.mobile.rngenius.generator.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import be.ucll.mobile.rngenius.generator.model.Generator;
import be.ucll.mobile.rngenius.generator.repo.GeneratorRepository;
import be.ucll.mobile.rngenius.option.model.Option;
import be.ucll.mobile.rngenius.option.repo.OptionRepository;
import be.ucll.mobile.rngenius.user.service.UserService;
import be.ucll.mobile.rngenius.user.service.UserServiceException;

@Service
public class GeneratorService {

    @Autowired
    private GeneratorRepository generatorRepository;

    @Autowired
    private OptionRepository optionRepository;

    @Autowired
    private UserService userService;

    public GeneratorService() {}

    public Generator getGeneratorById(Long id, Long requesterId) throws GeneratorServiceException , GeneratorServiceAuthorizationException{
        Generator generator = generatorRepository.findGeneratorById(id);

        if (generator == null) {
            throw new GeneratorServiceException("generator", "No generator with this id");
        } else if (!generator.getUser().id.equals(requesterId)) {
            throw new GeneratorServiceAuthorizationException("generator", "You are not authorized to retrieve this generator");
        }

        return generator;
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
    }

    public void deleteGeneratorById(Long id, Long requesterId) throws GeneratorServiceException, GeneratorServiceAuthorizationException {
        Generator generator = getGeneratorById(id, requesterId);

        generatorRepository.delete(generator);
    }

    public void addGeneratorOption(Long generatorId, Option option, Long requesterId) throws GeneratorServiceException, GeneratorServiceAuthorizationException {
        if (option == null) {
            throw new GeneratorServiceException("option", "Option data is required");
        }

        Generator generator = getGeneratorById(generatorId, requesterId);

        option.setGenerator(generator);
        optionRepository.save(option);
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

        if (options.isEmpty()) {
            throw new GeneratorServiceException("generator", "No options available");
        }

        int randomIndex = (int) (Math.random() * options.size());

        return options.get(randomIndex);
    }

    private Option getOptionById(Long optionId) throws GeneratorServiceException {
        Option option = optionRepository.findOptionById(optionId);

        if (option == null) {
            throw new GeneratorServiceException("option", "No option with this id");
        }

        return option;
    }
}
