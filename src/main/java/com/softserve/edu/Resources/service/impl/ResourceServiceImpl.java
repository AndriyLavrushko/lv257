package com.softserve.edu.Resources.service.impl;

import com.softserve.edu.Resources.service.ResourceService;
import com.softserve.edu.Resources.util.QueryBuilder;
import com.softserve.edu.Resources.dao.ResourceDao;
import com.softserve.edu.Resources.dao.ResourceTypeDAO;
import com.softserve.edu.Resources.dto.GenericResourceDTO;
import com.softserve.edu.Resources.entity.GenericResource;

import com.softserve.edu.Resources.entity.ResourceProperty;
import com.softserve.edu.Resources.entity.ResourceType;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ResourceServiceImpl implements ResourceService {

//    private Collection<GenericResource> resources = new HashSet<>();
//    private ResourceTypeService typeService = new ResourceTypeServiceImpl();
    
    @Autowired
    ResourceTypeDAO resourceTypeDAO;
    
    @Autowired
    ResourceDao resourceDao;
    
    @Autowired
    QueryBuilder queryBuilder;

//    public ResourceServiceImpl() {
//    }

//    @Override
//    public Collection<GenericResource> getResources() {
//        return Collections.unmodifiableCollection(resources);
//    }

   

//    @Override
//    public Collection<ResourceType> getResourceTypes() {
//        return resources.stream().map(GenericResource::getType).collect(Collectors.toSet());
//    }

//    @Override
//    public GenericResource addResource(ResourceType resourceType, Set<PropertyValue> resourceValues) {
//        typeService.add(resourceType);
//        GenericResource resource = new GenericResource(resourceType, resourceValues);
//        resources.add(resource);
//        return resource;
//    }
    
    @Transactional
    @Override
    public List<GenericResource> findResourcesByResourceType(GenericResourceDTO resourceDTO) {
        
        long resourceTypeId = resourceDTO.getId();
        
        ResourceType resourceType = resourceTypeDAO.findWithPropertiesByID(resourceTypeId);
        
        String tableName = resourceType.getTableName();
        
        List<ResourceProperty> resourceProperties = new ArrayList<>(
                resourceType.getProperties());
        System.out.println(resourceProperties);
        
        Map <String, String> valuesToSearch = resourceDTO.getResourcePropertyValue();
        
        String queryForDao = queryBuilder.lookUpByResouceType(tableName, valuesToSearch, resourceProperties);

        return resourceDao.findResourcesByResourceType(queryForDao, valuesToSearch, resourceProperties);
    }
    
}
