package com.shrinktracker.backend.graphql.resolvers;

import com.shrinktracker.backend.graphql.models.Item;
import com.shrinktracker.backend.repository.ItemRepository;

import com.coxautodev.graphql.tools.GraphQLMutationResolver;
import com.coxautodev.graphql.tools.GraphQLQueryResolver;
import com.shrinktracker.backend.util.exceptions.ItemAlreadyExistsException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Slf4j
@Component
public class ItemResolver implements GraphQLQueryResolver, GraphQLMutationResolver {

    @Autowired
    private ItemRepository itemRepository;

    /* Queries */
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public Iterable<Item> getAllItems(){
        log.info("Items accessed");
        return itemRepository.findAll();
    }

    /* Mutations */
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public Item addItem(String upc, String name, String department){

        if(itemRepository.findByupc(upc) != null){
            throw new ItemAlreadyExistsException("UPC " + upc + " already exists");
        }
        log.info("New Item Added: {}", name);
        Item item = new Item(upc, name, department);
        itemRepository.save(item);
        return item;
    }

    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public boolean deleteItem(String id){
        log.info("Item Deleted");
        itemRepository.deleteById(id);
        return true;
    }
}
