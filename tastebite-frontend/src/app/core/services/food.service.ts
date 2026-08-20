import { Injectable, inject } from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable,
  map
} from 'rxjs';

import { environment } from '../../../app/environments/environment'


// ======================================================
// FOOD INTERFACE
// ======================================================

export interface Food {

  id: number;

  name: string;

  description: string;

  price: number;

  image: string;

  category: string;

  available: boolean;

  featured: boolean;

}


// ======================================================
// UPLOAD RESPONSE
// ======================================================

export interface ImageUploadResponse {

  imageUrl: string;

}


// ======================================================
// FOOD SERVICE
// ======================================================

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  private readonly http =
    inject(HttpClient);


  // ====================================================
  // API URL
  // ====================================================

  private readonly apiUrl =
    `${environment.apiUrl}/api/foods`;


  // ====================================================
  // GET ALL FOODS
  // ====================================================

  getAllFoods(): Observable<Food[]> {

    console.log(
      'Loading all foods...'
    );

    return this.http.get<Food[]>(
      this.apiUrl
    );

  }


  // ====================================================
  // GET FOODS
  //
  // Kept for compatibility with existing components.
  // ====================================================

  getFoods(): Observable<Food[]> {

    return this.getAllFoods();

  }


  // ====================================================
  // GET FOOD BY ID
  // ====================================================

  getFoodById(
    id: number
  ): Observable<Food> {

    console.log(
      'Loading food:',
      id
    );

    return this.http.get<Food>(
      `${this.apiUrl}/${id}`
    );

  }


  // ====================================================
  // UPLOAD FOOD IMAGE
  // ====================================================

  uploadImage(
    file: File
  ): Observable<ImageUploadResponse> {

    const formData =
      new FormData();


    formData.append(
      'file',
      file
    );


    console.log(
      'Uploading image:',
      file.name
    );


    return this.http.post<ImageUploadResponse>(
      `${this.apiUrl}/upload`,
      formData
    );

  }


  // ====================================================
  // CREATE FOOD
  // ====================================================

  createFood(
    food: Partial<Food> & {
      imageUrl?: string;
    }
  ): Observable<Food> {

    /*
     * The frontend upload API returns:
     *
     * {
     *   imageUrl: "/uploads/foods/example.jpg"
     * }
     *
     * But the backend FoodRequest expects:
     *
     * {
     *   image: "/uploads/foods/example.jpg"
     * }
     *
     * Therefore we normalize it here.
     */

    const payload = {

      name:
        food.name ?? '',

      description:
        food.description ?? '',

      price:
        Number(food.price ?? 0),

      image:
        food.image ??
        food.imageUrl ??
        '',

      category:
        food.category ?? '',

      available:
        food.available ?? true,

      featured:
        food.featured ?? false

    };


    console.log(
      'Creating food with payload:',
      payload
    );


    return this.http.post<Food>(
      this.apiUrl,
      payload
    );

  }


  // ====================================================
  // UPDATE FOOD
  // ====================================================

  updateFood(
    id: number,
    food: Partial<Food> & {
      imageUrl?: string;
    }
  ): Observable<Food> {

    /*
     * IMPORTANT:
     *
     * Backend expects "image"
     * NOT "imageUrl".
     */

    const payload = {

      name:
        food.name ?? '',

      description:
        food.description ?? '',

      price:
        Number(food.price ?? 0),

      image:
        food.image ??
        food.imageUrl ??
        '',

      category:
        food.category ?? '',

      available:
        food.available ?? true,

      featured:
        food.featured ?? false

    };


    console.log(
      'Updating food:',
      id
    );


    console.log(
      'Update payload:',
      payload
    );


    return this.http.put<Food>(
      `${this.apiUrl}/${id}`,
      payload
    );

  }


  // ====================================================
  // DELETE FOOD
  // ====================================================

  deleteFood(
    id: number
  ): Observable<void> {

    console.log(
      'Deleting food:',
      id
    );


    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );

  }


  // ====================================================
  // GET FOODS BY CATEGORY
  // ====================================================

  getFoodsByCategory(
    category: string
  ): Observable<Food[]> {

    /*
     * We can use the backend category endpoint.
     */

    return this.http.get<Food[]>(
      `${this.apiUrl}/category/${encodeURIComponent(category)}`
    );

  }


  // ====================================================
  // GET FEATURED FOODS
  // ====================================================

  getFeaturedFoods(): Observable<Food[]> {

    return this.http.get<Food[]>(
      `${this.apiUrl}/featured`
    );

  }


  // ====================================================
  // IMAGE URL
  // ====================================================

  getImageUrl(
    image?: string | null
  ): string {

    /*
     * No image
     */

    if (!image) {

      return 'assets/images/food-placeholder.jpg';

    }


    /*
     * Already a complete URL
     */

    if (
      image.startsWith('http://') ||
      image.startsWith('https://')
    ) {

      return image;

    }


    /*
     * Backend relative path
     *
     * Example:
     *
     * /uploads/foods/abc.jpg
     *
     * becomes:
     *
     * ${environment.apiUrl}/uploads/foods/abc.jpg
     */

    if (
      image.startsWith('/')
    ) {

      return `${environment.apiUrl}${image}`;

    }


    /*
     * If the backend returns:
     *
     * uploads/foods/abc.jpg
     *
     * add the slash automatically.
     */

    return `${environment.apiUrl}/${image}`;

  }


  // ====================================================
  // SEARCH FOODS
  // ====================================================

  searchFoods(
    searchTerm: string
  ): Observable<Food[]> {

    const term =
      searchTerm
        .trim()
        .toLowerCase();


    if (!term) {

      return this.getAllFoods();

    }


    return this.getAllFoods().pipe(

      map((foods: Food[]) =>

        foods.filter(
          (food: Food) =>

            food.name
              .toLowerCase()
              .includes(term)

            ||

            food.description
              .toLowerCase()
              .includes(term)

            ||

            food.category
              .toLowerCase()
              .includes(term)

        )

      )

    );

  }

}