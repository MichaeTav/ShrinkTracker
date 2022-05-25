package com.shrinktracker.backend.graphql.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ItemInput {
    private String upc;
    private String name;
    private String department;
}
