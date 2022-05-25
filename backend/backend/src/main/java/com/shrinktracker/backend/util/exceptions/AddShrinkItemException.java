package com.shrinktracker.backend.util.exceptions;

import graphql.ErrorType;
import graphql.GraphQLError;
import graphql.language.SourceLocation;

import java.util.Collections;
import java.util.List;
import java.util.Map;

public class AddShrinkItemException extends RuntimeException implements GraphQLError {
    private Map<String, String> errors;

    public AddShrinkItemException(String message, Map<String, String> errors){
        super(message);
        this.errors = errors;
    }

    @Override
    public List<SourceLocation> getLocations() {
        return null;
    }
    @Override
    public String getMessage(){
        return super.getMessage();
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
