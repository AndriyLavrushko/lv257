package edu.softserve.service;

import edu.softserve.dao.RoleDAO;
import edu.softserve.dao.UserDAO;
import edu.softserve.dto.UserDTO;
import edu.softserve.entity.Privilege;
import edu.softserve.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {

    @Autowired
    UserDAO userDAO;
    @Autowired
    RoleDAO roleDAO;


    @Transactional
    public User getUserForSpring (String email){
        User user = userDAO.findByEmail(email);/*
        System.out.println("User extracted");
       Role role = user.getRole();
        System.out.println("Role extracted");*/
        ArrayList<Privilege> privileges = new ArrayList<>(user.getRole().getPrivileges());
        System.out.println("Privileges extracted");
        return user;
    }

    @Transactional
    public User getUserById (Long id){
        User user = userDAO.findById(id);

        return user;
    }

    public List<User> getAllUsers(){
        System.out.println(userDAO.getAllUsers());
        return userDAO.getAllUsers();
    }

    public User registerNewUserAccount(final UserDTO userDTO) /*throws UserAlreadyExistException */{
        /*if (emailExist(userDTO.getEmail())) {
            //throw new UserAlreadyExistException("There is an account with that email adress: " + userDTO.getEmail());
            throw new UserAlreadyExistException("There is an account with that email adress: " + userDTO.getEmail());
        }*/
        final User user = new User();

        System.out.println("setting password from DTO");
        user.setPassword(userDTO.getPassword());
        user.setUsername(userDTO.getEmail());
        //user.setUsing2FA(userDTO.isUsing2FA());
        user.setRole(roleDAO.findByName("ROLE_USER"));
        return userDAO.addUser(user);
    }

    private boolean emailExist(final String email) {
        return userDAO.findByEmail(email) != null;
    }

}
