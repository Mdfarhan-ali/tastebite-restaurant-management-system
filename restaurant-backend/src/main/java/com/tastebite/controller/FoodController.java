package com.tastebite.controller;

import com.tastebite.dto.FoodRequest;
import com.tastebite.dto.FoodResponse;
import com.tastebite.service.FileStorageService;
import com.tastebite.service.FoodService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/foods")
public class FoodController {


    private final FoodService foodService;

    private final FileStorageService fileStorageService;


    public FoodController(
            FoodService foodService,
            FileStorageService fileStorageService
    ) {

        this.foodService =
                foodService;

        this.fileStorageService =
                fileStorageService;
    }


    // ==================================================
    // GET ALL FOODS
    // ==================================================

    @GetMapping
    public ResponseEntity<List<FoodResponse>>
    getAllFoods() {

        return ResponseEntity.ok(
                foodService.getAllFoods()
        );
    }


    // ==================================================
    // GET FOOD BY ID
    // ==================================================

    @GetMapping("/{id}")
    public ResponseEntity<FoodResponse>
    getFoodById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                foodService.getFoodById(id)
        );
    }


    // ==================================================
    // UPLOAD FOOD IMAGE
    // ==================================================

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>>
    uploadImage(
            @RequestParam("file")
            MultipartFile file
    ) {

        String imageUrl =
                fileStorageService
                        .storeFoodImage(file);


        return ResponseEntity.ok(
                Map.of(
                        "imageUrl",
                        imageUrl
                )
        );
    }


    // ==================================================
    // CREATE FOOD
    // ==================================================

    @PostMapping
    public ResponseEntity<FoodResponse>
    createFood(
            @Valid
            @RequestBody FoodRequest request
    ) {

        FoodResponse response =
                foodService.createFood(
                        request
                );


        return ResponseEntity
                .status(
                        HttpStatus.CREATED
                )
                .body(response);
    }


    // ==================================================
    // UPDATE FOOD
    // ==================================================

    @PutMapping("/{id}")
    public ResponseEntity<FoodResponse>
    updateFood(
            @PathVariable Long id,

            @Valid
            @RequestBody FoodRequest request
    ) {

        FoodResponse response =
                foodService.updateFood(
                        id,
                        request
                );


        return ResponseEntity.ok(
                response
        );
    }


    // ==================================================
    // DELETE FOOD
    // ==================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void>
    deleteFood(
            @PathVariable Long id
    ) {

        foodService.deleteFood(id);

        return ResponseEntity
                .noContent()
                .build();
    }


    // ==================================================
    // GET BY CATEGORY
    // ==================================================

    @GetMapping("/category/{category}")
    public ResponseEntity<List<FoodResponse>>
    getFoodsByCategory(
            @PathVariable String category
    ) {

        return ResponseEntity.ok(
                foodService
                        .getFoodsByCategory(
                                category
                        )
        );
    }


    // ==================================================
    // GET FEATURED
    // ==================================================

    @GetMapping("/featured")
    public ResponseEntity<List<FoodResponse>>
    getFeaturedFoods() {

        return ResponseEntity.ok(
                foodService.getFeaturedFoods()
        );
    }
}