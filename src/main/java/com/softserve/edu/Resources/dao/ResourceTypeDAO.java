package com.softserve.edu.Resources.dao;

import com.softserve.edu.Resources.entity.ResourceProperty;
import com.softserve.edu.Resources.entity.ResourceType;

import java.util.List;
import java.util.Optional;

public interface ResourceTypeDAO extends GenericDAO<ResourceType, Long> {

    Optional<ResourceType> findByName(String name);
    Optional<ResourceType> findByTypeName(String typeName);

    List<ResourceType> findByProperty(ResourceProperty property);

    List<String> getInstanceNames();

    List<ResourceType> getInstances();

    void createTable(ResourceType resourceType);

    ResourceType findWithPropertiesByID(Long resourceTypeID);

    Optional<ResourceType> findById(Long id, boolean doFetch);
}
