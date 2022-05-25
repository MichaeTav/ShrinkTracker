package com.shrinktracker.backend.util.exceptions;

import graphql.ErrorType;
import graphql.GraphQLError;
import graphql.language.SourceLocation;

import java.util.Collections;
import java.util.List;
import java.util.Map;

public class ItemAlreadyExistsException extends RuntimeException implements GraphQLError {
    private String message;

    public ItemAlreadyExistsException(String message){
        super(message);
        this.message = message;
    }

    @Override
    public String getMessage(){
        return this.message;
    }

    @Override
    public List<SourceLocation> getLocations() {
        return null;
    }

    @Override
    public ErrorType getErrorType() {
        return null;
    }

    @Override
    public Map<String, Object> getExtensions() {
        //return GraphQLError.super.getExtensions();
        return Collections.singletonMap("exception", message);
    }
}
