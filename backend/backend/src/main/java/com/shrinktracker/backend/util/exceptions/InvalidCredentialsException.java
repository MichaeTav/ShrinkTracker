package com.shrinktracker.backend.util.exceptions;

import graphql.ErrorType;
import graphql.GraphQLError;
import graphql.language.SourceLocation;

import java.util.Collections;
import java.util.List;
import java.util.Map;

public class InvalidCredentialsException extends RuntimeException implements GraphQLError {
    private String invalidCredentials;


    public InvalidCredentialsException(String message, String invalid){
        super(message, null, false, false);
        this.invalidCredentials = message;
    }

    @Override
    public String getMessage(){
        return super.getMessage();
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
        return Collections.singletonMap("exception", "Username or Password not correct");
    }
}
