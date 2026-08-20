import {
  ChangeDetectorRef,
  Component,
  inject
} from '@angular/core';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  Router,
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import {
  finalize
} from 'rxjs';

import {
  Food,
  FoodService
} from '../../../../core/services/food.service';


@Component({
  selector: 'app-food-form',

  standalone: true,

  imports: [
    ReactiveFormsModule,
    RouterLink
  ],

  templateUrl: './food-form.html'
})
export class FoodForm {

  private readonly foodService =
    inject(FoodService);

  private readonly router =
    inject(Router);

  private readonly route =
    inject(ActivatedRoute);


  // ==================================================
  // STATE
  // ==================================================

  foodId: number | null = null;

  editing = false;

  loading = false;

  uploadingImage = false;


  // ==================================================
  // IMAGE
  // ==================================================

  selectedFile: File | null = null;

  imagePreview: string | null = null;

  uploadMessage = '';

  uploadError = '';


  // ==================================================
  // CATEGORIES
  // ==================================================

  categories = [
    'Pizza',
    'Burger',
    'Pasta',
    'Indian',
    'Chinese',
    'Dessert',
    'Drinks',
    'Salad'
  ];


  // ==================================================
  // FORM
  // ==================================================

  foodForm = new FormGroup({

    name: new FormControl(
      '',
      {
        nonNullable: true,
        validators: [
          Validators.required
        ]
      }
    ),

    description: new FormControl(
      '',
      {
        nonNullable: true,
        validators: [
          Validators.required
        ]
      }
    ),

    price: new FormControl(
      0,
      {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.min(0.01)
        ]
      }
    ),

    category: new FormControl(
      '',
      {
        nonNullable: true,
        validators: [
          Validators.required
        ]
      }
    ),

    imageUrl: new FormControl(
      '',
      {
        nonNullable: true,
        validators: [
          Validators.required
        ]
      }
    ),

    available: new FormControl(
      true,
      {
        nonNullable: true
      }
    ),

    featured: new FormControl(
      false,
      {
        nonNullable: true
      }
    )

  });


  // ==================================================
  // CONSTRUCTOR
  // ==================================================

  constructor(
    private readonly cdr: ChangeDetectorRef
  ) {

    const id =
      this.route.snapshot.paramMap.get('id');

    if (id) {

      const parsedId =
        Number(id);

      if (
        !Number.isNaN(parsedId) &&
        parsedId > 0
      ) {

        this.foodId = parsedId;

        this.editing = true;

        this.loadFood(parsedId);
      }
    }
  }


  // ==================================================
  // LOAD FOOD
  // ==================================================

  loadFood(
    id: number
  ): void {

    console.log(
      'Loading food:',
      id
    );

    this.loading = true;

    this.foodService
      .getFoodById(id)
      .pipe(
        finalize(() => {

          this.loading = false;

          console.log(
            'Finished loading food.'
          );

        })
      )
      .subscribe({

        next: (food: Food) => {

          console.log(
            'Food loaded:',
            food
          );


          const imageUrl =
            food.image ||
            '';


          this.foodForm.patchValue({

            name:
              food.name || '',

            description:
              food.description || '',

            price:
              food.price ?? 0,

            category:
              food.category || '',

            imageUrl:
              imageUrl,

            available:
              food.available ?? true,

            featured:
              food.featured ?? false

          });


          // Existing image preview

          if (imageUrl) {

            this.imagePreview =
              this.getImageUrl(
                imageUrl
              );

          } else {

            this.imagePreview = null;
          }
        },


        error: (error) => {

          console.error(
            'Failed to load food:',
            error
          );

          alert(
            error?.error?.message ||
            'Unable to load food.'
          );

          this.router.navigate([
            '/admin/foods'
          ]);
        }

      });
  }


  // ==================================================
  // SELECT IMAGE
  // ==================================================

  onFileSelected(
    event: Event
  ): void {

    const input =
      event.target as HTMLInputElement;


    if (
      !input.files ||
      input.files.length === 0
    ) {

      return;
    }


    const file =
      input.files[0];


    // Validate image

    if (
      !file.type.startsWith(
        'image/'
      )
    ) {

      alert(
        'Please select a valid image.'
      );

      input.value = '';

      return;
    }


    // Maximum 5 MB

    const maxSize =
      5 * 1024 * 1024;

    if (file.size > maxSize) {

      alert(
        'Image size must be less than 5 MB.'
      );

      input.value = '';

      return;
    }


    this.selectedFile =
      file;

    this.uploadMessage = '';

    this.uploadError = '';


    // Local preview immediately

    const reader =
      new FileReader();


    reader.onload = () => {

      this.imagePreview =
        reader.result as string;

      this.cdr.detectChanges();
    };


    reader.readAsDataURL(file);


    // Upload

    this.uploadImage(file);
  }


  // ==================================================
  // UPLOAD IMAGE
  // ==================================================

  uploadImage(file: File): void {

    if (!file) {

      return;
    }


    this.uploadingImage = true;

    console.log(
      'Uploading image:',
      file.name
    );


    this.foodService
      .uploadImage(file)
      .pipe(

        finalize(() => {

          this.uploadingImage =
            false;

          this.cdr.detectChanges();

          console.log(
            'Finished image upload.'
          );

        })

      )
      .subscribe({

        next: (
          response
        ) => {

          console.log(
            'Image uploaded:',
            response
          );


          if (
            !response ||
            !response.imageUrl
          ) {

            this.uploadError =
              'Server did not return an image URL.';

            return;
          }


          // Save backend image URL

          this.foodForm.patchValue({

            imageUrl:
              response.imageUrl

          });


          // Use FoodService to build image URL

          this.imagePreview =
            this.getImageUrl(
              response.imageUrl
            );


          this.uploadMessage =
            'Image uploaded successfully.';


          this.selectedFile =
            file;


          // Force Angular to refresh the UI immediately

          this.cdr.detectChanges();
        },


        error: (error) => {

          console.error(
            'Image upload failed:',
            error
          );


          this.uploadError =
            error?.error?.message ||
            'Image upload failed. Please try again.';


          this.foodForm.patchValue({
            imageUrl: ''
          });


          this.imagePreview =
            null;


          this.selectedFile =
            null;

          this.cdr.detectChanges();

          alert(
            'Failed to upload image.'
          );
        }

      });
  }


  // ==================================================
  // IMAGE URL
  // ==================================================

  getImageUrl(
    imageUrl?: string | null
  ): string {

    return this.foodService.getImageUrl(
      imageUrl
    );

  }


  // ==================================================
  // SUBMIT
  // ==================================================

  submit(): void {

    console.log(
      'Submit clicked'
    );


    // Don't submit while image uploading

    if (
      this.uploadingImage
    ) {

      alert(
        'Please wait until the image upload is completed.'
      );

      return;
    }


    // Validate

    if (
      this.foodForm.invalid
    ) {

      this.foodForm.markAllAsTouched();

      console.log(
        'Form invalid:',
        this.foodForm.value
      );

      return;
    }


    if (this.loading) {

      return;
    }


    this.loading = true;


    const data =
      this.foodForm.getRawValue();


    console.log(
      'Food data:',
      data
    );


    // ==================================================
    // UPDATE
    // ==================================================

    if (
      this.editing &&
      this.foodId !== null
    ) {

      console.log(
        'Updating food:',
        this.foodId
      );


      this.foodService
        .updateFood(
          this.foodId,
          data
        )
        .pipe(

          finalize(() => {

            this.loading =
              false;

          })

        )
        .subscribe({

          next: (
            response
          ) => {

            console.log(
              'Food updated successfully:',
              response
            );


            alert(
              'Food updated successfully.'
            );


            this.router.navigate([
              '/admin/foods'
            ]);
          },


          error: (error) => {

            console.error(
              'Update food error:',
              error
            );


            alert(
              error?.error?.message ||
              'Failed to update food.'
            );
          }

        });


      return;
    }


    // ==================================================
    // CREATE
    // ==================================================

    console.log(
      'Creating food'
    );


    this.foodService
      .createFood(data)
      .pipe(

        finalize(() => {

          this.loading =
            false;

        })

      )
      .subscribe({

        next: (
          response
        ) => {

          console.log(
            'Food created successfully:',
            response
          );


          alert(
            'Food created successfully.'
          );


          this.router.navigate([
            '/admin/foods'
          ]);
        },


        error: (error) => {

          console.error(
            'Create food error:',
            error
          );


          alert(
            error?.error?.message ||
            'Failed to create food.'
          );
        }

      });
  }

}