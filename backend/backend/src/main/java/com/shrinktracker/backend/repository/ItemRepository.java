package com.shrinktracker.backend.repository;

import com.shrinktracker.backend.graphql.models.Item;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface ItemRepository extends MongoRepository<Item, String> {
    Item findByupc(String s);

    @Query("{ 'department' : ?0 }")
    List<Item> findAllItemsByDepartment(String department);
}
