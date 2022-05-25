package com.shrinktracker.backend.graphql.models;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@Document(collection = "shrinkitems")
public class ShrinkItem {
    @Id
    private String id;
    private Item item;
    private LocalDate expirationDate;
    private int quantity;
    private LocalDate dateAdded;
    private String userWhoAdded;

    public ShrinkItem(Item item, LocalDate expirationDate, int quantity, LocalDate now, String userWhoAdded) {
        this.item = item;
        this.expirationDate = expirationDate;
        this.quantity = quantity;
        this.dateAdded = now;
        this.userWhoAdded = userWhoAdded;
    }
}
