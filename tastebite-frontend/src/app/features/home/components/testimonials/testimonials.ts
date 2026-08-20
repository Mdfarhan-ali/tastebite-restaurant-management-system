import { Component } from '@angular/core';
import { Container } from '../../../../shared/components/container/container';
import { TESTIMONIALS } from '../../data/testimonial.data';

@Component({
  selector: 'app-testimonials',
  imports: [Container],
  templateUrl: './testimonials.html',
  styleUrl: './testimonials.css'
})
export class Testimonials {
  testimonials = TESTIMONIALS;
}