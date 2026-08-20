package com.tastebite.service;

import com.tastebite.dto.FoodRequest;
import com.tastebite.dto.FoodResponse;
import com.tastebite.entity.Food;
import com.tastebite.repository.FoodRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FoodService {

    private final FoodRepository foodRepository;

    public FoodService(FoodRepository foodRepository) {
        this.foodRepository = foodRepository;
    }

    public List<FoodResponse> getAllFoods() {

        return foodRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public FoodResponse getFoodById(Long id) {

        Food food = foodRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Food not found with id: " + id
                        )
                );

        return toResponse(food);
    }

    public FoodResponse createFood(FoodRequest request) {

        Food food = Food.builder()
                .name(request.name())
                .description(request.description())
                .price(request.price())
                .image(request.image())
                .category(request.category())
                .available(
                        request.available() != null
                                ? request.available()
                                : true
                )
                .featured(
                        request.featured() != null
                                ? request.featured()
                                : false
                )
                .build();

        Food savedFood = foodRepository.save(food);

        return toResponse(savedFood);
    }

    public FoodResponse updateFood(
            Long id,
            FoodRequest request
    ) {

        Food food = foodRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Food not found with id: " + id
                        )
                );

        food.setName(request.name());
        food.setDescription(request.description());
        food.setPrice(request.price());
        food.setImage(request.image());
        food.setCategory(request.category());

        if (request.available() != null) {
            food.setAvailable(request.available());
        }

        if (request.featured() != null) {
            food.setFeatured(request.featured());
        }

        Food updatedFood = foodRepository.save(food);

        return toResponse(updatedFood);
    }

    public void deleteFood(Long id) {

        if (!foodRepository.existsById(id)) {
            throw new RuntimeException(
                    "Food not found with id: " + id
            );
        }

        foodRepository.deleteById(id);
    }

    public List<FoodResponse> getFoodsByCategory(
            String category
    ) {

        return foodRepository
                .findByAvailableTrueAndCategory(category)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<FoodResponse> getFeaturedFoods() {

        return foodRepository
                .findByFeaturedTrue()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private FoodResponse toResponse(Food food) {

        return new FoodResponse(
                food.getId(),
                food.getName(),
                food.getDescription(),
                food.getPrice(),
                food.getImage(),
                food.getCategory(),
                food.getAvailable(),
                food.getFeatured()
        );
    }
}