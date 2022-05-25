package com.shrinktracker.backend.graphql.models;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@Document(collection = "users")
public class User {

    @Id
    private String id;
    private String username;
    private String email;
    private String password;
    private String department;
    @DBRef
    private Set<Role> roles = new HashSet<>();

    public User(String username, String department, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.department = department;
    }
}
