package com.shrinktracker.backend.repository;

import com.shrinktracker.backend.graphql.models.ShrinkItem;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface ShrinkItemRepository extends MongoRepository<ShrinkItem, String> {
}
