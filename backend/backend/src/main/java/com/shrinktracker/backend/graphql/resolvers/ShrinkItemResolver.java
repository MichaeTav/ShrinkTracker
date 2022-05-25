package com.shrinktracker.backend.graphql.resolvers;

import com.coxautodev.graphql.tools.GraphQLMutationResolver;
import com.coxautodev.graphql.tools.GraphQLQueryResolver;
import com.shrinktracker.backend.graphql.models.Item;
import com.shrinktracker.backend.graphql.models.ItemInput;
import com.shrinktracker.backend.graphql.models.ShrinkItem;
import com.shrinktracker.backend.graphql.models.User;
import com.shrinktracker.backend.repository.ItemRepository;
import com.shrinktracker.backend.repository.ShrinkItemRepository;
import com.shrinktracker.backend.util.exceptions.AddShrinkItemException;
import com.shrinktracker.backend.util.security.services.UserDetailsImpl;
import graphql.GraphQLException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
public class ShrinkItemResolver implements GraphQLQueryResolver, GraphQLMutationResolver {

    @Autowired
    private ShrinkItemRepository shrinkItemRepository;

    @Autowired
    private ItemRepository itemRepository;

    /* Queries */
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public Iterable<ShrinkItem> getAllShrinkItems(){
        log.info("Shrink items accessed");
        return shrinkItemRepository.findAll();
    }

    /* Mutations */
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public boolean deleteShrinkItem(String id, int quantity){
        if(shrinkItemRepository.findById(id) == null) {
            throw new GraphQLException("Item not found");

        }

        shrinkItemRepository.deleteById(id);
        return true;
    }

    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ShrinkItem addShrinkItem(String upc, String expirationDate, int quantity) throws ParseException {
        Map<String, String> errors = new HashMap<>();
        if(itemRepository.findByupc(upc) == null){
            errors.put("item","Item not found by UPC");
        }
        if(expirationDate == ""){
            errors.put("expirationDate","Expiration Date cannot be empty");
        }else if(new SimpleDateFormat("yyyy-MM-dd").parse(expirationDate).before(new Date())){
            errors.put("expirationDate","Expiration Date cannot be before todays date");
        }
        if(quantity < 1){
            errors.put("quantity","Quantity must be greater than 0");
        }
        if(errors.size() > 0){
            throw new AddShrinkItemException("Invalid input", errors);
        }


        String userWhoAdded = ((UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        ShrinkItem shrinkItem = new ShrinkItem(itemRepository.findByupc(upc), LocalDate.parse(expirationDate), quantity, LocalDate.now(), userWhoAdded);

        shrinkItemRepository.save(shrinkItem);
        log.info("Shrink Item {} was added by: {}", shrinkItem.getItem().getName(), userWhoAdded);

        return shrinkItem;
    }
}
