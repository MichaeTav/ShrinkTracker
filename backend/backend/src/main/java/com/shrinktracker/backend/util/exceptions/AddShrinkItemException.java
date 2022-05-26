package com.shrinktracker.backend.util.exceptions;

import graphql.ErrorType;
import graphql.GraphQLError;
import graphql.language.SourceLocation;

import java.util.Collections;
import java.util.List;
import java.util.Map;

public class AddShrinkItemException extends RuntimeException implements GraphQLError {
    private Map<String, Object> errors;
    private String message;

    public AddShrinkItemException(String message, Map<String, Object> errors){
        super(message);
        this.message = message;
        this.errors = errors;
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
        return Collections.singletonMap("exception", errors);
    }
}
