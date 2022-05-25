package com.shrinktracker.backend.graphql.models;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@Document(collection = "items")
public class Item {
    @Id
    private String id;
    private String upc;
    private String name;
    private String department;

    public Item(String UPC, String name, String department){
        this.upc = UPC;
        this.name = name;
        this.department = department;
    }

}
