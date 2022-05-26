package com.shrinktracker.backend.graphql.resolvers;

import com.shrinktracker.backend.graphql.models.*;
import com.shrinktracker.backend.repository.RoleRepository;
import com.shrinktracker.backend.repository.UserRepository;
import com.shrinktracker.backend.util.exceptions.CreateUserException;
import com.shrinktracker.backend.util.exceptions.InvalidCredentialsException;
import com.shrinktracker.backend.util.security.jwt.JwtUtils;
import com.shrinktracker.backend.util.security.services.UserDetailsImpl;
import com.shrinktracker.backend.util.security.services.UserDetailsServiceImpl;
import com.shrinktracker.backend.util.validators.ValidationUtils;

import com.coxautodev.graphql.tools.GraphQLMutationResolver;
import com.coxautodev.graphql.tools.GraphQLQueryResolver;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
@Component
public class UserResolver implements GraphQLQueryResolver, GraphQLMutationResolver {
    private static final Pattern VALID_EMAIL_ADDRESS_REGEX =
            Pattern.compile("^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,6}$", Pattern.CASE_INSENSITIVE);
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    RoleRepository roleRepository;
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private JwtUtils jwtUtils;

    /* Queries */
    @PreAuthorize("hasRole('ADMIN')")
    public Iterable<User> findAllUsers(){
        return userRepository.findAll();
    }

    /* Mutations */
    @PreAuthorize("hasRole('ADMIN')")
    public User createUser(InputUser userInput) throws Exception {
        Map<String, Object> errors = new HashMap<>();

        /* Empty/taken username */
        if(userInput.getUsername() == ""){
            //throw new CreateUserException("Username cannot be empty");
            errors.put("username","Username cannot be empty!");
        } else if(userRepository.existsByUsername(userInput.getUsername())){
            //throw new CreateUserException("Username is taken");
            errors.put("username","Username is taken!");
        }
        //empty/invalid email
        if(userInput.getEmail() == ""){
            errors.put("email","Email cannot be empty!");
        } else if(!validate(userInput.getEmail())){
            errors.put("email","Email is not valid!");
        }
        //confirm password does not match
        if(userInput.getPassword() == ""){
            errors.put("password", "Password cannot be empty!");
        } else if(!userInput.getPassword().equals(userInput.getConfirmPassword())) {
            errors.put("confirmPassword", "Passwords do not match!");
        }
        //department is not empty
        if(userInput.getDepartment() == ""){
            errors.put("department", "Department cannot be empty!");
        }
        if(errors.size() > 0){
            throw new CreateUserException("Invalid input", errors);
        }

        User user = new User(userInput.getUsername().toLowerCase(), userInput.getDepartment(), userInput.getEmail(), passwordEncoder.encode(userInput.getPassword()));

        Set<String> strRoles = userInput.getRoles();
        Set<Role> roles = new HashSet<>();
        if (strRoles.isEmpty()) {
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "admin":
                        Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(adminRole);
                        break;
                    default:
                        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(userRole);
                }
            });
        }

        user.setRoles(roles);
        userRepository.save(user);
        log.info("New user, {}, created", user.getUsername());
        return user;
    }

    @PreAuthorize("permitAll()")
    public UserPayload login(String username, String password){
        try{
            username = username.toLowerCase();
            ValidationUtils.areNonEmptyNorNull(List.of(username, password));
            UsernamePasswordAuthenticationToken credentials = new UsernamePasswordAuthenticationToken(username, password);
            authenticationManager.authenticate(credentials);
            log.info("User logged in with username: {}", username);
        } catch (Exception e){
            log.error("Invalid credentials for log in");
            throw new InvalidCredentialsException("Invalid credentials for log in", username);
        }
        final UserDetailsImpl userDetails = userDetailsService.loadUserByUsername(username);
        return new UserPayload(userRepository.findByUsername(userDetails.getUsername()), jwtUtils.createToken(userDetails));
    }

    @PreAuthorize("hasRole('ADMIN')")
    public boolean deleteUser(String id){
        if(userRepository.findById(id) != null) {
            userRepository.deleteById(id);
            return true;
        }

        return false;
    }

    private static boolean validate(String emailStr) {
        Matcher matcher = VALID_EMAIL_ADDRESS_REGEX.matcher(emailStr);
        return matcher.find();
    }
}
