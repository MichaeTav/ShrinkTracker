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
import org.apache.tomcat.util.json.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
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
import java.util.Optional;

@Slf4j
@Component
public class ShrinkItemResolver implements GraphQLQueryResolver, GraphQLMutationResolver {

    @Autowired
    private ShrinkItemRepository shrinkItemRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private ItemRepository itemRepository;

    /* Queries */
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public Iterable<ShrinkItem> getAllShrinkItems(){
        String department = ((UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getDepartment();
        if(department.equals("Admin")){
            return shrinkItemRepository.findAll();
        }
        return mongoTemplate.findAll(ShrinkItem.class, "shrink_" + department.toLowerCase());
    }

    /* Mutations */
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public boolean deleteShrinkItem(String id, String upc, int quantity){
        if(shrinkItemRepository.findById(id) == null) {
            throw new GraphQLException("Item not found");

        }
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(id));
        mongoTemplate.remove(query, getDepartmentCollection(upc));
        shrinkItemRepository.deleteById(id);
        return true;
    }

    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ShrinkItem addShrinkItem(String upc, String expirationDate, int quantity) throws ParseException {
        Map<String, Object> errors = new HashMap<>();

        if(upc == ""){
            errors.put("item","Item cannot be empty!");
        } else if(itemRepository.findByupc(upc) == null){
            errors.put("item","Item not found by UPC!");
        }
        if(expirationDate == ""){
            errors.put("expirationDate","Expiration Date cannot be empty!");
        }else if(new SimpleDateFormat("yyyy-MM-dd").parse(expirationDate).before(new Date())){
            errors.put("expirationDate","Expiration Date cannot be before todays date!");
        }
        if(quantity < 1){
            errors.put("quantity","Quantity must be greater than 0!");
        }

        if(errors.size() > 0){
            throw new AddShrinkItemException("Invalid shrink item input", errors);
        }


        String userWhoAdded = ((UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        ShrinkItem shrinkItem = new ShrinkItem(itemRepository.findByupc(upc), LocalDate.parse(expirationDate), quantity, LocalDate.now(), userWhoAdded);
        shrinkItemRepository.save(shrinkItem);
        mongoTemplate.save(shrinkItem, getDepartmentCollection(upc));
        log.info("Shrink Item {} was added by: {}", shrinkItem.getItem().getName(), userWhoAdded);

        return shrinkItem;
    }

    private String getDepartmentCollection(String upc){
        String departmentCollection = "shrink_";
        switch(itemRepository.findByupc(upc).getDepartment()){
            case("Produce"): departmentCollection += "produce"; break;
            case("Meat"): departmentCollection += "meat"; break;
            case("Deli"): departmentCollection += "deli"; break;
            case("Bakery"): departmentCollection += "bakery"; break;
            case("Grocery"): departmentCollection += "grocery"; break;
        }
        return departmentCollection;
    }
}
