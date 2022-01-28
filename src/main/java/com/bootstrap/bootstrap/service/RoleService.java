package com.bootstrap.bootstrap.service;

import com.bootstrap.bootstrap.model.Role;
import com.bootstrap.bootstrap.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class RoleService {

    private final RoleRepository roleRepository;

    @Autowired
    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    public List<Role> allRoles() {
        return roleRepository.findAll();
    }

    public Role saveRole(Role role) {
        return roleRepository.save(role);
    }

    public Role getRole(Long id) {
        return roleRepository.getOne(id);
    }

    public Set<Role> setRole(Long index) {
        Set<Role> rolesSet = new HashSet<>();
        if (index == 1) {
            rolesSet.add(getRole(1L));
        } else if (index == 2) {
            rolesSet.add(getRole(2L));
        } else if (index == 3) {
            rolesSet.add(getRole(1L));
            rolesSet.add(getRole(2L));
        }
        return rolesSet;
    }
}