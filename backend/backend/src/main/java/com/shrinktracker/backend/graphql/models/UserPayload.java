package com.shrinktracker.backend.graphql.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Optional;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserPayload {
    private User user;
    private String token;

    public UserPayload(Optional<User> user, String token){
        user.ifPresent(u -> {
            this.user = u;
        });
        this.token = token;
    }
}
