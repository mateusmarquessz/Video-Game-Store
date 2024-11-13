package com.example.VideoGameStore.Repository;
import com.example.VideoGameStore.Entity.GameKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GameKeyRepository extends JpaRepository<GameKey, Long> {

}
