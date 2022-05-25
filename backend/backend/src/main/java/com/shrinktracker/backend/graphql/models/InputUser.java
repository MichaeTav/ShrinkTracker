package com.shrinktracker.backend.graphql.models;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
public class InputUser {
    private String username;
    private String email;
    private String password;
    private String confirmPassword;
    private String department;
    private Set<String> roles;

    public InputUser(String username, String department, String email, String password, String confirmPassword, Set<String> roles) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.confirmPassword = confirmPassword;
        this.department = department;
        this.roles = roles;
    }
}
