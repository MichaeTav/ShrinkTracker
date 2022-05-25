package com.shrinktracker.backend.repository;

import com.shrinktracker.backend.graphql.models.ERole;
import com.shrinktracker.backend.graphql.models.Role;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface RoleRepository extends MongoRepository<Role, String> {
    Optional<Role> findByName(ERole name);
}
