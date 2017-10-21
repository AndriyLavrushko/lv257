package com.softserve.edu.Resources.controller;

import com.softserve.edu.Resources.service.PropertyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

/**
 *
 */
@Controller
@Transactional
@RequestMapping("/resources")
public class ResourceTypeManagementController {

    @Autowired
    private PropertyService propertyService;

    @Autowired
    private Environment env;

    @RequestMapping(value = "/addType", method = RequestMethod.GET)
    public String addResourceType(Model model) {
        return editResourceType(0, model);
    }

    @RequestMapping(value = "/editType", method = RequestMethod.GET)
    public String editResourceType(@RequestParam(value = "id", defaultValue = "0") long id, Model model) {
//        model.addAttribute("env", env);
        model.addAttribute("id", id);
        return "editType";
    }

    @RequestMapping(value = "/cloneType", method = RequestMethod.GET)
    public String cloneResourceType(@RequestParam(value = "id", defaultValue = "0") long id, Model model) {
        return editResourceType(-id, model);
    }
}
