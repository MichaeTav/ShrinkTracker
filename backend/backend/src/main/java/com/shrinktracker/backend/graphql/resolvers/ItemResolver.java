package com.shrinktracker.backend.graphql.resolvers;

import com.shrinktracker.backend.graphql.models.Item;
import com.shrinktracker.backend.repository.ItemRepository;

import com.coxautodev.graphql.tools.GraphQLMutationResolver;
import com.coxautodev.graphql.tools.GraphQLQueryResolver;
import com.shrinktracker.backend.util.exceptions.CreateItemException;
import com.shrinktracker.backend.util.exceptions.CreateUserException;
import com.shrinktracker.backend.util.security.services.UserDetailsImpl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
public class ItemResolver implements GraphQLQueryResolver, GraphQLMutationResolver {

    @Autowired
    private ItemRepository itemRepository;

    /* Queries */
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public Iterable<Item> getAllItems(){
        String department = ((UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getDepartment();
        if(department.equals("Admin")){
            return itemRepository.findAll();
        }
        return itemRepository.findAllItemsByDepartment(department);
    }

    /* Mutations */
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public Item addItem(String upc, String name, String department){
        Map<String, Object> errors = new HashMap<>();

        try{
            if(itemRepository.findByupc(upc) != null){
                errors.put("upc", "Item with UPC already exists!");

            } else if(upc == ""){
                errors.put("upc", "UPC cannot be empty!");
            } else {
                Integer.parseInt(upc);
            }
        } catch (NumberFormatException e){
            errors.put("upc", "UPC must be a number!");
        }

        if(name == ""){
            errors.put("name", "Name cannot be empty!");
        }
        if(department == ""){
            errors.put("department", "Department cannot be empty!");
        }

        if(errors.size() > 0){
            throw new CreateUserException("Invalid Input", errors);
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
