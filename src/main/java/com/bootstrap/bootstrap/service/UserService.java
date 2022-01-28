package com.bootstrap.bootstrap.service;

import com.bootstrap.bootstrap.model.User;
import com.bootstrap.bootstrap.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleService roleService;

    @Autowired
    BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User readUser(Long id) {
        return userRepository.getOne(id);
    }

    public List<User> allUsers() {
        return userRepository.findAll();
    }

    public User createUser(User user) {
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        user.setRoles(roleService.setRole(user.getRoleInd()));
        return userRepository.save(user);
    }

    public User updateUser(User user) {
        User userOld = userRepository.getById(user.getId());
        user.setRoles(roleService.setRole(user.getRoleInd()));
        if (user.getPassword().equals(userOld.getPassword())) {
            return userRepository.save(user);
        } else {
            user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
            return userRepository.save(user);
        }
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public Optional<User> getUserByName(String name) {
        return userRepository.findByName(name);
    }

    public boolean isAllowed(Long id, Principal principal) {
        User user = getUserByName(principal.getName()).get();
        return user.getId() == id || user.getAuthorities().stream()
                .anyMatch(role -> role.getAuthority().contains("ADMIN"));
    }
}

