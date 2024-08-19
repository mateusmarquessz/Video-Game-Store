package com.example.VideoGameStore.Repository;
import com.example.VideoGameStore.Entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsersRepository extends JpaRepository<Users, Long> { ;
    Optional<Users> findByEmail(String email);
}
