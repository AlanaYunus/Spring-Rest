package com.bootstrap.bootstrap.service;

import com.bootstrap.bootstrap.repository.UserRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        com.bootstrap.bootstrap.model.User user = userRepository.findByName(username).get();
        if (user == null) {
            throw new UsernameNotFoundException("User not found!");
        } else {
            return new User(user.getName(), user.getPassword(), user.getAuthorities());
        }
    }
}
