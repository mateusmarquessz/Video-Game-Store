package com.example.VideoGameStore.Repository;
import com.example.VideoGameStore.Entity.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GameRepository extends JpaRepository<Game, Long> {
    @Query("SELECT g FROM Game g WHERE " +
            "(:category IS NULL OR g.genre IN :category) AND " +
            "(:platform IS NULL OR g.typeOfSupport IN :platform) AND " +
            "(:minPrice IS NULL OR g.price >= :minPrice) AND " +
            "(:maxPrice IS NULL OR g.price <= :maxPrice)")
    List<Game> findGamesByFilters(
            @Param("category") List<String> categories,
            @Param("platform") List<String> platforms,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice
    );
}
