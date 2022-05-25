package com.shrinktracker.backend.repository;

import com.shrinktracker.backend.graphql.models.Item;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface ItemRepository extends MongoRepository<Item, String> {
    Item findByupc(String s);
}
