package com.shrinktracker.backend.util.validators;

import java.util.List;

public class ValidationUtils {

    public static Boolean areNonEmptyNorNull(List<String> strings){
        boolean hasEmptyOrNull = strings.stream().anyMatch(string -> {
            return string == null || string.equalsIgnoreCase("");
        });
        if(hasEmptyOrNull){
            throw new RuntimeException("Invalid input parameters");
        }

        return true;
    }
}
