import { Component } from '@angular/core';
import { Container } from '../../../../shared/components/container/container';
import { GALLERY } from '../../data/gallery.data';

@Component({
  selector: 'app-gallery',
  imports: [Container],
  templateUrl: './gallery.html',
  styleUrl: './gallery.css',
})
export class Gallery {
  images = GALLERY;
}