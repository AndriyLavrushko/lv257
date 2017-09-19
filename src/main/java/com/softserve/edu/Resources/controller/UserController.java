package com.softserve.edu.Resources.controller;

import com.softserve.edu.Resources.entity.ResourceRequest;
import com.softserve.edu.Resources.entity.User;
import com.softserve.edu.Resources.entity.UserDetails;
import com.softserve.edu.Resources.service.UserDetailsService;
import com.softserve.edu.Resources.service.UserService;
import com.softserve.edu.Resources.service.impl.PrivilegeService;
import com.softserve.edu.Resources.service.impl.RoleService;
import com.softserve.edu.Resources.util.FileUploadUtility;
import com.softserve.edu.Resources.validator.UploadFileValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.security.Principal;

@Controller
@Transactional
public class UserController {

    @Autowired
    private HttpServletRequest request;
    /* todo : is CHANGED UserService userService; TO UserDetailsService userDetailsService*/
    @Autowired
            UserDetailsService userDetailsService;
    @Autowired
    UserService userService;
    @Autowired
    RoleService roleService;
    @Autowired
    PrivilegeService privilegeService;
    @Autowired
    private ApplicationEventPublisher eventPublisher;
/**
@version v.01+
 */
    @RequestMapping(value = "/profile", method = RequestMethod.GET)
    public ModelAndView profile(Model model, Principal principal) {
        String userName = principal.getName();
        User user = userService.findByEmail(userName);
        long user_ID = user.getId();
        ModelAndView profile = new ModelAndView("profile");

        UserDetails userDetailsServiceInstance = userDetailsService.getUserDetailsById(user_ID);
        model.addAttribute("title", "Profile");
        profile.addObject("first_name",userDetailsServiceInstance.getFirst_name());
        profile.addObject("second_name",userDetailsServiceInstance.getSecond_name());
        profile.addObject("middle_name",userDetailsServiceInstance.getMiddle_name());
        profile.addObject("passport_series",userDetailsServiceInstance.getPassport_series());
        profile.addObject("passport_number",userDetailsServiceInstance.getPassport_number());
        profile.addObject("issued_by",userDetailsServiceInstance.getIssued_by());
        profile.addObject("date_of_issue",userDetailsServiceInstance.getDate_of_issue());
        profile.addObject("bank_id",userDetailsServiceInstance.getBank_id());

        return profile;
    }

}
